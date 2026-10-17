import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Completed", value: 65, color: "#198754" },
  { name: "Preparing", value: 20, color: "#ffc107" },
  { name: "Pending", value: 10, color: "#dc3545" },
  { name: "Cancelled", value: 5, color: "#6c757d" },
];

function OrderStatusPie() {
  return (
    <div className="bg-white rounded-4 shadow p-4">
      <h5 className="mb-3">Order Status</h5>
      <ResponsiveContainer width="100%" height={300}>
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

export default OrderStatusPie;
