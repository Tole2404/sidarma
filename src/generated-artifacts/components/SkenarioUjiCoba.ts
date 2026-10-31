import { calculateBaleSorting, BaleSortingError } from '../src/services/bale-sorting';

describe('Bale Sorting Yield Calculation', () => {
  const BALE_WEIGHT = 100; // 100 kg bal

  test('Normal waste (10%) hitung rendemen tepat', () => {
    const input = {
      baleWeightKg: BALE_WEIGHT,
      whiteClothKg: 60,
      colorClothKg: 30,
      wasteKg: 10,
    };

    const result = calculateBaleSorting(input);

    expect(result.wastePercentage).toBe(10);
    expect(result.whitePercentage).toBe(60);
    expect(result.colorPercentage).toBe(30);
    expect(result.isAnomaly).toBe(false);
  });

  test('Susut batas audit (>20%) tandai flag anomaly', () => {
    const input = {
      baleWeightKg: BALE_WEIGHT,
      whiteClothKg: 50,
      colorClothKg: 25,
      wasteKg: 25,
    };

    const result = calculateBaleSorting(input);

    expect(result.wastePercentage).toBe(25);
    expect(result.isAnomaly).toBe(true);
    expect(result.auditCategory).toBe('OPERATIONAL');
  });

  test('Susut 0% (zero waste) diproses valid tanpa error', () => {
    const input = {
      baleWeightKg: BALE_WEIGHT,
      whiteClothKg: 70,
      colorClothKg: 30,
      wasteKg: 0,
    };

    const result = calculateBaleSorting(input);

    expect(result.wastePercentage).toBe(0);
    expect(result.isAnomaly).toBe(false);
  });

  test('Susut 100% bal rusak total tandai severity CRITICAL', () => {
    const input = {
      baleWeightKg: BALE_WEIGHT,
      whiteClothKg: 0,
      colorClothKg: 0,
      wasteKg: BALE_WEIGHT,
    };

    const result = calculateBaleSorting(input);

    expect(result.wastePercentage).toBe(100);
    expect(result.isAnomaly).toBe(true);
    expect(result.severity).toBe('CRITICAL');
  });

  test('Susut nilai minus tolak eksekusi dengan validasi', () => {
    const input = {
      baleWeightKg: BALE_WEIGHT,
      whiteClothKg: 80,
      colorClothKg: 25,
      wasteKg: -5,
    };

    expect(() => calculateBaleSorting(input)).toThrow(
      new BaleSortingError('Berat susut tidak boleh negatif')
    );
  });

  test('Total timbangan tidak klop tolak selisih massa', () => {
    const input = {
      baleWeightKg: BALE_WEIGHT,
      whiteClothKg: 40,
      colorClothKg: 40,
      wasteKg: 10, // Total 90 kg != 100 kg
    };

    expect(() => calculateBaleSorting(input)).toThrow(
      new BaleSortingError('Total hasil sortir tidak sama dengan berat bal')
    );
  });

  test('Berat bal 0 atau negatif lempar error pembagian nol', () => {
    const input = {
      baleWeightKg: 0,
      whiteClothKg: 0,
      colorClothKg: 0,
      wasteKg: 0,
    };

    expect(() => calculateBaleSorting(input)).toThrow(
      new BaleSortingError('Berat bal harus lebih besar dari 0')
    );
  });
});