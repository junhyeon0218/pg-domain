import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { MerchantDetail, CommonCode } from '../types/api';
import { getMerchantsDetailsByCode } from '../apis/api/merchants';
import { getMchtStatus } from '../apis/api/common';

const MerchantDetailPage = () => {
    const { mchtCode } = useParams<{ mchtCode: string }>();
    const [merchant, setMerchant] = useState<MerchantDetail | null>(null);
    const [statusMap, setStatusMap] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!mchtCode) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [merchantRes, statusRes] = await Promise.all([
                    getMerchantsDetailsByCode(mchtCode),
                    getMchtStatus(),
                ]);
                if (merchantRes.status === 200 && merchantRes.data) {
                    setMerchant(merchantRes.data);
                } else {
                    throw new Error(merchantRes.message || '불러오기 실패');
                }

                if (statusRes.status === 200 && statusRes.data) {
                    const newStatusMap = statusRes.data.reduce((acc: Record<string, string>, status: CommonCode) => {
                        acc[status.code] = status.description;
                        return acc;
                    }, {});
                    setStatusMap(newStatusMap);
                } else {
                    throw new Error(statusRes.message || '불러오기 실패');
                }
            } catch (err: any) {
                setError(err.message || '가맹점 정보를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mchtCode]);

    if (loading) {
        return <div className="p-6">로딩 중...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    if (!merchant) {
        return <div className="p-6">가맹점 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">{merchant.mchtName}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="가맹점 코드" value={merchant.mchtCode} />
                <DetailItem label="상태" value={statusMap[merchant.status] || merchant.status} />
                <DetailItem label="업종" value={merchant.bizType} />
                <DetailItem label="사업자 번호" value={merchant.bizNo} />
                <DetailItem label="주소" value={merchant.address} />
                <DetailItem label="연락처" value={merchant.phone} />
                <DetailItem label="이메일" value={merchant.email} />
                <DetailItem label="등록일" value={new Date(merchant.registeredAt).toLocaleDateString()} />
                <DetailItem label="최근 수정일" value={new Date(merchant.updatedAt).toLocaleDateString()} />
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="p-2 rounded">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
);

export default MerchantDetailPage;
