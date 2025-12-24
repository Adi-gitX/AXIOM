import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';

const Layout = () => {
    const location = useLocation();
    const isChatPage = location.pathname.startsWith('/app/connect');

    return (
        <div className="flex w-full min-h-screen bg-transparent text-foreground overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative h-screen">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.99 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`h-full w-full ${isChatPage ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'}`}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
