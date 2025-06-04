/**
 * Fact-Check Validation Utilities
 * 
 * This module provides utilities to validate fact-check data and ensure
 * consistency between report content and the fact-check database.
 */

import type { Section } from '../types/report';

export interface FactCheckEntry {
  claim: string;
  status: 'verified' | 'partially-verified' | 'needs-verification' | 'needs-context' | 'needs-clarification' | 'needs-correction' | 'inaccurate' | 'unverified';
  confidence: number;
  explanation: string;
  sources: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}

export interface FactCheckDatabase {
  factChecks: Record<string, FactCheckEntry>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * Validates a single fact-check entry
 */
export function validateFactCheckEntry(
  id: string, 
  entry: FactCheckEntry
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Required fields validation
  if (!entry.claim || entry.claim.trim().length === 0) {
    errors.push(`Fact-check "${id}": Missing or empty claim`);
  }

  if (!entry.explanation || entry.explanation.trim().length === 0) {
    errors.push(`Fact-check "${id}": Missing or empty explanation`);
  }

  // Confidence validation
  if (typeof entry.confidence !== 'number' || entry.confidence < 0 || entry.confidence > 100) {
    errors.push(`Fact-check "${id}": Confidence must be a number between 0 and 100`);
  }

  // Status validation
  const validStatuses = [
    'verified', 'partially-verified', 'needs-verification', 
    'needs-context', 'needs-clarification', 'needs-correction', 
    'inaccurate', 'unverified'
  ];
  if (!validStatuses.includes(entry.status)) {
    errors.push(`Fact-check "${id}": Invalid status "${entry.status}"`);
  }

  // Sources validation
  if (!entry.sources || !Array.isArray(entry.sources)) {
    warnings.push(`Fact-check "${id}": Missing sources array`);
  } else {
    entry.sources.forEach((source, index) => {
      if (!source.title || source.title.trim().length === 0) {
        errors.push(`Fact-check "${id}": Source ${index + 1} missing title`);
      }
      if (!source.url || !isValidUrl(source.url)) {
        errors.push(`Fact-check "${id}": Source ${index + 1} missing or invalid URL`);
      }
      if (!source.excerpt || source.excerpt.trim().length === 0) {
        warnings.push(`Fact-check "${id}": Source ${index + 1} missing excerpt`);
      }
    });
  }

  // Quality suggestions
  if (entry.confidence < 50 && entry.status === 'verified') {
    suggestions.push(`Fact-check "${id}": Low confidence (${entry.confidence}%) for verified status`);
  }

  if (entry.sources && entry.sources.length === 0 && entry.confidence > 70) {
    suggestions.push(`Fact-check "${id}": High confidence (${entry.confidence}%) but no sources provided`);
  }

  if (entry.explanation.length < 50) {
    suggestions.push(`Fact-check "${id}": Explanation is quite short, consider adding more detail`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
}

/**
 * Validates the entire fact-check database
 */
export function validateFactCheckDatabase(database: FactCheckDatabase): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const allSuggestions: string[] = [];

  if (!database.factChecks || typeof database.factChecks !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid fact-check database structure'],
      warnings: [],
      suggestions: []
    };
  }

  Object.entries(database.factChecks).forEach(([id, entry]) => {
    const result = validateFactCheckEntry(id, entry);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
    allSuggestions.push(...result.suggestions);
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    suggestions: allSuggestions
  };
}

/**
 * Finds content that might need fact-checking but doesn't have entries
 */
export function findMissingFactChecks(
  sections: Section[], 
  database: FactCheckDatabase
): string[] {
  const missingFactChecks: string[] = [];
  const factCheckIds = Object.keys(database.factChecks);

  // Keywords that suggest factual claims
  const factualPatterns = [
    /\d+%/g, // Percentages
    /\$[\d,]+/g, // Dollar amounts
    /\d+,\d+/g, // Large numbers
    /\b\d+\.\d+%/g, // Decimal percentages
    /\b(median|average|unemployment rate|population|growth|employees|graduation rate|crime rate)\b/gi
  ];

  sections.forEach(section => {
    section.content.forEach((paragraph, index) => {
      const hasFactualClaims = factualPatterns.some(pattern => pattern.test(paragraph));
      
      if (hasFactualClaims) {
        // Check if this content has a corresponding fact-check
        const hasFactCheck = factCheckIds.some(id => {
          const entry = database.factChecks[id];
          return paragraph.includes(entry.claim) || entry.claim.includes(paragraph.substring(0, 50));
        });

        if (!hasFactCheck) {
          missingFactChecks.push(
            `Section "${section.title}", paragraph ${index + 1}: "${paragraph.substring(0, 100)}..."`
          );
        }
      }
    });
  });

  return missingFactChecks;
}

/**
 * Generates a fact-check coverage report
 */
export function generateCoverageReport(
  sections: Section[], 
  database: FactCheckDatabase
): {
  totalClaims: number;
  factCheckedClaims: number;
  coveragePercentage: number;
  missingFactChecks: string[];
  unusedFactChecks: string[];
} {
  const missingFactChecks = findMissingFactChecks(sections, database);
  
  // Find unused fact-checks
  const usedFactCheckIds = new Set<string>();
  const allContent = sections.flatMap(section => section.content).join(' ');
  
  Object.entries(database.factChecks).forEach(([id, entry]) => {
    if (allContent.includes(entry.claim) || entry.claim.length > 20) {
      usedFactCheckIds.add(id);
    }
  });

  const unusedFactChecks = Object.keys(database.factChecks).filter(
    id => !usedFactCheckIds.has(id)
  );

  const totalClaims = missingFactChecks.length + usedFactCheckIds.size;
  const factCheckedClaims = usedFactCheckIds.size;
  const coveragePercentage = totalClaims > 0 ? (factCheckedClaims / totalClaims) * 100 : 100;

  return {
    totalClaims,
    factCheckedClaims,
    coveragePercentage: Math.round(coveragePercentage * 100) / 100,
    missingFactChecks,
    unusedFactChecks
  };
}

/**
 * Helper function to validate URLs
 */
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Exports validation results to console with formatting
 */
export function logValidationResults(result: ValidationResult, title: string = 'Validation Results'): void {
  console.group(`📊 ${title}`);
  
  if (result.isValid) {
    console.log('✅ All validations passed!');
  } else {
    console.log('❌ Validation failed');
  }

  if (result.errors.length > 0) {
    console.group('🚨 Errors');
    result.errors.forEach(error => console.error(error));
    console.groupEnd();
  }

  if (result.warnings.length > 0) {
    console.group('⚠️ Warnings');
    result.warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }

  if (result.suggestions.length > 0) {
    console.group('💡 Suggestions');
    result.suggestions.forEach(suggestion => console.info(suggestion));
    console.groupEnd();
  }

  console.groupEnd();
} 