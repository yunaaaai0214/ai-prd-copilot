import Link from "next/link";

const menuButtonClassName =
  "inline-flex h-9 items-center gap-1 rounded-xl border border-blue-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50";

const menuItemClassName =
  "w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-blue-50";

function DownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-blue-500">
      <path
        d="M5.5 7.5 10 12l4.5-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-blue-100/50 bg-white/95 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-3 md:px-8 xl:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-slate-900 sm:text-lg"
        >
          <span className="inline-flex h-6 items-center rounded-md bg-blue-600 px-2 text-[10px] font-bold tracking-wide text-white">
            AI
          </span>
          AI PRD Copilot
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/history"
            className="hidden h-9 items-center rounded-xl border border-blue-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 sm:inline-flex"
          >
            历史记录
          </Link>
          <button
            type="button"
            className="hidden h-9 rounded-xl border border-blue-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 sm:inline-flex sm:items-center"
          >
            登录
          </button>
          <button
            type="button"
            className="hidden h-9 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 sm:inline-flex sm:items-center"
          >
            注册
          </button>

          <button
            type="button"
            aria-label="用户头像"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-gradient-to-b from-blue-50 to-blue-100 text-sm font-semibold text-blue-700"
          >
            A
          </button>

          <details className="relative">
            <summary className={menuButtonClassName}>
              简体中文
              <DownIcon />
            </summary>
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-blue-200 bg-white p-2 shadow-[0_8px_24px_rgba(37,99,235,0.14)]">
              <button type="button" className={menuItemClassName}>
                简体中文
              </button>
              <button type="button" className={menuItemClassName}>
                English (US)
              </button>
              <button type="button" className={menuItemClassName}>
                繁體中文
              </button>
            </div>
          </details>

          <details className="relative">
            <summary className={menuButtonClassName}>
              设置
              <DownIcon />
            </summary>
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-blue-200 bg-white p-2 shadow-[0_8px_24px_rgba(37,99,235,0.14)]">
              <p className="px-3 py-2 text-xs font-semibold tracking-wide text-blue-600">
                偏好设置
              </p>
              <button type="button" className={menuItemClassName}>
                主题：浅色（科技蓝）
              </button>
              <button type="button" className={menuItemClassName}>
                通知：开启
              </button>
              <button type="button" className={menuItemClassName}>
                审查严格度：标准
              </button>
              <button type="button" className={menuItemClassName}>
                导出格式：Markdown
              </button>
              <div className="my-1 border-t border-blue-100" />
              <button type="button" className={menuItemClassName}>
                快捷键说明
              </button>
              <button type="button" className={menuItemClassName}>
                帮助与反馈
              </button>
              <button type="button" className={menuItemClassName}>
                账户与安全
              </button>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
