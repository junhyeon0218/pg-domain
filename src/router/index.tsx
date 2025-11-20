import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../components/dashboard/Dashboard';
import TransactionsPage from '../pages/TransactionsPage';
import MerchantsPage from '../pages/MerchantsPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'transactions',
                element: <TransactionsPage />,
            },
            {
                path: 'merchants',
                element: <MerchantsPage />,
            },
        ],
    },
]);

export default router;
