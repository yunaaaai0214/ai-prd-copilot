const statCards = [
  { label: "今日审查", value: "12", hint: "较昨日 +3" },
  { label: "平均评分", value: "82", hint: "质量稳定" },
  { label: "高风险项", value: "7", hint: "待确认需求边界" },
  { label: "最近更新", value: "2 分钟前", hint: "自动保存已开启" },
];

export function ReviewStatusStrip() {
  return (
    <section className="rounded-2xl border border-blue-200 bg-white/92 p-4 shadow-sm md:p-5">
      <p className="text-sm font-semibold text-slate-900">审查状态总览</p>
      <p className="mt-1 text-xs text-slate-500">核心指标与审查进度汇总</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <article
            key={card.label}
            className="rounded-xl border border-blue-100 bg-blue-50/60 p-3"
          >
            <p className="text-xs font-medium text-blue-600">{card.label}</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WorkbenchLeftRail() {
  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border border-blue-200 bg-white/90 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">模板库</h3>
        <p className="mt-1 text-xs text-slate-500">快速载入常见 PRD 结构模板</p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            className="w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-left text-sm text-blue-700 transition hover:bg-blue-100"
          >
            新功能探索模板
          </button>
          <button
            type="button"
            className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-blue-50"
          >
            存量改版模板
          </button>
          <button
            type="button"
            className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-blue-50"
          >
            技术方案评审模板
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-white/90 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">最近项目</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li className="rounded-lg bg-blue-50 px-3 py-2">搜索体验重构</li>
          <li className="rounded-lg bg-blue-50 px-3 py-2">结算流程优化</li>
          <li className="rounded-lg bg-blue-50 px-3 py-2">消息中心升级</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-white/90 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">审查前清单</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-4 w-4 rounded border border-blue-300 bg-white" />
            目标指标已量化
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-4 w-4 rounded border border-blue-300 bg-white" />
            非目标范围已声明
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-4 w-4 rounded border border-blue-300 bg-white" />
            风险与依赖项已补充
          </li>
        </ul>
      </section>
    </aside>
  );
}

export function WorkbenchRightRail() {
  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border border-blue-200 bg-white/90 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">评分说明</h3>
        <ul className="mt-3 space-y-2 text-xs text-slate-600">
          <li className="rounded-lg bg-blue-50 px-3 py-2">90-100: 可直接评审</li>
          <li className="rounded-lg bg-blue-50 px-3 py-2">75-89: 小幅补充后可推进</li>
          <li className="rounded-lg bg-blue-50 px-3 py-2">60-74: 需重点补全结构</li>
          <li className="rounded-lg bg-blue-50 px-3 py-2">0-59: 建议重新梳理目标</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-white/90 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">高风险关键词</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {["尽快", "后续再看", "大概", "自动化", "全量", "无影响"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-white/90 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">最近审查历史</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li className="rounded-lg bg-blue-50 px-3 py-2">
            用户分层推荐 PRD · 评分 79
          </li>
          <li className="rounded-lg bg-blue-50 px-3 py-2">
            商家工作台改版 · 评分 84
          </li>
          <li className="rounded-lg bg-blue-50 px-3 py-2">
            新手引导流程优化 · 评分 76
          </li>
        </ul>
      </section>
    </aside>
  );
}
