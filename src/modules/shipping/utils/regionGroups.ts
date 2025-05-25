export const regionGroups = {
  US: 'I',
  DE: 'II',
  FR: 'II',
  NL: 'II',
  ES: 'II',
  IT: 'II',
  GB: 'II',
  EU: 'III',
  LATAM: 'IV',
  ASIA: 'V',
  ME: 'V',
} as const;

export type RegionCode = keyof typeof regionGroups;

export function isRegionCode(code: string): code is RegionCode {
  return code in regionGroups;
}
