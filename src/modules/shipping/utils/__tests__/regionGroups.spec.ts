import { isRegionCode } from '../regionGroups';

describe('isRegionCode', () => {
  it('should return true for valid region codes', () => {
    expect(isRegionCode('US')).toBe(true);
    expect(isRegionCode('DE')).toBe(true);
    expect(isRegionCode('LATAM')).toBe(true);
  });

  it('should return false for invalid region codes', () => {
    expect(isRegionCode('BR')).toBe(false);
    expect(isRegionCode('XYZ')).toBe(false);
    expect(isRegionCode('')).toBe(false);
  });
});
