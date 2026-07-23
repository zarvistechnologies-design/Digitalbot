export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50 lg:pl-64">
      <main className="mx-auto max-w-7xl p-4 pt-20 sm:p-8 lg:pt-8">
        <div className="mb-8 h-10 w-64 animate-pulse rounded-xl bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
        <div className="mt-6 h-96 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </main>
    </div>
  );
}
