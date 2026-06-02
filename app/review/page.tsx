import { ReviewWorkbench } from "../components/review-workbench";
import {
  ReviewStatusStrip,
  WorkbenchLeftRail,
  WorkbenchRightRail,
} from "../components/workbench-panels";

export default function ReviewPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4 py-8 text-slate-900 md:px-8 md:py-10 xl:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.18),transparent_38%),radial-gradient(circle_at_90%_15%,rgba(96,165,250,0.15),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.045)_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative mx-auto w-full max-w-[2200px]">
        <section className="grid gap-6 2xl:grid-cols-[minmax(280px,1fr)_minmax(920px,1080px)_minmax(280px,1fr)] 2xl:gap-10">
          <div className="hidden 2xl:block">
            <div className="sticky top-24 mr-auto w-full max-w-[340px]">
              <WorkbenchLeftRail />
            </div>
          </div>

          <div>
            <ReviewWorkbench
              title="PRD 审查工作台"
              description="粘贴你的 PRD 后点击“开始审查”，系统将调用 AI 完成结构化评审并自动保存历史。"
            />
            <div className="mt-5">
              <ReviewStatusStrip />
            </div>
          </div>

          <div className="hidden 2xl:block">
            <div className="sticky top-24 ml-auto w-full max-w-[360px]">
              <WorkbenchRightRail />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
