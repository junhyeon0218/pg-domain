import React from 'react';

interface PaymentMethodChartProps {
    data: { name: string; value: number }[];
}

const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ data }) => {
    const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-3">결제 수단 비율</h3>
            {data.length > 0 ? (
                <ul className="space-y-2">
                    {data.map((entry) => {
                        const percentage = totalValue > 0 ? (entry.value / totalValue) * 100 : 0;
                        return (
                            <li key={entry.name} className="flex justify-between items-center text-md">
                                <span className="font-medium text-gray-600">{entry.name}</span>
                                <span className="font-semibold text-gray-800">
                                    {entry.value.toLocaleString()}건 ({percentage.toFixed(1)}%)
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="flex items-center justify-center text-gray-500" style={{ minHeight: '100px' }}>
                    데이터가 없습니다.
                </div>
            )}
        </div>
    );
};

export default PaymentMethodChart;
