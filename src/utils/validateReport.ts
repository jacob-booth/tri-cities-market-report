import { z } from 'zod';

// Zod schemas for data validation
export const CitationSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string().url(),
  context: z.string(),
});

export const ChartDataSchema = z.object({
  type: z.enum(['bar', 'line', 'pie']),
  title: z.string(),
  data: z.array(z.record(z.string(), z.any())),
});

export const SWOTDataSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  threats: z.array(z.string()),
});

export const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  tldr: z.string(),
  content: z.array(z.string()),
  charts: z.array(ChartDataSchema).optional(),
  swot: SWOTDataSchema.optional(),
});

export const KeyMetricsSchema = z.object({
  populationGrowth: z.number(),
  populationGrowthPercent: z.number(),
  medianHomePrice: z.number(),
  homePriceGrowth: z.number(),
  consumerSpendingGrowth: z.number(),
});

export const ReportMetadataSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  date: z.string(),
  author: z.string(),
});

export const ReportDataSchema = z.object({
  metadata: ReportMetadataSchema,
  keyMetrics: KeyMetricsSchema,
  sections: z.array(SectionSchema),
  citations: z.array(CitationSchema),
});

// Fact check schemas
export const FactCheckSourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  excerpt: z.string(),
});

export const FactCheckResultSchema = z.object({
  claim: z.string(),
  status: z.enum(['verified', 'partially-verified', 'needs-verification', 'needs-context', 'needs-clarification', 'unverified']),
  confidence: z.number().min(0).max(100),
  explanation: z.string(),
  sources: z.array(FactCheckSourceSchema),
});

export const FactCheckDatabaseSchema = z.object({
  factChecks: z.record(z.string(), FactCheckResultSchema),
});

// Validation functions
export function validateReportData(data: unknown): data is z.infer<typeof ReportDataSchema> {
  try {
    ReportDataSchema.parse(data);
    return true;
  } catch (error) {
    console.error('Report data validation failed:', error);
    return false;
  }
}

export function validateFactCheckDatabase(data: unknown): data is z.infer<typeof FactCheckDatabaseSchema> {
  try {
    FactCheckDatabaseSchema.parse(data);
    return true;
  } catch (error) {
    console.error('Fact check database validation failed:', error);
    return false;
  }
}

// Runtime validation with error handling
export async function validateAndLoadReportData(): Promise<z.infer<typeof ReportDataSchema>> {
  try {
    // Import the report data
    const reportData = await import('../data/report.json');
    const validatedData = ReportDataSchema.parse(reportData.default);
    console.log('✅ Report data validated successfully');
    return validatedData;
  } catch (error) {
    console.error('❌ Report data validation failed:', error);
    throw new Error('Invalid report data structure');
  }
}

export function validateAndLoadFactCheckDatabase(): z.infer<typeof FactCheckDatabaseSchema> {
  try {
    const factCheckData = require('../data/factCheckDatabase.json');
    const validatedData = FactCheckDatabaseSchema.parse(factCheckData);
    console.log('✅ Fact check database validated successfully');
    return validatedData;
  } catch (error) {
    console.error('❌ Fact check database validation failed:', error);
    throw new Error('Invalid fact check database structure');
  }
}

// Type exports for use in components
export type ReportData = z.infer<typeof ReportDataSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type KeyMetrics = z.infer<typeof KeyMetricsSchema>;
export type Citation = z.infer<typeof CitationSchema>;
export type ChartData = z.infer<typeof ChartDataSchema>;
export type SWOTData = z.infer<typeof SWOTDataSchema>;
export type FactCheckResult = z.infer<typeof FactCheckResultSchema>;
