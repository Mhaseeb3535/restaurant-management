import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const data = [
  { hour: "9 AM", orders: 8 },
  { hour: "10 AM", orders: 12 },
  { hour: "11 AM", orders: 15 },
  { hour: "12 PM", orders: 25 },
  { hour: "1 PM", orders: 30 },
  { hour: "2 PM", orders: 22 },
  { hour: "3 PM", orders: 16 },
  { hour: "4 PM", orders: 10 },
  { hour: "5 PM", orders: 14 },
  { hour: "6 PM", orders: 20 },
  { hour: "7 PM", orders: 28 },
  { hour: "8 PM", orders: 24 },
];

function TodayOrdersChart() {
  return (
    <div className="bg-white rounded-4 shadow p-4">
      <h5 className="mb-3">Today's Orders by Hour</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#ffc107" name="Orders" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TodayOrdersChart;
