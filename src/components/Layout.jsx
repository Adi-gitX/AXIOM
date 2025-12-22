import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex w-full min-h-screen bg-background text-text font-sans">
            <Sidebar />
            <main className="flex-1 overflow-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="relative z-10 p-8 h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
