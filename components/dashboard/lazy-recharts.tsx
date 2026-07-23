"use client";

import dynamic from "next/dynamic";

// Keep the sizeable Recharts runtime out of the initial dashboard bundle. The
// dashboard shell and metrics become interactive first; charts stream in from
// one shared async chunk immediately afterwards.
const loadChart = (name: keyof typeof import("recharts")) =>
  dynamic<any>(() => import("recharts").then((module) => module[name] as any), {
    ssr: false,
  });

export const Area = loadChart("Area");
export const AreaChart = loadChart("AreaChart");
export const Bar = loadChart("Bar");
export const BarChart = loadChart("BarChart");
export const CartesianGrid = loadChart("CartesianGrid");
export const Cell = loadChart("Cell");
export const Legend = loadChart("Legend");
export const Line = loadChart("Line");
export const LineChart = loadChart("LineChart");
export const Pie = loadChart("Pie");
export const PieChart = loadChart("PieChart");
export const ResponsiveContainer = loadChart("ResponsiveContainer");
export const Tooltip = loadChart("Tooltip");
export const XAxis = loadChart("XAxis");
export const YAxis = loadChart("YAxis");
