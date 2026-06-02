import Link from "next/link";
import { prdAnalysisResultSchema } from "../../src/lib/ai/schema";
import { prisma } from "../../src/lib/db/prisma";

export const dynamic = "force-dynamic";

const formatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function DatabaseUnavailableState() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800 shadow-sm">
      <p className="font-semibold">未检测到数据库配置</p>
      <p className="mt-2">
        这个页面需要读取历史审查记录。请先在部署环境中配置
        <code className="mx-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs">DATABASE_URL</code>
        ，并完成 Prisma 数据库初始化。
      </p>
    </div>
  );
}

function DatabaseErrorState() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
      历史记录暂时无法加载。请确认数据库已初始化，并且部署环境可以正常访问
      <code className="mx-1 rounded bg-rose-100 px-1.5 py-0.5 text-xs">DATABASE_URL</code>。
    </div>
  );
}

export default async function HistoryPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4 py-8 text-slate-900 md:px-8 md:py-10 xl:px-12">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">审查历史</h1>
            <Link
              href="/review"
              className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              新建审查
            </Link>
          </div>
          <DatabaseUnavailableState />
        </div>
      </main>
    );
  }

  let reviews:
    | Array<{
        id: string;
        title: string;
        createdAt: Date;
        analysisJson: unknown;
      }>
    | null = null;

  try {
    reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        analysisJson: true,
      },
    });
  } catch (error) {
    console.error("Failed to load review history:", error);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4 py-8 text-slate-900 md:px-8 md:py-10 xl:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">审查历史</h1>
          <Link
            href="/review"
            className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            新建审查
          </Link>
        </div>

        {reviews === null ? (
          <DatabaseErrorState />
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-blue-200 bg-white/90 p-6 text-sm text-slate-600 shadow-sm">
            暂无历史记录。完成一次 PRD 审查后，结果会自动保存到这里。
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => {
              const parsed = prdAnalysisResultSchema.safeParse(review.analysisJson);
              const overallScore = parsed.success ? parsed.data.overallScore : null;

              return (
                <Link
                  key={review.id}
                  href={`/reports/${review.id}`}
                  className="block rounded-2xl border border-blue-200 bg-white/90 p-5 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-slate-900">{review.title}</p>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {overallScore !== null ? `总分 ${overallScore}` : "总分不可用"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    创建时间：{formatter.format(review.createdAt)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
