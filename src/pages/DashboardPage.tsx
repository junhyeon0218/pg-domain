import React, { useEffect, useState, useMemo } from 'react';
import { getPaymentsList } from '../apis/api/payments';
import { getMerchantsList } from '../apis/api/merchants';
import { getPaymentType } from '../apis/api/common';
import type { Payment, Merchant, PaymentType } from '../types/api';
import SummaryKPIs from '../components/dashboard/SummaryKPIs';
import DailyRevenueChart from '../components/dashboard/DailyRevenueChart';
import PaymentMethodChart from '../components/dashboard/PaymentMethodChart';
import TransactionTable from '../components/transactions/TransactionTable';

const DashboardPage: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [paymentTypeMap, setPaymentTypeMap] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [paymentsRes, merchantsRes, paymentTypesRes] = await Promise.all([
                    getPaymentsList(),
                    getMerchantsList(),
                    getPaymentType(),
                ]);

                if (paymentsRes.status === 200 && paymentsRes.data) {
                    setPayments(paymentsRes.data);
                } else {
                    throw new Error(paymentsRes.message || '결제 내역을 불러오지 못했습니다.');
                }

                if (merchantsRes.status === 200 && merchantsRes.data) {
                    setMerchants(merchantsRes.data);
                } else {
                    throw new Error(merchantsRes.message || '가맹점 목록을 불러오지 못했습니다.');
                }

                if (paymentTypesRes.status === 200 && paymentTypesRes.data) {
                    const newTypeMap = paymentTypesRes.data.reduce((acc: Record<string, string>, type: PaymentType) => {
                        acc[type.type] = type.description;
                        return acc;
                    }, {});
                    setPaymentTypeMap(newTypeMap);
                } else {
                    throw new Error(paymentTypesRes.message || '결제 수단 정보를 불러오지 못했습니다.');
                }
            } catch (err: any) {
                setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const { kpiData, dailyChartData, paymentMethodData, recentTransactions, merchantNameMap } = useMemo(() => {
        const successfulPayments = payments.filter((p) => p.status === 'SUCCESS');

        // KPI 계산
        const totalSuccessfulAmount = successfulPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const totalSuccessfulCount = successfulPayments.length;

        // 일별 매출 데이터 계산 (최근 30일)
        const dailyData: { [key: string]: number } = {};
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        successfulPayments.forEach((p) => {
            const paymentDate = new Date(p.paymentAt);
            if (paymentDate >= thirtyDaysAgo) {
                const dateKey = paymentDate.toISOString().split('T')[0];
                if (!dailyData[dateKey]) {
                    dailyData[dateKey] = 0;
                }
                dailyData[dateKey] += Number(p.amount);
            }
        });

        const dailyChartDataFormatted = Object.keys(dailyData)
            .sort()
            .map((date) => ({
                date,
                amount: dailyData[date],
            }));

        // 결제 수단별 데이터 계산
        const paymentMethodCount: { [key: string]: number } = {};
        successfulPayments.forEach((p) => {
            paymentMethodCount[p.payType] = (paymentMethodCount[p.payType] || 0) + 1;
        });

        const paymentMethodChartData = Object.keys(paymentMethodCount).map((key) => ({
            name: paymentTypeMap[key] || key,
            value: paymentMethodCount[key],
        }));

        // 최근 거래 내역 계산
        const sortedPayments = [...payments].sort(
            (a, b) => new Date(b.paymentAt).getTime() - new Date(a.paymentAt).getTime(),
        );
        const recentTransactionsData = sortedPayments.slice(0, 5);

        // 가맹점 이름 맵 생성
        const merchantMap = new Map(merchants.map((m) => [m.mchtCode, m.mchtName]));

        return {
            kpiData: {
                totalAmount: new Intl.NumberFormat('ko-KR').format(totalSuccessfulAmount),
                totalCount: totalSuccessfulCount,
                totalMerchants: merchants.length,
            },
            dailyChartData: dailyChartDataFormatted,
            paymentMethodData: paymentMethodChartData,
            recentTransactions: recentTransactionsData,
            merchantNameMap: Object.fromEntries(merchantMap),
        };
    }, [payments, merchants, paymentTypeMap]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div className="text-red-500">에러: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">대시보드</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-6">
                    <SummaryKPIs
                        totalAmount={kpiData.totalAmount}
                        totalCount={kpiData.totalCount}
                        totalMerchants={kpiData.totalMerchants}
                    />
                    <PaymentMethodChart data={paymentMethodData} />
                </div>
                <div className="lg:col-span-2">
                    <DailyRevenueChart data={dailyChartData} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">최근 거래 내역</h3>
                <TransactionTable payments={recentTransactions} merchantNameMap={merchantNameMap} />
            </div>
        </div>
    );
};

export default DashboardPage;
