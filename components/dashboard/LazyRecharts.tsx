"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const lazyChart = (name: keyof typeof import("recharts")) =>
  dynamic<any>(() => import("recharts").then((module) => module[name] as ComponentType<any>), {
    ssr: false,
  });

export const Area = lazyChart("Area");
export const AreaChart = lazyChart("AreaChart");
export const Bar = lazyChart("Bar");
export const BarChart = lazyChart("BarChart");
export const CartesianGrid = lazyChart("CartesianGrid");
export const Cell = lazyChart("Cell");
export const Legend = lazyChart("Legend");
export const Line = lazyChart("Line");
export const LineChart = lazyChart("LineChart");
export const Pie = lazyChart("Pie");
export const PieChart = lazyChart("PieChart");
export const ResponsiveContainer = lazyChart("ResponsiveContainer");
export const Tooltip = lazyChart("Tooltip");
export const XAxis = lazyChart("XAxis");
export const YAxis = lazyChart("YAxis");
