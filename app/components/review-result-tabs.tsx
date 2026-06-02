"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { type PrdAnalysisResult } from "../../src/lib/ai/schema";

const tabs = [
  "评分卡",
  "关键问题",
  "改写建议",
  "AI 风险",
  "改进版 PRD",
  "面试讲解",
] as const;

type TabKey = (typeof tabs)[number];

const dimensionLabelMap: Record<keyof PrdAnalysisResult["dimensionScores"], string> = {
  problemDefinition: "问题定义",
  targetUser: "目标用户",
  userScenario: "用户场景",
  coreFlow: "核心流程",
  metrics: "指标设计",
  mvpScope: "MVP 范围",
  aiRisks: "AI 风险",
};

type ReviewResultTabsProps = {
  analysis: PrdAnalysisResult;
};

export function ReviewResultTabs({ analysis }: ReviewResultTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("评分卡");

  const dimensionItems = useMemo(
    () =>
      (Object.keys(analysis.dimensionScores) as Array<
        keyof PrdAnalysisResult["dimensionScores"]
      >).map((key) => {
        const item = analysis.dimensionScores[key];
        return {
          key,
          label: dimensionLabelMap[key],
          ...item,
        };
      }),
    [analysis.dimensionScores],
  );

  return (
    <div className="mt-4">
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "评分卡" ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-blue-100 bg-white p-4">
            <p className="text-xs font-medium text-blue-600">总体评分</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {analysis.overallScore} / 100
            </p>
          </div>
          {dimensionItems.map((item) => (
            <div key={item.key} className="rounded-xl border border-blue-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="text-sm font-semibold text-blue-700">
                  {item.score} / {item.maxScore}
                </p>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">原因：</span>
                {item.reason}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">改进：</span>
                {item.improvement}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === "关键问题" ? (
        <div className="space-y-3">
          {analysis.keyIssues.map((issue, index) => (
            <div
              key={`${issue.title}-${index}`}
              className="rounded-xl border border-blue-100 bg-white p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">{issue.title}</p>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  {issue.severity.toUpperCase()}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600">{issue.explanation}</p>
              <p className="mt-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">建议：</span>
                {issue.suggestion}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === "改写建议" ? (
        <div className="space-y-3">
          {analysis.rewrittenUserStories.map((story, index) => (
            <div key={`story-${index}`} className="rounded-xl border border-blue-100 bg-white p-4">
              <p className="text-xs font-medium text-blue-600">用户故事建议 {index + 1}</p>
              <p className="mt-1 text-sm text-slate-700">{story}</p>
            </div>
          ))}
          <div className="rounded-xl border border-blue-100 bg-white p-4">
            <p className="text-xs font-medium text-blue-600">验收标准建议</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {analysis.acceptanceCriteria.map((item, index) => (
                <li key={`ac-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {activeTab === "AI 风险" ? (
        <div className="space-y-3">
          {analysis.aiProductRisks.map((risk, index) => (
            <div key={`risk-${index}`} className="rounded-xl border border-blue-100 bg-white p-4">
              <p className="text-sm font-semibold text-slate-800">{risk.risk}</p>
              <p className="mt-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">为什么重要：</span>
                {risk.whyItMatters}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">缓解建议：</span>
                {risk.mitigation}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === "改进版 PRD" ? (
        <div className="rounded-xl border border-blue-100 bg-white p-4">
          <div className="prose prose-sm max-w-none text-slate-700">
            <ReactMarkdown>{analysis.improvedPRD}</ReactMarkdown>
          </div>
        </div>
      ) : null}

      {activeTab === "面试讲解" ? (
        <div className="rounded-xl border border-blue-100 bg-white p-4">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            {analysis.interviewTalkingPoints.map((point, index) => (
              <li key={`point-${index}`}>{point}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
