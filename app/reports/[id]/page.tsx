import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewResultTabs } from "../../components/review-result-tabs";
import { prdAnalysisResultSchema } from "../../../src/lib/ai/schema";
import { prisma } from "../../../src/lib/db/prisma";

const formatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

type ReportPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;

  const review = await prisma.review.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      createdAt: true,
      analysisJson: true,
      originalPrd: true,
    },
  });

  if (!review) {
    notFound();
  }

  const parsed = prdAnalysisResultSchema.safeParse(review.analysisJson);
  if (!parsed.success) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4 py-8 text-slate-900 md:px-8 md:py-10 xl:px-12">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-4 flex items-center gap-3">
            <Link href="/history" className="text-sm font-semibold text-blue-700 hover:underline">
              返回历史记录
            </Link>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            该报告数据格式异常，暂时无法渲染。请重新发起一次审查。
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4 py-8 text-slate-900 md:px-8 md:py-10 xl:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-5">
          <Link href="/history" className="text-sm font-semibold text-blue-700 hover:underline">
            返回历史记录
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{review.title}</h1>
          <p className="mt-1 text-sm text-slate-600">
            保存时间：{formatter.format(review.createdAt)} · 报告 ID：{review.id}
          </p>
        </div>

        <section className="rounded-2xl border border-blue-200 bg-white/90 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">保存的审查报告</h2>
          <ReviewResultTabs analysis={parsed.data} />
        </section>
      </div>
    </main>
  );
}
