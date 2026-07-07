import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

export default function CatalogLoading() {
  return (
    <div className="min-h-screen bg-zinc-55/40 dark:bg-zinc-950 flex flex-col">
      <SiteNavbar />

      {/* Hero Header Skeleton */}
      <section className="relative overflow-hidden bg-zinc-900 dark:bg-zinc-950 py-20 animate-pulse border-b border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center space-y-4 flex flex-col items-center">
          <div className="h-6 bg-zinc-800 dark:bg-zinc-800 rounded-full w-28" />
          <div className="h-10 bg-zinc-800 dark:bg-zinc-800 rounded w-1/2" />
          <div className="h-4 bg-zinc-800 dark:bg-zinc-800 rounded w-1/3" />
        </div>
      </section>

      {/* Controls & Grid Skeleton */}
      <main className="flex-1 py-12 px-6 lg:px-8 animate-pulse">
        <div className="mx-auto max-w-6xl">
          {/* Controls Bar */}
          <div className="flex gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm mb-10">
            <div className="h-11 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex-1" />
            <div className="h-11 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-52" />
          </div>

          {/* Cards Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex flex-col border border-zinc-200/80 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm">
                {/* Image aspect */}
                <div className="aspect-[16/10] bg-zinc-200 dark:bg-zinc-850 w-full" />
                
                {/* Content info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-850 rounded w-16" />
                    <div className="h-5 bg-zinc-200 dark:bg-zinc-850 rounded w-3/4" />
                    <div className="space-y-1.5 pt-1">
                      <div className="h-3.5 bg-zinc-200 dark:bg-zinc-850 rounded w-full" />
                      <div className="h-3.5 bg-zinc-200 dark:bg-zinc-850 rounded w-5/6" />
                    </div>
                  </div>

                  {/* Uses */}
                  <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-850">
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded w-14" />
                    <div className="flex gap-1">
                      <div className="h-5 bg-zinc-200 dark:bg-zinc-850 rounded-full w-20" />
                      <div className="h-5 bg-zinc-200 dark:bg-zinc-850 rounded-full w-20" />
                      <div className="h-5 bg-zinc-200 dark:bg-zinc-850 rounded-full w-14" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-850">
                    <div className="h-8 bg-zinc-200 dark:bg-zinc-850 rounded-xl flex-1" />
                    <div className="h-8 bg-zinc-200 dark:bg-zinc-850 rounded-xl flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
