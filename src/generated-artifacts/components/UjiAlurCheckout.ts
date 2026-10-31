import { processCheckout } from '../src/services/checkoutService';
import { db } from '../src/db';

describe('Checkout Inventory Validation', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  test('Tolak checkout jika kuantitas diminta melebihi stok (stok 0 kg)', async () => {
    const payload = {
      customerName: 'Toko Tekstil Maju',
      productCode: 'MAJUN_PUTIH',
      quantityKg: 50,
      pricePerKg: 15000,
    };

    await expect(processCheckout(payload)).rejects.toThrow(
      'INSUFFICIENT_STOCK: Stok tersedia 0 kg, diminta 50 kg'
    );
  });

  test('Tolak checkout jika stok tercatat negatif di DB', async () => {
    const payload = {
      customerName: 'CV Sumber Makmur',
      productCode: 'MAJUN_WARNA',
      quantityKg: 10,
      pricePerKg: 10000,
    };

    await expect(processCheckout(payload)).rejects.toThrow(
      'INVALID_INVENTORY_STATE: Stok di bawah batas minimum (negatif)'
    );
  });

  test('Cegah race condition over-selling via DB transaction lock', async () => {
    const order1 = processCheckout({
      customerName: 'Buyer A',
      productCode: 'MAJUN_PUTIH',
      quantityKg: 5,
      pricePerKg: 15000,
    });

    const order2 = processCheckout({
      customerName: 'Buyer B',
      productCode: 'MAJUN_PUTIH',
      quantityKg: 5,
      pricePerKg: 15000,
    });

    const results = await Promise.allSettled([order1, order2]);
    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    const failureCount = results.filter((r) => r.status === 'rejected').length;

    expect(successCount).toBe(0);
    expect(failureCount).toBe(2);
  });
});