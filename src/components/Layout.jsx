import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex w-full min-h-screen font-sans">
            <Sidebar />
            <main className="flex-1 overflow-auto relative">
                {/* Subtle gradient overlay on content area if needed, but keeping it clean for the global mesh to show */}
                <div className="relative z-10 p-8 h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
