"use client";

import Link from "next/link";
import { useState } from "react";
import {
  prdAnalysisResultSchema,
  type PrdAnalysisResult,
} from "../../src/lib/ai/schema";
import { ReviewResultTabs } from "./review-result-tabs";

const samplePrd = `# 智能搜索重构 PRD

## 背景
当前站内搜索结果相关性较低，用户在关键查询上的点击率持续下降。

## 目标
1. 提升前 3 条搜索结果点击率 15%
2. 降低“无结果”查询占比到 5% 以下

## 范围
- 重构检索排序策略
- 增加查询改写与同义词扩展
- 新增搜索质量监控看板

## 非目标
- 不在本期引入个性化推荐
- 不修改移动端视觉样式
`;

type ReviewWorkbenchProps = {
  title?: string;
  description?: string;
};

type ReviewApiSuccess = {
  analysis: PrdAnalysisResult;
  reviewId: string;
  reportPath: string;
};

export function ReviewWorkbench({ title, description }: ReviewWorkbenchProps) {
  const [prdTitle, setPrdTitle] = useState("");
  const [prdText, setPrdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [analysis, setAnalysis] = useState<PrdAnalysisResult | null>(null);
  const [reportPath, setReportPath] = useState("");

  const hasInput = prdTitle.trim().length > 0 && prdText.trim().length > 0;

  const runReview = async () => {
    const trimmedTitle = prdTitle.trim();
    const trimmedText = prdText.trim();

    if (!trimmedTitle) {
      setErrorMessage("请先填写 PRD 标题。");
      return;
    }
    if (!trimmedText) {
      setErrorMessage("请先填写 PRD 正文。");
      return;
    }
    if (trimmedText.length < 100) {
      setErrorMessage("PRD 正文至少需要 100 个字符。");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setAnalysis(null);
    setReportPath("");

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          prdText: trimmedText,
        }),
      });

      const json = (await response.json()) as unknown;
      if (!response.ok) {
        const message =
          typeof json === "object" &&
          json !== null &&
          "error" in json &&
          typeof (json as { error?: unknown }).error === "string"
            ? (json as { error: string }).error
            : "审查失败，请稍后重试。";
        throw new Error(message);
      }

      const data = json as Partial<ReviewApiSuccess>;
      const parsed = prdAnalysisResultSchema.safeParse(data.analysis);
      if (!parsed.success) {
        throw new Error("AI 返回格式不符合预期，请重试一次。");
      }

      setAnalysis(parsed.data);
      setReportPath(typeof data.reportPath === "string" ? data.reportPath : "");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "审查失败，请稍后重试。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-blue-200/80 bg-gradient-to-b from-white to-blue-50/60 p-4 shadow-[0_8px_30px_rgba(37,99,235,0.12)] md:p-6">
      {title ? (
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      ) : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-blue-200 bg-white/90 p-5 shadow-sm">
          <label
            htmlFor="prd-title"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            PRD 标题
          </label>
          <input
            id="prd-title"
            type="text"
            value={prdTitle}
            onChange={(event) => setPrdTitle(event.target.value)}
            placeholder="例如：搜索体验重构 PRD"
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <label
            htmlFor="prd-content"
            className="mb-2 mt-5 block text-sm font-medium text-slate-700"
          >
            PRD 内容（Markdown）
          </label>
          <textarea
            id="prd-content"
            value={prdText}
            onChange={(event) => setPrdText(event.target.value)}
            placeholder="在这里粘贴完整 PRD 内容..."
            className="min-h-[300px] w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:min-h-[430px]"
          />

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={runReview}
              disabled={!hasInput || isLoading}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isLoading ? "审查中..." : "开始审查"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPrdTitle("智能搜索重构 PRD");
                setPrdText(samplePrd);
                setErrorMessage("");
                setAnalysis(null);
                setReportPath("");
              }}
              className="inline-flex items-center justify-center rounded-xl border border-blue-300 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              载入示例 PRD
            </button>
          </div>

          {errorMessage ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <aside className="rounded-2xl border border-blue-200 bg-white/90 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">审查结果</h3>

          {!analysis && !isLoading ? (
            <div className="mt-4 rounded-xl border border-dashed border-blue-300 bg-blue-50/80 p-4">
              <p className="text-sm leading-relaxed text-slate-700">
                点击“开始审查”后，这里会生成结构化 AI 审查结果，包括评分卡、关键问题、改写建议、
                AI 风险、改进版 PRD 与面试讲解。
              </p>
            </div>
          ) : null}

          {isLoading ? (
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/70 p-4">
              <p className="text-sm font-medium text-blue-700">正在生成审查结果...</p>
              <p className="mt-1 text-xs text-slate-500">
                正在分析问题定义、目标用户、核心流程、MVP 范围与 AI 风险。
              </p>
            </div>
          ) : null}

          {analysis ? (
            <>
              {reportPath ? (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <Link href={reportPath} className="text-sm font-semibold text-emerald-700 hover:underline">
                    查看已保存报告
                  </Link>
                </div>
              ) : null}
              <ReviewResultTabs analysis={analysis} />
            </>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
