"use client";

// Recharts inspects its direct children to compose a chart. Wrapping every
// primitive in a separate next/dynamic component prevents that composition and
// can leave otherwise valid charts blank. Keep this client-only module as the
// shared import boundary, while re-exporting the actual Recharts primitives.
export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
