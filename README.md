# AI PRD Copilot

AI PRD Copilot 是一个基于 Next.js + TypeScript 的产品需求文档（PRD）审查工具。  
它会调用 OpenAI Responses API 输出结构化评审结果，并将历史审查保存到 SQLite（Prisma）。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- OpenAI Responses API
- Prisma + SQLite

## 快速开始

1. 安装依赖

```bash
npm install
```

2. 配置环境变量（复制 `.env.example` 为 `.env`）

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
DATABASE_URL="file:./dev.db"
```

3. 运行数据库迁移并生成 Prisma Client

```bash
npx prisma migrate dev --name init_review_history
npx prisma generate
```

4. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 主要页面

- `/review`：粘贴 PRD 并发起 AI 审查，结果会自动保存到数据库
- `/history`：查看历史审查列表
- `/reports/[id]`：查看已保存报告详情

## 开发命令

```bash
npm run lint
```

## 常见问题

1. 为什么迁移失败？
- 请确认 `.env` 中 `DATABASE_URL` 已配置，且你在项目根目录运行命令。

2. SQLite 数据库文件在哪里？
- `DATABASE_URL="file:./dev.db"` 时，数据库文件位于 `prisma/dev.db`。

3. 接口报 `OPENAI_API_KEY` 未配置
- 请在 `.env` 中设置有效的 `OPENAI_API_KEY` 并重启开发服务器。
