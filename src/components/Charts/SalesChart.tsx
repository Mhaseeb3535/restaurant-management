import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const data = [
  { category: "Main Course", sales: 4500, profit: 1800 },
  { category: "Pizza", sales: 3800, profit: 1500 },
  { category: "Pasta", sales: 3200, profit: 1200 },
  { category: "Desserts", sales: 2800, profit: 1100 },
  { category: "Beverages", sales: 2500, profit: 1400 },
  { category: "Salads", sales: 1800, profit: 700 },
];

function SalesChart() {
  return (
    <div className="bg-white rounded-4 shadow p-4">
      <h5 className="mb-3">Sales by Category</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#ffc107" name="Sales ($)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="profit" fill="#198754" name="Profit ($)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesChart;
