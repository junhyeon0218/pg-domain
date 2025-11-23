import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { MerchantDetail, CommonCode, Payment } from '../types/api';
import { getMerchantsDetailsByCode } from '../apis/api/merchants';
import { getMchtStatus } from '../apis/api/common';
import { getPaymentsList } from '../apis/api/payments';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionPagination from '../components/transactions/TransactionPagination';

const ITEMS_PER_PAGE = 10;

const MerchantDetailPage = () => {
    const { mchtCode } = useParams<{ mchtCode: string }>();
    
    // 페이지 데이터
    const [merchant, setMerchant] = useState<MerchantDetail | null>(null);
    const [statusMap, setStatusMap] = useState<Record<string, string>>({});
    const [merchantTransactions, setMerchantTransactions] = useState<Payment[]>([]);

    // 거래 요약 정보
    const [transactionCount, setTransactionCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // UI 상태
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!mchtCode) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [merchantRes, statusRes, paymentsRes] = await Promise.all([
                    getMerchantsDetailsByCode(mchtCode),
                    getMchtStatus(),
                    getPaymentsList(),
                ]);

                if (merchantRes.status === 200 && merchantRes.data) {
                    setMerchant(merchantRes.data);
                } else {
                    throw new Error(merchantRes.message || '가맹점 상세 정보 불러오기 실패');
                }

                if (statusRes.status === 200 && statusRes.data) {
                    const newStatusMap = statusRes.data.reduce((acc: Record<string, string>, status: CommonCode) => {
                        acc[status.code] = status.description;
                        return acc;
                    }, {});
                    setStatusMap(newStatusMap);
                } else {
                    throw new Error(statusRes.message || '상태 정보 불러오기 실패');
                }

                if (paymentsRes.status === 200 && paymentsRes.data) {
                    const allMerchantTransactions = paymentsRes.data
                        .filter((payment) => payment.mchtCode === mchtCode)
                        .sort((a, b) => new Date(b.paymentAt).getTime() - new Date(a.paymentAt).getTime());

                    setMerchantTransactions(allMerchantTransactions);
                    setTransactionCount(allMerchantTransactions.length);
                    setTotalAmount(allMerchantTransactions.reduce((sum, payment) => sum + Number(payment.amount), 0));
                } else {
                    throw new Error(paymentsRes.message || '거래 내역 불러오기 실패');
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

    const totalPages = Math.ceil(merchantTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return merchantTransactions.slice(startIndex, endIndex);
    }, [merchantTransactions, currentPage]);

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
        <div className="space-y-6">
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

            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">거래 내역</h2>
                    <div className="text-right text-sm">
                        <span className="text-gray-600">총 </span>
                        <span className="font-semibold text-gray-800">{transactionCount}</span>
                        <span className="text-gray-600">건 / </span>
                        <span className="font-semibold text-gray-800">{new Intl.NumberFormat('ko-KR').format(totalAmount)}</span>
                        <span className="text-gray-600">원</span>
                    </div>
                </div>

                {paginatedTransactions.length > 0 ? (
                    <>
                        <TransactionTable
                            payments={paginatedTransactions}
                            merchantNameMap={{ [merchant.mchtCode]: merchant.mchtName }}
                        />
                        <TransactionPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                ) : (
                    <p className="text-gray-500">해당 가맹점의 거래 내역이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="p-2 rounded">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-800">{value}</p>
    </div>
);

export default MerchantDetailPage;
