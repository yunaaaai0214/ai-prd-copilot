import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewResultTabs } from "../../components/review-result-tabs";
import { prdAnalysisResultSchema } from "../../../src/lib/ai/schema";
import { prisma } from "../../../src/lib/db/prisma";

export const dynamic = "force-dynamic";

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

function ReportState({
  tone,
  message,
}: {
  tone: "amber" | "rose";
  message: string;
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4 py-8 text-slate-900 md:px-8 md:py-10 xl:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-4 flex items-center gap-3">
          <Link href="/history" className="text-sm font-semibold text-blue-700 hover:underline">
            返回历史记录
          </Link>
        </div>
        <div className={`rounded-2xl border p-6 text-sm shadow-sm ${toneClass}`}>{message}</div>
      </div>
    </main>
  );
}

export default async function ReportPage({ params }: ReportPageProps) {
  if (!process.env.DATABASE_URL) {
    return (
      <ReportState
        tone="amber"
        message="当前环境未配置 DATABASE_URL，暂时无法读取已保存的审查报告。请先完成数据库配置并初始化 Prisma。"
      />
    );
  }

  const { id } = await params;

  let review:
    | {
        id: string;
        title: string;
        createdAt: Date;
        analysisJson: unknown;
        originalPrd: string;
      }
    | null = null;

  try {
    review = await prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        createdAt: true,
        analysisJson: true,
        originalPrd: true,
      },
    });
  } catch (error) {
    console.error(`Failed to load review report ${id}:`, error);

    return (
      <ReportState
        tone="rose"
        message="报告暂时无法加载。请确认数据库已初始化，并且部署环境可以正常访问 DATABASE_URL。"
      />
    );
  }

  if (!review) {
    notFound();
  }

  const parsed = prdAnalysisResultSchema.safeParse(review.analysisJson);
  if (!parsed.success) {
    return (
      <ReportState
        tone="rose"
        message="这份报告的数据格式异常，暂时无法渲染。请重新发起一次审查。"
      />
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
