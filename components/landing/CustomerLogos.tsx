const customers = [
  "Healthcare",
  "Local Services",
  "Real Estate",
  "Education",
  "Support Teams",
];

export default function CustomerLogos() {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {customers.map((customer) => (
            <div
              key={customer}
              className="flex min-h-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-center text-sm font-semibold text-slate-600"
            >
              {customer}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
