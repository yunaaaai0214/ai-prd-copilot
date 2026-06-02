import { z } from "zod";

export const scoreItemSchema = z.object({
  score: z.number().min(0),
  maxScore: z.number().gt(0),
  reason: z.string().min(1),
  improvement: z.string().min(1),
});

export const dimensionScoresSchema = z.object({
  problemDefinition: scoreItemSchema,
  targetUser: scoreItemSchema,
  userScenario: scoreItemSchema,
  coreFlow: scoreItemSchema,
  metrics: scoreItemSchema,
  mvpScope: scoreItemSchema,
  aiRisks: scoreItemSchema,
});

export const keyIssueSchema = z.object({
  title: z.string().min(1),
  severity: z.enum(["high", "medium", "low"]),
  explanation: z.string().min(1),
  suggestion: z.string().min(1),
});

export const mvpScopeSchema = z.object({
  mustHave: z.array(z.string().min(1)),
  shouldHave: z.array(z.string().min(1)),
  notNow: z.array(z.string().min(1)),
});

export const aiProductRiskSchema = z.object({
  risk: z.string().min(1),
  whyItMatters: z.string().min(1),
  mitigation: z.string().min(1),
});

export const prdAnalysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  dimensionScores: dimensionScoresSchema,
  keyIssues: z.array(keyIssueSchema),
  rewrittenUserStories: z.array(z.string().min(1)),
  acceptanceCriteria: z.array(z.string().min(1)),
  mvpScope: mvpScopeSchema,
  aiProductRisks: z.array(aiProductRiskSchema),
  improvedPRD: z.string().min(1),
  interviewTalkingPoints: z.array(z.string().min(1)),
});

export type ScoreItem = z.infer<typeof scoreItemSchema>;
export type DimensionScores = z.infer<typeof dimensionScoresSchema>;
export type KeyIssue = z.infer<typeof keyIssueSchema>;
export type MvpScope = z.infer<typeof mvpScopeSchema>;
export type AiProductRisk = z.infer<typeof aiProductRiskSchema>;
export type PrdAnalysisResult = z.infer<typeof prdAnalysisResultSchema>;
