import React from 'react';

interface SummaryKPIsProps {
    totalAmount: string;
    totalCount: number;
    totalMerchants: number;
}

const SummaryKPIs: React.FC<SummaryKPIsProps> = ({ totalAmount, totalCount, totalMerchants }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">총 결제 금액</h3>
                    <p className="text-xl">₩{totalAmount}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">총 결제 건수</h3>
                    <p className="text-xl">{totalCount.toLocaleString()}건</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">총 가맹점 수</h3>
                    <p className="text-xl">{totalMerchants.toLocaleString()}개</p>
                </div>
            </div>
        </div>
    );
};

export default SummaryKPIs;
