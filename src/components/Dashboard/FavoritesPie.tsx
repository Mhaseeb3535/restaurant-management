import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface FavoritesPieProps {
  title?: string;
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

function FavoritesPie({ title = "Favorite Categories", data }: FavoritesPieProps) {
  return (
    <div className="bg-white rounded-4 shadow p-4">
      <h5 className="mb-3">{title}</h5>
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

export default FavoritesPie;
