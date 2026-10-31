// baleSorting.test.js
const { calculateBaleYield } = require('./baleSorting');

describe('calculateBaleYield - Uji Variasi Persentase Susut Bal', () => {
  const baleWeight = 100; // 1 bal standar = 100 kg

  test('Rendemen normal: susut dalam toleransi operasional (<= 15%)', () => {
    const input = {
      baleWeightKg: baleWeight,
      putihKg: 45,
      warnaKg: 45,
      susutKg: 10,
    };

    const result = calculateBaleYield(input);

    expect(result.susutPercent).toBe(10);
    expect(result.status).toBe('NORMAL');
    expect(result.isAnomaly).toBe(false);
  });

  test('Rendemen kritis: susut tinggi (> 20%) trigger audit sentinel', () => {
    const input = {
      baleWeightKg: baleWeight,
      putihKg: 35,
      warnaKg: 40,
      susutKg: 25,
    };

    const result = calculateBaleYield(input);

    expect(result.susutPercent).toBe(25);
    expect(result.status).toBe('HIGH_WASTE');
    expect(result.isAnomaly).toBe(true);
    expect(result.flagCategory).toBe('OPERATIONAL');
  });

  test('Batas ambang (edge case): susut tepat 20%', () => {
    const input = {
      baleWeightKg: baleWeight,
      putihKg: 40,
      warnaKg: 40,
      susutKg: 20,
    };

    const result = calculateBaleYield(input);

    expect(result.susutPercent).toBe(20);
    expect(result.status).toBe('WARNING');
    expect(result.isAnomaly).toBe(false);
  });

  test('Edge case: susut 0% (sempurna tanpa waste)', () => {
    const input = {
      baleWeightKg: baleWeight,
      putihKg: 50,
      warnaKg: 50,
      susutKg: 0,
    };

    const result = calculateBaleYield(input);

    expect(result.susutPercent).toBe(0);
    expect(result.status).toBe('NORMAL');
  });

  test('Error: berat susut minus tolak transaksi', () => {
    const input = {
      baleWeightKg: baleWeight,
      putihKg: 60,
      warnaKg: 50,
      susutKg: -10,
    };

    expect(() => calculateBaleYield(input)).toThrow('Berat susut tidak boleh negatif');
  });

  test('Error: total timbangan sortir tidak cocok dengan berat bal awal', () => {
    const input = {
      baleWeightKg: baleWeight,
      putihKg: 50,
      warnaKg: 40,
      susutKg: 5, // total 95 kg, selisih 5 kg hilang tanpa catatan
    };

    expect(() => calculateBaleYield(input)).toThrow('Total sortir tidak match berat bal');
  });

  test('Floating point: hitung presisi desimal tanpa rounding error', () => {
    const input = {
      baleWeightKg: 100,
      putihKg: 33.33,
      warnaKg: 53.33,
      susutKg: 13.34,
    };

    const result = calculateBaleYield(input);

    expect(result.susutPercent).toBeCloseTo(13.34, 2);
    expect(result.totalKg).toBeCloseTo(100, 2);
  });
});