import {

ResponsiveContainer,

LineChart,

Line,

XAxis,

YAxis,

Tooltip

} from "recharts";

const data=[

{month:"Jan",sales:5000},

{month:"Feb",sales:7500},

{month:"Mar",sales:9800},

{month:"Apr",sales:12000},

{month:"May",sales:15000},

{month:"Jun",sales:18000}

];

function RevenueChart(){

return(

<div

className="bg-white rounded-4 shadow p-4"

>

<h5>

Revenue

</h5>

<ResponsiveContainer

width="100%"

height={300}

>

<LineChart data={data}>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Line

type="monotone"

dataKey="sales"

/>

</LineChart>

</ResponsiveContainer>

</div>

);

}

export default RevenueChart;