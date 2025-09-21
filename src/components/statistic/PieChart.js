import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function CustomTooltip({ active, payload }){
    if (active && payload && payload.length) {
        const { name, value, percentage } = payload[0].payload;
        return (
            <div className="bg-white p-2 border border-gray-300 rounded shadow">
                <p>{`${name}: ${value} (${percentage}%)`}</p>
            </div>
        );
    }
    return null;
}

export default function PieChartComp({data}) {
    const COLORS = [
        '#0088FE', '#00C49F', '#FFBB28',
        '#0257a5', '#41c400', '#ff7a28',
        '#9800fe', '#c4004b', '#ff2828',
        '#00fec3', '#a0c400', '#35189c'];

    return (
        <div className="flex justify-center">
            <PieChart width={600} height={400}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </PieChart>
        </div>
    );
}