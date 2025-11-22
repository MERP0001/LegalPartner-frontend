import { useMemo } from 'react';
import type { ContractAnalysis } from '@/types';

export interface AnalysisStats {
  totalAnalyses: number;
  averageRisk: number;
  averageFavorability: number;
  highestRisk: number;
  lowestRisk: number;
  totalClauses: number;
  totalFlaggedClauses: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  favorableCount: number;
  unfavorableCount: number;
}

export function useAnalysisStats(analyses: ContractAnalysis[]): AnalysisStats {
  return useMemo(() => {
    if (analyses.length === 0) {
      return {
        totalAnalyses: 0,
        averageRisk: 0,
        averageFavorability: 0,
        highestRisk: 0,
        lowestRisk: 0,
        totalClauses: 0,
        totalFlaggedClauses: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
        favorableCount: 0,
        unfavorableCount: 0,
      };
    }

    const validAnalyses = analyses.filter(
      a => a.risk_score !== undefined && a.risk_score !== null
    );

    if (validAnalyses.length === 0) {
      return {
        totalAnalyses: analyses.length,
        averageRisk: 0,
        averageFavorability: 0,
        highestRisk: 0,
        lowestRisk: 0,
        totalClauses: 0,
        totalFlaggedClauses: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
        favorableCount: 0,
        unfavorableCount: 0,
      };
    }

    const riskScores = validAnalyses.map(a => a.risk_score || 0);
    const averageRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
    const highestRisk = Math.max(...riskScores);
    const lowestRisk = Math.min(...riskScores);

    // Convertir favorability a números para promediar
    const favorabilityToNumber = (fav?: string): number => {
      const map: Record<string, number> = {
        very_unfavorable: 1,
        unfavorable: 3,
        neutral: 5,
        favorable: 7,
        very_favorable: 9,
      };
      return map[fav || ''] || 5;
    };

    const favorabilityScores = validAnalyses.map(a =>
      favorabilityToNumber(a.overall_favorability)
    );
    const averageFavorability =
      favorabilityScores.reduce((a, b) => a + b, 0) / favorabilityScores.length;

    // Contar por categorías de riesgo
    const highRiskCount = riskScores.filter(r => r > 6).length;
    const mediumRiskCount = riskScores.filter(r => r > 3 && r <= 6).length;
    const lowRiskCount = riskScores.filter(r => r <= 3).length;

    // Contar por favorabilidad
    const favorableCount = validAnalyses.filter(
      a =>
        a.overall_favorability === 'favorable' ||
        a.overall_favorability === 'very_favorable'
    ).length;
    const unfavorableCount = validAnalyses.filter(
      a =>
        a.overall_favorability === 'unfavorable' ||
        a.overall_favorability === 'very_unfavorable'
    ).length;

    // Totales de cláusulas
    const totalClauses = validAnalyses.reduce(
      (sum, a) => sum + (a.total_clauses || 0),
      0
    );
    const totalFlaggedClauses = validAnalyses.reduce(
      (sum, a) => sum + (a.flagged_clauses || 0),
      0
    );

    return {
      totalAnalyses: validAnalyses.length,
      averageRisk: Math.round(averageRisk * 10) / 10,
      averageFavorability: Math.round(averageFavorability * 10) / 10,
      highestRisk: Math.round(highestRisk * 10) / 10,
      lowestRisk: Math.round(lowestRisk * 10) / 10,
      totalClauses,
      totalFlaggedClauses,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      favorableCount,
      unfavorableCount,
    };
  }, [analyses]);
}
