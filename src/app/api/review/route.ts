import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildPrdReviewUserPrompt,
  PRD_REVIEW_SYSTEM_PROMPT,
} from "../../../lib/ai/prompts";
import { prdAnalysisResultSchema } from "../../../lib/ai/schema";
import { prisma } from "../../../lib/db/prisma";

const reviewRequestSchema = z.object({
  title: z.string().trim().min(1, "请填写 PRD 标题。"),
  prdText: z
    .string()
    .trim()
    .min(1, "请填写 PRD 正文。")
    .min(100, "PRD 正文至少需要 100 个字符。"),
});

const scoreItemSchemaJson = {
  type: "object",
  additionalProperties: false,
  required: ["score", "maxScore", "reason", "improvement"],
  properties: {
    score: { type: "number", minimum: 0 },
    maxScore: { type: "number", exclusiveMinimum: 0 },
    reason: { type: "string" },
    improvement: { type: "string" },
  },
} as const;

const prdAnalysisResultJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "overallScore",
    "dimensionScores",
    "keyIssues",
    "rewrittenUserStories",
    "acceptanceCriteria",
    "mvpScope",
    "aiProductRisks",
    "improvedPRD",
    "interviewTalkingPoints",
  ],
  properties: {
    overallScore: { type: "number", minimum: 0, maximum: 100 },
    dimensionScores: {
      type: "object",
      additionalProperties: false,
      required: [
        "problemDefinition",
        "targetUser",
        "userScenario",
        "coreFlow",
        "metrics",
        "mvpScope",
        "aiRisks",
      ],
      properties: {
        problemDefinition: scoreItemSchemaJson,
        targetUser: scoreItemSchemaJson,
        userScenario: scoreItemSchemaJson,
        coreFlow: scoreItemSchemaJson,
        metrics: scoreItemSchemaJson,
        mvpScope: scoreItemSchemaJson,
        aiRisks: scoreItemSchemaJson,
      },
    },
    keyIssues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "severity", "explanation", "suggestion"],
        properties: {
          title: { type: "string" },
          severity: { type: "string", enum: ["high", "medium", "low"] },
          explanation: { type: "string" },
          suggestion: { type: "string" },
        },
      },
    },
    rewrittenUserStories: {
      type: "array",
      items: { type: "string" },
    },
    acceptanceCriteria: {
      type: "array",
      items: { type: "string" },
    },
    mvpScope: {
      type: "object",
      additionalProperties: false,
      required: ["mustHave", "shouldHave", "notNow"],
      properties: {
        mustHave: { type: "array", items: { type: "string" } },
        shouldHave: { type: "array", items: { type: "string" } },
        notNow: { type: "array", items: { type: "string" } },
      },
    },
    aiProductRisks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["risk", "whyItMatters", "mitigation"],
        properties: {
          risk: { type: "string" },
          whyItMatters: { type: "string" },
          mitigation: { type: "string" },
        },
      },
    },
    improvedPRD: { type: "string" },
    interviewTalkingPoints: {
      type: "array",
      items: { type: "string" },
    },
  },
} as const;

type ResponsesApiOutputContent = {
  text?: string;
};

type ResponsesApiOutputItem = {
  content?: ResponsesApiOutputContent[];
};

type ResponsesApiResult = {
  output_text?: string;
  output?: ResponsesApiOutputItem[];
};

function extractOutputText(result: ResponsesApiResult): string | null {
  if (typeof result.output_text === "string" && result.output_text.trim()) {
    return result.output_text;
  }

  if (!Array.isArray(result.output)) {
    return null;
  }

  for (const item of result.output) {
    if (!Array.isArray(item.content)) continue;
    for (const part of item.content) {
      if (typeof part.text === "string" && part.text.trim()) {
        return part.text;
      }
    }
  }

  return null;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "服务端未配置 OPENAI_API_KEY，请联系管理员。" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const input = reviewRequestSchema.parse(body);

    const userPrompt = buildPrdReviewUserPrompt({
      title: input.title,
      prdText: input.prdText,
    });

    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: PRD_REVIEW_SYSTEM_PROMPT }],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: userPrompt }],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "prd_analysis_result",
            schema: prdAnalysisResultJsonSchema,
            strict: true,
          },
        },
      }),
    });

    if (!openaiResponse.ok) {
      const detail = await openaiResponse.text();
      return NextResponse.json(
        { error: "AI 服务调用失败，请稍后重试。", detail },
        { status: 502 },
      );
    }

    const responseJson = (await openaiResponse.json()) as ResponsesApiResult;
    const outputText = extractOutputText(responseJson);

    if (!outputText) {
      return NextResponse.json(
        { error: "AI 没有返回可解析内容，请稍后重试。" },
        { status: 502 },
      );
    }

    let modelJson: unknown;
    try {
      modelJson = JSON.parse(outputText);
    } catch {
      return NextResponse.json(
        { error: "AI 返回格式异常，暂时无法解析。" },
        { status: 502 },
      );
    }

    const parsedResult = prdAnalysisResultSchema.parse(modelJson);

    const savedReview = await prisma.review.create({
      data: {
        title: input.title,
        originalPrd: input.prdText,
        analysisJson: parsedResult,
        improvedPrd: parsedResult.improvedPRD,
      },
      select: { id: true },
    });

    return NextResponse.json({
      analysis: parsedResult,
      reviewId: savedReview.id,
      reportPath: `/reports/${savedReview.id}`,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "请求参数不合法，请检查标题与 PRD 正文。",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "审查请求处理失败，请稍后重试。",
        detail: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    );
  }
}
