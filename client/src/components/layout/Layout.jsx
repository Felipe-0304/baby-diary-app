import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import FloatingActionButton from './FloatingActionButton';

const Layout = ({ children, activePage, setActivePage }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Mobile Header */}
      {isMobile && (
        <Header 
          activePage={activePage}
          onMenuClick={() => setSidebarOpen(true)}
        />
      )}

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar 
            activePage={activePage}
            setActivePage={setActivePage}
          />
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-black/50" 
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-64 bg-white h-full shadow-xl">
              <Sidebar 
                activePage={activePage}
                setActivePage={setActivePage}
                onItemClick={() => setSidebarOpen(false)}
                isMobile={true}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto ${isMobile ? 'pt-16 pb-20' : ''}`}>
          <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileNavigation 
          activePage={activePage}
          setActivePage={setActivePage}
        />
      )}

      {/* Floating Action Button */}
      {isMobile && (
        <FloatingActionButton 
          activePage={activePage}
          setActivePage={setActivePage}
        />
      )}
    </div>
  );
};

export default Layout;
