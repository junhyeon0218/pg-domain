import React, { useEffect, useState } from 'react';
import { getMchtStatus } from '../../apis/api/common';
import type { CommonCode } from '../../types/api';

interface MerchantsFilterProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
}

const MerchantsFilter: React.FC<MerchantsFilterProps> = ({
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
}) => {
    const [statuses, setStatuses] = useState<CommonCode[]>([]);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const statusRes = await getMchtStatus();
                if (statusRes.status === 200) {
                    setStatuses(statusRes.data);
                }
            } catch (error) {
                console.error('에러', error);
            }
        };
        fetchFilterOptions();
    }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                        가맹점명 검색
                    </label>
                    <input
                        type="text"
                        id="search"
                        placeholder="가맹점명 입력"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        가맹점 상태
                    </label>
                    <select
                        id="status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-1 shadow-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="">전체</option>
                        {statuses.map((status) => (
                            <option key={status.code} value={status.code}>
                                {status.description}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default MerchantsFilter;
