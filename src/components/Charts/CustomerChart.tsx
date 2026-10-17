import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Regular", value: 45, color: "#ffc107" },
  { name: "VIP", value: 25, color: "#198754" },
  { name: "New", value: 20, color: "#0d6efd" },
  { name: "Inactive", value: 10, color: "#dc3545" },
];

function CustomerChart() {
  return (
    <div className="bg-white rounded-4 shadow p-4">
      <h5 className="mb-3">Customer Segments</h5>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomerChart;
