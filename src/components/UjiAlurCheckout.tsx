import { processCheckout } from '../src/services/checkoutService';
import { db } from '../src/database';

describe('Checkout Inventory Validation Edge Cases', () => {
  beforeEach(async () => {
    await db.query('BEGIN');
  });

  afterEach(async () => {
    await db.query('ROLLBACK');
  });

  test('Gagal checkout jika kuantitas order > stok gudang', async () => {
    const orderPayload = {
      productCode: 'MAJUN_PUTIH',
      quantityKg: 50,
      customerName: 'Toko Sumber Barokah',
    };

    await expect(processCheckout(orderPayload)).rejects.toThrow(
      'INSUFFICIENT_STOCK: Stok MAJUN_PUTIH tidak mencukupi (Tersedia: 0 kg, Diminta: 50 kg)'
    );
  });

  test('Tolak checkout jika status stok produk negatif', async () => {
    const orderPayload = {
      productCode: 'MAJUN_WARNA',
      quantityKg: 10,
      customerName: 'Bengkel Mandiri',
    };

    await expect(processCheckout(orderPayload)).rejects.toThrow(
      'INVENTORY_LOCKED: Stok MAJUN_WARNA anomali (-200 kg). Transaksi diblokir.'
    );
  });

  test('Cegah race condition pakai SELECT FOR UPDATE', async () => {
    await db.query("UPDATE products SET stock_kg = 50 WHERE code = 'MAJUN_PUTIH'");

    const order1 = processCheckout({ productCode: 'MAJUN_PUTIH', quantityKg: 40 });
    const order2 = processCheckout({ productCode: 'MAJUN_PUTIH', quantityKg: 40 });

    const results = await Promise.allSettled([order1, order2]);
    const fulfilled = results.filter(r => r.status === 'fulfilled');
    const rejected = results.filter(r => r.status === 'rejected');

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);
  });
});