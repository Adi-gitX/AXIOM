import React, { createContext, useContext, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import AppTopbar from './AppTopbar';
import CommandPalette from './CommandPalette';

const SidebarCtx = createContext({ open: false, setOpen: () => {} });
export const useSidebar = () => useContext(SidebarCtx);

const Layout = () => {
    const location = useLocation();
    const isChatPage = location.pathname.startsWith('/app/connect');
    const [open, setOpen] = useState(false);

    return (
        <SidebarCtx.Provider value={{ open, setOpen }}>
            <div className="relative w-full h-screen bg-background text-foreground font-sans antialiased overflow-hidden app-grain">
                <div className="relative flex w-full h-full">
                    {/* Mobile drawer overlay */}
                    {open && (
                        <button
                            type="button"
                            aria-label="Close menu"
                            onClick={() => setOpen(false)}
                            className="lg:hidden fixed inset-0 z-30 bg-foreground/40"
                        />
                    )}
                    <Sidebar />
                    <main className="flex-1 relative h-full flex flex-col min-w-0">
                        {!isChatPage && <AppTopbar />}
                        <div
                            className={`flex-1 ${
                                isChatPage ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'
                            }`}
                        >
                            <Outlet />
                        </div>
                    </main>
                </div>
                <CommandPalette />
            </div>
        </SidebarCtx.Provider>
    );
};

export default Layout;
