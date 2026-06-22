import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header'; // Adjust as needed
import Footer from '../../components/Footer';

const MainLayout = () => {
    const [activeSection, setActiveSection] = useState('home');

    // Basic Layout for landing page
    return (
        <div className="main-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header activeSection={activeSection} />
            <main style={{ flex: 1 }}>
                <Outlet context={{ setActiveSection }} />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
