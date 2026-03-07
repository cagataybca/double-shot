import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout = () => {
    return (
        <div className="app-container">
            <Header />
            <main className="page-content">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};

export default Layout;
