import { describe, it, expect } from 'vitest';
import {
  validateReportData,
  validateFactCheckDatabase,
  ReportDataSchema,
  FactCheckDatabaseSchema,
} from '../validateReport';

describe('Data Validation', () => {
  describe('ReportDataSchema', () => {
    it('validates correct report data', () => {
      const validData = {
        metadata: {
          title: 'Test Report',
          subtitle: 'Test Subtitle',
          date: '2025-01-01',
          author: 'Test Author',
        },
        keyMetrics: {
          populationGrowth: 1000,
          populationGrowthPercent: 2.5,
          medianHomePrice: 300000,
          homePriceGrowth: 5.0,
          consumerSpendingGrowth: 3.0,
        },
        sections: [
          {
            id: 'test-section',
            title: 'Test Section',
            tldr: 'Test summary',
            content: ['Test content'],
          },
        ],
        citations: [
          {
            id: 1,
            title: 'Test Citation',
            url: 'https://example.com',
            context: 'Test context',
          },
        ],
      };

      const result = ReportDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid report data', () => {
      const invalidData = {
        metadata: {
          title: 'Test Report',
          // Missing required fields
        },
        keyMetrics: {
          populationGrowth: 'not a number', // Wrong type
          populationGrowthPercent: 2.5,
          medianHomePrice: 300000,
          homePriceGrowth: 5.0,
          consumerSpendingGrowth: 3.0,
        },
        sections: [],
        citations: [],
      };

      const result = ReportDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('FactCheckDatabaseSchema', () => {
    it('validates correct fact check database', () => {
      const validData = {
        factChecks: {
          'test-fact': {
            claim: 'Test claim',
            status: 'verified',
            confidence: 95,
            explanation: 'Test explanation',
            sources: [
              {
                title: 'Test Source',
                url: 'https://example.com',
                excerpt: 'Test excerpt',
              },
            ],
          },
        },
      };

      const result = FactCheckDatabaseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid fact check database', () => {
      const invalidData = {
        factChecks: {
          'test-fact': {
            claim: 'Test claim',
            status: 'invalid-status', // Invalid enum value
            confidence: 150, // Out of range
            explanation: 'Test explanation',
            sources: [],
          },
        },
      };

      const result = FactCheckDatabaseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('validateReportData', () => {
    it('returns true for valid data', () => {
      const validData = {
        metadata: {
          title: 'Test Report',
          subtitle: 'Test Subtitle',
          date: '2025-01-01',
          author: 'Test Author',
        },
        keyMetrics: {
          populationGrowth: 1000,
          populationGrowthPercent: 2.5,
          medianHomePrice: 300000,
          homePriceGrowth: 5.0,
          consumerSpendingGrowth: 3.0,
        },
        sections: [],
        citations: [],
      };

      const result = validateReportData(validData);
      expect(result).toBe(true);
    });

    it('returns false for invalid data', () => {
      const invalidData = {
        metadata: {
          title: 'Test Report',
          // Missing required fields
        },
        keyMetrics: {
          populationGrowth: 'not a number',
          populationGrowthPercent: 2.5,
          medianHomePrice: 300000,
          homePriceGrowth: 5.0,
          consumerSpendingGrowth: 3.0,
        },
        sections: [],
        citations: [],
      };

      const result = validateReportData(invalidData);
      expect(result).toBe(false);
    });
  });

  describe('validateFactCheckDatabase', () => {
    it('returns true for valid data', () => {
      const validData = {
        factChecks: {
          'test-fact': {
            claim: 'Test claim',
            status: 'verified',
            confidence: 95,
            explanation: 'Test explanation',
            sources: [
              {
                title: 'Test Source',
                url: 'https://example.com',
                excerpt: 'Test excerpt',
              },
            ],
          },
        },
      };

      const result = validateFactCheckDatabase(validData);
      expect(result).toBe(true);
    });

    it('returns false for invalid data', () => {
      const invalidData = {
        factChecks: {
          'test-fact': {
            claim: 'Test claim',
            status: 'invalid-status',
            confidence: 150,
            explanation: 'Test explanation',
            sources: [],
          },
        },
      };

      const result = validateFactCheckDatabase(invalidData);
      expect(result).toBe(false);
    });
  });
});
