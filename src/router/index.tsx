import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/DashboardPage';
import TransactionsPage from '../pages/TransactionsPage';
import MerchantsPage from '../pages/MerchantsPage';
import MerchantDetailPage from '../pages/MerchantDetailPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: 'transactions',
                element: <TransactionsPage />,
            },
            {
                path: 'merchants',
                element: <MerchantsPage />,
            },
            {
                path: 'merchants/:mchtCode',
                element: <MerchantDetailPage />,
            },
        ],
    },
]);

export default router;
