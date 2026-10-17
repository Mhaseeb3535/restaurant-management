import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const data = [
  { day: "Mon", visitors: 240, orders: 80 },
  { day: "Tue", visitors: 300, orders: 95 },
  { day: "Wed", visitors: 280, orders: 88 },
  { day: "Thu", visitors: 350, orders: 110 },
  { day: "Fri", visitors: 420, orders: 145 },
  { day: "Sat", visitors: 560, orders: 190 },
  { day: "Sun", visitors: 480, orders: 160 },
];

function TrafficChart() {
  return (
    <div className="bg-white rounded-4 shadow p-4">
      <h5 className="mb-3">Daily Visitors & Orders</h5>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="visitors" stroke="#0d6efd" strokeWidth={2} name="Visitors" />
          <Line type="monotone" dataKey="orders" stroke="#ffc107" strokeWidth={2} name="Orders" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrafficChart;
