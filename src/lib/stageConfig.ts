import type { BadgeProps } from '../components/ui/Badge';

export interface StageConfig {
  variant: BadgeProps['variant'];
  label:   string;
  dot:     string;
}

export const OPP_STAGE_MAP: Record<string, StageConfig> = {
  'Commenced':                  { variant: 'commenced',  label: 'Commenced',     dot: '#179E6F' },
  'Pipeline First Commencement':{ variant: 'pipeline',   label: 'Pipeline',      dot: '#6D4FC2' },
  'Offer Approved Unconditional':{ variant: 'approvedU', label: 'Appr. Uncond.', dot: '#2B7FD4' },
  'Offer Approved Conditional': { variant: 'approvedC',  label: 'Appr. Cond.',   dot: '#D97706' },
  'Need More Information':      { variant: 'nmi',        label: 'Need Info',     dot: '#D97706' },
  'Void':                       { variant: 'void',       label: 'Void',          dot: '#9B9992' },
  'Duplicate Dropped':          { variant: 'duplicate',  label: 'Duplicate',     dot: '#C2507A' },
  'Application Rejected':       { variant: 'rejected',   label: 'Rejected',      dot: '#DC3545' },
};

export const LEVEL_MAP: Record<string, { variant: BadgeProps['variant']; label: string }> = {
  'Foundation':     { variant: 'foundationLvl', label: 'Found.' },
  'Undergraduate':  { variant: 'ugLvl',         label: 'UG' },
  'Postgraduate':   { variant: 'pgLvl',         label: 'PG' },
  'Diploma':        { variant: 'dipLvl',         label: 'Dip.' },
  'Language Course':{ variant: 'langLvl',        label: 'Lang.' },
  'PhD':            { variant: 'phdLvl',         label: 'PhD' },
};

export function getOppStageConfig(stage: string | null): StageConfig {
  if (!stage) return { variant: 'void', label: '—', dot: '#9B9992' };
  return OPP_STAGE_MAP[stage] ?? { variant: 'void', label: stage, dot: '#9B9992' };
}

export function getLevelConfig(level: string | null) {
  if (!level) return null;
  return LEVEL_MAP[level] ?? null;
}

export function getStudentStageConfig(stage: string): StageConfig {
  const s = stage.toLowerCase();
  if (s.includes('commenced'))    return { variant: 'commenced', label: cleanStage(stage), dot: '#179E6F' };
  if (s.includes('unconditional'))return { variant: 'approvedU', label: cleanStage(stage), dot: '#2B7FD4' };
  if (s.includes('conditional'))  return { variant: 'approvedC', label: cleanStage(stage), dot: '#D97706' };
  if (s.includes('rejected'))     return { variant: 'rejected',  label: cleanStage(stage), dot: '#DC3545' };
  if (s.includes('new'))          return { variant: 'new',       label: 'New',             dot: '#179E6F' };
  if (s.includes('pipeline'))     return { variant: 'pipeline',  label: cleanStage(stage), dot: '#6D4FC2' };
  return { variant: 'void', label: cleanStage(stage), dot: '#9B9992' };
}

function cleanStage(s: string): string {
  return s
    .replace(/\s*\(PKG\s*$/i, '')
    .replace(/\)\s*\(PKG.*$/i, '')
    .replace(/\)\s*$/i, '')
    .trim();
}
