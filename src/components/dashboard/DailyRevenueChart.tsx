import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DailyRevenueChartProps {
    data: { date: string; amount: number }[];
}

const DailyRevenueChart: React.FC<DailyRevenueChartProps> = ({ data }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4">일별 매출 추이</h3>
            <ResponsiveContainer width="100%" height="100%" className="flex-1">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} tick={{ fill: '#6B7280' }} />
                    <YAxis
                        tickFormatter={(value) => new Intl.NumberFormat('ko-KR').format(value)}
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip
                        formatter={(value: number) => [`${new Intl.NumberFormat('ko-KR').format(value)}원`, '매출']}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" name="매출액" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DailyRevenueChart;
