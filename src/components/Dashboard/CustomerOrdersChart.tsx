import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface CustomerOrdersChartProps {
  data: Array<{
    month: string;
    orders: number;
  }>;
}

function CustomerOrdersChart({ data }: CustomerOrdersChartProps) {
  return (
    <div className="bg-white rounded-4 shadow p-4">
      <h5 className="mb-3">Your Orders Over Time</h5>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="orders" stroke="#0d6efd" strokeWidth={2} name="Orders" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomerOrdersChart;
