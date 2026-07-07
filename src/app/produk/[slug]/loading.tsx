import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-zinc-55/40 dark:bg-zinc-950 flex flex-col">
      <SiteNavbar />

      <main className="flex-1 py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Back button skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-28" />
          </div>

          {/* Product Detail Skeleton Grid */}
          <div className="grid gap-10 md:grid-cols-2 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            {/* Left side image skeleton */}
            <div className="relative aspect-[4/3] w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

            {/* Right side metadata skeleton */}
            <div className="flex flex-col justify-between py-2 animate-pulse">
              <div className="space-y-6">
                {/* Category Badge */}
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-24" />

                {/* Name */}
                <div className="space-y-2">
                  <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                </div>

                {/* Description */}
                <div className="space-y-2.5">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                </div>

                {/* Uses */}
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-850 space-y-3">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-32" />
                  <div className="grid gap-3 grid-cols-2">
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" />
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" />
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" />
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-850 space-y-4">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                <div className="flex gap-3 pt-2">
                  <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-2xl flex-1" />
                  <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-2xl flex-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
