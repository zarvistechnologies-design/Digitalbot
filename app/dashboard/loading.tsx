export default function DashboardLoading() {
  // Avoid replacing the shared dashboard shell with a full-page skeleton
  // during route transitions.
  return <div className="min-h-screen bg-slate-50" aria-hidden="true" />;
}
