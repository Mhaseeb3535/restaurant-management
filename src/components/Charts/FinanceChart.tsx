import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 35000 },
  { month: "Mar", revenue: 58000, expenses: 38000 },
  { month: "Apr", revenue: 63000, expenses: 40000 },
  { month: "May", revenue: 72000, expenses: 42000 },
  { month: "Jun", revenue: 85000, expenses: 45000 },
  { month: "Jul", revenue: 91000, expenses: 48000 },
  { month: "Aug", revenue: 78000, expenses: 44000 },
  { month: "Sep", revenue: 88000, expenses: 46000 },
  { month: "Oct", revenue: 95000, expenses: 49000 },
  { month: "Nov", revenue: 102000, expenses: 52000 },
  { month: "Dec", revenue: 120000, expenses: 55000 },
];

function FinanceChart() {
  return (
    <div className="bg-white rounded-4 shadow p-4">
      <h5 className="mb-3">Revenue vs Expenses</h5>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="revenue" stroke="#198754" fill="#198754" fillOpacity={0.2} name="Revenue" />
          <Area type="monotone" dataKey="expenses" stroke="#dc3545" fill="#dc3545" fillOpacity={0.2} name="Expenses" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FinanceChart;
