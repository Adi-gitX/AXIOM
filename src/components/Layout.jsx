import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex w-full min-h-screen bg-transparent text-white">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
