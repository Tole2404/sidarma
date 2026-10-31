export default function FormBongkaranMobile() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 pb-28">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">Bongkaran Bal</h1>
        <p className="text-xs text-slate-600">Catat rendemen sortir limbah kain</p>
      </header>

      <form className="space-y-4">
        {/* Pilihan Grade Bal */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Grade Bal</label>
          <div className="grid grid-cols-3 gap-2">
            {['A1', 'B2', 'C3'].map((grade) => (
              <label key={grade} className="flex items-center justify-center h-12 rounded-lg border-2 border-slate-300 bg-white font-bold text-slate-800 active:bg-blue-600 active:text-white cursor-pointer has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700">
                <input type="radio" name="grade" value={grade} className="sr-only" />
                {grade}
              </label>
            ))}
          </div>
        </div>

        {/* Berat Awal */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Berat Bal Awal (Kg)</label>
          <input
            type="number"
            step="0.1"
            inputMode="decimal"
            placeholder="0.0"
            className="w-full h-14 px-4 text-2xl font-bold bg-white border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* Hasil Sortir */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Putih (Kg)</label>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              placeholder="0.0"
              className="w-full h-14 px-3 text-xl font-bold bg-white border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Warna (Kg)</label>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              placeholder="0.0"
              className="w-full h-14 px-3 text-xl font-bold bg-white border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Output Kalkulasi Otomatis */}
        <div className="bg-slate-200 p-3 rounded-lg grid grid-cols-2 gap-2 text-center">
          <div>
            <span className="text-xs text-slate-600 block">Susut / Waste</span>
            <span className="text-lg font-bold text-red-600">0.0 Kg</span>
          </div>
          <div>
            <span className="text-xs text-slate-600 block">Rendemen</span>
            <span className="text-lg font-bold text-emerald-700">0%</span>
          </div>
        </div>

        {/* Sticky Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200">
          <button
            type="submit"
            className="w-full h-14 bg-blue-700 active:bg-blue-800 text-white font-bold text-lg rounded-xl shadow-md flex items-center justify-center tracking-wide"
          >
            SIMPAN BONGKARAN
          </button>
        </div>
      </form>
    </div>
  );
}