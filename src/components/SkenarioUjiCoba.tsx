const { calculateBaleYield } = require('./baleService');

describe('calculateBaleYield - Logika Rendemen & Variasi Susut', () => {
  // 1. Kasus Normal (< 15%)
  test('Susut normal 5%: hitung rendemen akurat tanpa anomali', () => {
    const input = {
      grossWeightKg: 100,
      whiteYieldKg: 65,
      colorYieldKg: 30,
      wasteKg: 5,
    };

    const result = calculateBaleYield(input);

    expect(result.wastePercent).toBe(5);
    expect(result.whitePercent).toBe(65);
    expect(result.colorPercent).toBe(30);
    expect(result.isAnomaly).toBe(false);
    expect(result.status).toBe('APPROVED');
  });

  // 2. Anomali Audit (> 20%)
  test('Susut tinggi 25%: picu flag audit anomali HIGH', () => {
    const input = {
      grossWeightKg: 100,
      whiteYieldKg: 45,
      colorYieldKg: 30,
      wasteKg: 25,
    };

    const result = calculateBaleYield(input);

    expect(result.wastePercent).toBe(25);
    expect(result.isAnomaly).toBe(true);
    expect(result.severity).toBe('HIGH');
    expect(result.status).toBe('FLAGGED_FOR_AUDIT');
  });

  // 3. Batas Ambang Tepat 20%
  test('Susut batas 20%: status toleransi maksimal', () => {
    const input = {
      grossWeightKg: 200,
      whiteYieldKg: 100,
      colorYieldKg: 60,
      wasteKg: 40,
    };

    const result = calculateBaleYield(input);

    expect(result.wastePercent).toBe(20);
    expect(result.isAnomaly).toBe(false);
  });

  // 4. Edge Case: Susut 0%
  test('Susut 0%: lolos tanpa error pembagian atau null', () => {
    const input = {
      grossWeightKg: 150,
      whiteYieldKg: 100,
      colorYieldKg: 50,
      wasteKg: 0,
    };

    const result = calculateBaleYield(input);

    expect(result.wastePercent).toBe(0);
    expect(result.isAnomaly).toBe(false);
  });

  // 5. Edge Case: Susut 100% (Bal Rusak Total)
  test('Susut 100%: tandai CRITICAL, tolak pembaruan stok majun', () => {
    const input = {
      grossWeightKg: 100,
      whiteYieldKg: 0,
      colorYieldKg: 0,
      wasteKg: 100,
    };

    const result = calculateBaleYield(input);

    expect(result.wastePercent).toBe(100);
    expect(result.isAnomaly).toBe(true);
    expect(result.severity).toBe('CRITICAL');
  });

  // 6. Validasi Input Tidak Valid (Minus)
  test('Waste minus: lempar ValidationError', () => {
    const input = {
      grossWeightKg: 100,
      whiteYieldKg: 70,
      colorYieldKg: 35,
      wasteKg: -5,
    };

    expect(() => calculateBaleYield(input)).toThrow('Nilai timbangan tidak boleh negatif');
  });

  // 7. Selisih Total Berat Fisik vs Timbangan Awal
  test('Total rendemen + susut != gross: lempar BalanceMismatchError', () => {
    const input = {
      grossWeightKg: 100,
      whiteYieldKg: 50,
      colorYieldKg: 30,
      wasteKg: 10, // Total 90 kg, selisih 10 kg tak tercatat
    };

    expect(() => calculateBaleYield(input)).toThrow('Total pecahan tidak cocok dengan berat kotor');
  });

  // 8. Pembulatan Pecahan Desimal
  test('Nilai float desimal: bulatkan wastePercent maksimal 2 digit desimal', () => {
    const input = {
      grossWeightKg: 95.5,
      whiteYieldKg: 55.2,
      colorYieldKg: 28.1,
      wasteKg: 12.2, // ~12.7748%
    };

    const result = calculateBaleYield(input);

    expect(result.wastePercent).toBe(12.77);
  });
});