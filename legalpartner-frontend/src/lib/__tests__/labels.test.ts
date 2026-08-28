import { describe, expect, it } from 'vitest';
import {
  CONTRACT_TYPE_OPTIONS,
  getAnalysisStateLabel,
  getContractTypeLabel,
  getFavorabilityLabel,
  isAnalysisCompleted,
  isAnalysisInProgress,
} from '../labels';

describe('labels', () => {
  it('traduce tipos de contrato y usa el fallback para desconocidos', () => {
    expect(getContractTypeLabel('rent')).toBe('Arrendamiento');
    expect(getContractTypeLabel(undefined)).toBe('General');
    expect(getContractTypeLabel('other', 'N/A')).toBe('N/A');
    expect(CONTRACT_TYPE_OPTIONS.map(o => o.value)).toEqual([
      'rent',
      'mortgage',
      'services',
      'employment',
      'transfers',
    ]);
  });

  it('traduce los estados del backend y deja pasar valores desconocidos', () => {
    expect(getAnalysisStateLabel('processed')).toBe('Completado');
    expect(getAnalysisStateLabel('weird')).toBe('weird');
    expect(isAnalysisCompleted('processed')).toBe(true);
    expect(isAnalysisInProgress('queued')).toBe(true);
    expect(isAnalysisInProgress('failed')).toBe(false);
  });

  it('simplifica la favorabilidad a Seguro/Atención/Crítico', () => {
    expect(getFavorabilityLabel('very_favorable')).toBe('Seguro');
    expect(getFavorabilityLabel('neutral')).toBe('Atención');
    expect(getFavorabilityLabel('unfavorable')).toBe('Crítico');
    expect(getFavorabilityLabel(undefined)).toBe('N/A');
  });
});
