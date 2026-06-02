# AGENTS.md

## Project
- Name: AI PRD Copilot
- Purpose: A Next.js + TypeScript app for reviewing Product Requirement Documents (PRDs) and generating structured, helpful suggestions.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- OpenAI Responses API
- Prisma + SQLite

## Engineering Rules
- Use server actions or route handlers for all API calls.
- Never expose `OPENAI_API_KEY` to the client.
- Validate AI responses with Zod schemas before use in UI or business logic.
- Keep components small, focused, and readable.
- Prefer clear, product-oriented names for files, variables, functions, and UI copy.
- Include basic loading, error, and empty states for user-facing flows.
- When changing AI prompts, keep them in `src/lib/ai/prompts.ts`.
- Run `npm run lint` before finishing any task.

## AI and Security Guardrails
- Do not call OpenAI directly from client components.
- Keep API keys and secrets server-side only.
- Treat model output as untrusted input until validated.
- Do not present generated suggestions as absolute truth; frame them as assistive recommendations.

## Review Checklist
- Check for leaked API keys or any client-side OpenAI calls.
- Check that AI output is schema-validated with Zod.
- Check that errors are handled gracefully across server and UI boundaries.
- Check that the UI can handle long PRD text without breaking layout or usability.
- Check that generated suggestions are presented with appropriate uncertainty, not as facts.
