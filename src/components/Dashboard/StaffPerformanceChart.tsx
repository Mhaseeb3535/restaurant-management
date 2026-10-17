import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const data = [
  { name: "Chef Ahmed", orders: 85, rating: 4.8 },
  { name: "Chef Ali", orders: 72, rating: 4.6 },
  { name: "Chef Sarah", orders: 64, rating: 4.9 },
  { name: "Waiter John", orders: 55, rating: 4.5 },
  { name: "Waiter Mike", orders: 48, rating: 4.3 },
  { name: "Host Emma", orders: 40, rating: 4.7 },
];

function StaffPerformanceChart() {
  return (
    <div className="bg-white rounded-4 shadow p-4">
      <h5 className="mb-3">Staff Performance</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#0d6efd" name="Orders Completed" radius={[0, 6, 6, 0]} />
          <Bar dataKey="rating" fill="#ffc107" name="Rating" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StaffPerformanceChart;
