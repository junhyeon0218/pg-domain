import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Merchant } from '../../types/api';

interface MerchantsTableProps {
    merchants: Merchant[];
    statusMap: Record<string, string>;
}

const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
        case 'ACTIVE':
            return 'bg-green-100 text-green-800';
        case 'INACTIVE':
            return 'bg-gray-100 text-gray-800';
        case 'CLOSED':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
};

const MerchantsTable: React.FC<MerchantsTableProps> = ({ merchants, statusMap }) => {
    const navigate = useNavigate();

    const handleRowClick = (mchtCode: string) => {
        navigate(`/merchants/${mchtCode}`);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            가맹점 코드
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            가맹점명
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            업종
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            상태
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {merchants.map((merchant) => (
                        <tr
                            key={merchant.mchtCode}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleRowClick(merchant.mchtCode)}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{merchant.mchtCode}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                {merchant.mchtName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{merchant.bizType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(merchant.status)}`}>
                                    {statusMap[merchant.status] || merchant.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MerchantsTable;
