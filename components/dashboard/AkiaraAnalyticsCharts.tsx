"use client";

import { MessageSquare, Package, Zap } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AkiaraAnalyticsChartsProps {
  dailyStats: { date: string; sessions: number; tickets: number }[];
  productBreakdown: Record<string, number>;
  serviceBreakdown: Record<string, number>;
  languageBreakdown: Record<string, number>;
  productLabels: Record<string, string>;
  serviceLabels: Record<string, string>;
}

const chartColors = ["#f97316", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4", "#f59e0b", "#ec4899", "#14b8a6"];
const languageLabels: Record<string, string> = { en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu" };
const tooltipStyle = {
  backgroundColor: "rgba(255,255,255,0.97)",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

export default function AkiaraAnalyticsCharts({
  dailyStats,
  productBreakdown,
  serviceBreakdown,
  languageBreakdown,
  productLabels,
  serviceLabels,
}: AkiaraAnalyticsChartsProps) {
  const productData = Object.entries(productBreakdown)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({ name: productLabels[key] || key, value }));
  const serviceData = Object.entries(serviceBreakdown)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({ name: serviceLabels[key] || key, value }));

  return (
    <div className="grid grid-cols-1 gap-3 mb-6 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 lg:col-span-1">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <MessageSquare className="h-4 w-4 text-orange-500" /> Daily Trend
        </h3>
        {dailyStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyStats}>
              <defs>
                <linearGradient id="akSessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickFormatter={(date: string) => date.slice(5)} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="sessions" stroke="#f97316" fill="url(#akSessGrad)" strokeWidth={2} name="Sessions" />
              <Area type="monotone" dataKey="tickets" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Tickets" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-20 text-center text-sm text-slate-400">No trend data for this period</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Package className="h-4 w-4 text-orange-500" /> By Product
        </h3>
        {productData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={productData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5}>
                {productData.map((entry, index) => (
                  <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-10 text-center text-sm text-slate-400">No product data yet</p>
        )}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Languages</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(languageBreakdown).filter(([, value]) => value > 0).map(([key, value]) => (
              <span key={key} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
                {languageLabels[key] || key}: {value}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Zap className="h-4 w-4 text-emerald-500" /> By Service Type
        </h3>
        {serviceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={serviceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" fontSize={10} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={9} width={100} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#f97316" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-20 text-center text-sm text-slate-400">No service data yet</p>
        )}
      </div>
    </div>
  );
}
