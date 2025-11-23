import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-gray-800 text-white p-4 min-w-[200px]">
            <div className="text-2xl font-bold mb-8">AllPays</div>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => `block p-2 rounded ${isActive ? 'bg-gray-700' : ''}`}>
                            대시보드
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/transactions"
                            className={({ isActive }) => `block p-2 rounded ${isActive ? 'bg-gray-700' : ''}`}>
                            거래내역
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/merchants"
                            className={({ isActive }) => `block p-2 rounded ${isActive ? 'bg-gray-700' : ''}`}>
                            가맹점 조회
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
