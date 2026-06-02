import { ReviewWorkbench } from "./components/review-workbench";
import {
  ReviewStatusStrip,
  WorkbenchLeftRail,
  WorkbenchRightRail,
} from "./components/workbench-panels";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.18),transparent_38%),radial-gradient(circle_at_90%_15%,rgba(96,165,250,0.15),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.045)_1px,transparent_1px)] bg-[size:24px_24px]" />

      <section className="relative mx-auto w-full max-w-[2200px] px-4 py-8 md:px-8 md:py-10 xl:px-12">
        <div className="rounded-2xl border border-blue-100/60 bg-white/55 p-5 shadow-[0_1px_6px_rgba(37,99,235,0.04)] backdrop-blur-[1px] md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-blue-600">
            PRODUCT REQUIREMENT REVIEW ASSISTANT
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            AI PRD Copilot
          </h1>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600 md:text-base">
            用结构化、可解释的方式审查 PRD，快速发现质量问题、改写机会与潜在交付风险。
          </p>
        </div>

        <section className="mt-5 grid gap-6 2xl:grid-cols-[minmax(280px,1fr)_minmax(920px,1080px)_minmax(280px,1fr)] 2xl:gap-10">
          <div className="hidden 2xl:block">
            <div className="sticky top-24 mr-auto w-full max-w-[340px]">
              <WorkbenchLeftRail />
            </div>
          </div>

          <div>
            <ReviewWorkbench
              title="PRD 审查工作台"
              description="在同一页面完成输入、AI 审查、历史保存与报告查看。"
            />

            <div className="mt-5">
              <ReviewStatusStrip />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-blue-200 bg-white/90 p-5 shadow-sm">
                <h2 className="text-lg font-semibold">PRD 评分</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  从完整性、清晰度和可执行性等维度快速评估文档质量。
                </p>
              </article>
              <article className="rounded-2xl border border-blue-200 bg-white/90 p-5 shadow-sm">
                <h2 className="text-lg font-semibold">改写建议</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  针对薄弱段落提供可落地改写建议，让表达更具体、更清楚。
                </p>
              </article>
              <article className="rounded-2xl border border-blue-200 bg-white/90 p-5 shadow-sm">
                <h2 className="text-lg font-semibold">AI 风险识别</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  在执行前识别模糊点、隐含假设与潜在交付风险，减少返工成本。
                </p>
              </article>
            </div>
          </div>

          <div className="hidden 2xl:block">
            <div className="sticky top-24 ml-auto w-full max-w-[360px]">
              <WorkbenchRightRail />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
