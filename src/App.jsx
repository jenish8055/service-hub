import React, { useState } from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import Header from './components/Header';
import CustomerApp from './components/CustomerApp';
import ProviderApp from './components/ProviderApp';
import AdminPanel from './components/AdminPanel';
import { Settings, User, Briefcase, LayoutDashboard, Eye } from 'lucide-react';

function MainAppContent() {
  const { role, setRole, customerSession } = useMarketplace();
  const [showSplash, setShowSplash] = useState(true);
  const [showRolePanel, setShowRolePanel] = useState(false);

  // Determine if header should be hidden (e.g. during splash)
  const isSplashActive = (role === 'visitor' || role === 'customer') && showSplash;

  return (
    <div className="app-container animate-fade">
      {/* Visual Header (Hidden during customer splash screen) */}
      {!isSplashActive && <Header />}

      {/* Main Role-switching Screens */}
      <main className="main-content">
        {(role === 'visitor' || role === 'customer') && (
          <CustomerApp showSplash={showSplash} setShowSplash={setShowSplash} />
        )}
        {role === 'provider' && <ProviderApp />}
        {role === 'admin' && <AdminPanel />}
      </main>

      {/* Bottom Floating Simulator Tool (Interactive Role Hot-Swap Menu) */}
      <div className="role-controller-floating">
        {showRolePanel && (
          <div className="role-controller-menu animate-slide-up">
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, padding: '0.25rem 0.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.25rem' }}>
              SIMULATOR PERSONAS
            </div>
            
            <button 
              onClick={() => {
                setRole(customerSession.loggedIn ? 'customer' : 'visitor');
                setShowSplash(false);
                setShowRolePanel(false);
              }}
              className={`role-btn ${(role === 'visitor' || role === 'customer') ? 'active' : ''}`}
            >
              <User size={14} /> Visitor & Customer
            </button>

            <button 
              onClick={() => {
                setRole('provider');
                setShowRolePanel(false);
              }}
              className={`role-btn ${role === 'provider' ? 'active' : ''}`}
            >
              <Briefcase size={14} /> Service Provider
            </button>

            <button 
              onClick={() => {
                setRole('admin');
                setShowRolePanel(false);
              }}
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            >
              <LayoutDashboard size={14} /> Admin Dashboard
            </button>
          </div>
        )}

        <button 
          onClick={() => setShowRolePanel(!showRolePanel)} 
          className="role-controller-trigger"
          title="Open Simulator Controls"
        >
          <Settings size={22} className="wiggle-call" />
        </button>
      </div>

      {/* Bottom Footer Credits */}
      {!isSplashActive && (
        <footer style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4rem' }}>
          <p>© 2026 ServiceHub Local Service Marketplace. Designed with Vanilla CSS and React.js.</p>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <MarketplaceProvider>
      <MainAppContent />
    </MarketplaceProvider>
  );
}
