import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShieldAlert, Bell, MapPin, User, LogOut, Briefcase, LayoutDashboard, Wrench } from 'lucide-react';

export default function Header() {
  const { 
    role, setRole, 
    currentLocation, setCurrentLocation,
    customerSession, handleCustomerLogout,
    providerSession, handleProviderLogout,
    notifications, setNotifications
  } = useMarketplace();

  const [showLocationList, setShowLocationList] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const locations = [
    'Girdhar Nagar, Ahmedabad',
    'Salt Lake, Kolkata',
    'Indiranagar, Bengaluru',
    'Connaught Place, New Delhi',
    'Bandra West, Mumbai'
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header 
      className="glass-panel" 
      style={{ 
        padding: '0.75rem 1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '1rem',
        borderRadius: '16px',
        border: '1px solid var(--border-light)'
      }}
    >
      {/* Brand Logo */}
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        onClick={() => setRole('visitor')}
      >
        <div 
          style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 0 10px var(--primary-glow)'
          }}
        >
          <Wrench size={16} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', color: 'white' }}>
          Service<span style={{ color: 'var(--secondary)' }}>Hub</span>
        </span>
      </div>

      {/* Role Swapper Tabs (Desktop Navigation) */}
      <div 
        style={{ 
          display: 'flex', 
          background: 'rgba(0,0,0,0.3)', 
          padding: '0.25rem', 
          borderRadius: '10px', 
          border: '1px solid var(--border-light)' 
        }}
      >
        <button 
          onClick={() => setRole(customerSession.loggedIn ? 'customer' : 'visitor')} 
          className={`btn ${role === 'visitor' || role === 'customer' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px', border: 'none' }}
        >
          <User size={14} /> Customer App
        </button>
        <button 
          onClick={() => setRole('provider')} 
          className={`btn ${role === 'provider' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px', border: 'none', marginLeft: '0.25rem' }}
        >
          <Briefcase size={14} /> Provider App
        </button>
        <button 
          onClick={() => setRole('admin')} 
          className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px', border: 'none', marginLeft: '0.25rem' }}
        >
          <LayoutDashboard size={14} /> Admin Panel
        </button>
      </div>

      {/* Right side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        
        {/* Location Pin selector */}
        {(role === 'visitor' || role === 'customer') && (
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowLocationList(!showLocationList)}
              className="btn btn-secondary" 
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem' }}
            >
              <MapPin size={14} color="var(--primary-light)" />
              <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentLocation.split(',')[0]}
              </span>
            </button>

            {showLocationList && (
              <div 
                className="glass-panel" 
                style={{ 
                  position: 'absolute', 
                  top: '110%', 
                  left: 0, 
                  zIndex: 100, 
                  minWidth: '200px', 
                  padding: '0.5rem',
                  background: '#0d1023',
                  border: '1px solid var(--border-light)' 
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.25rem 0.5rem', fontWeight: 600 }}>SELECT AREA</div>
                {locations.map((loc, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setCurrentLocation(loc);
                      setShowLocationList(false);
                    }}
                    style={{ 
                      width: '100%', 
                      textAlign: 'left', 
                      background: 'transparent', 
                      border: 'none', 
                      color: currentLocation === loc ? 'var(--primary-light)' : 'var(--text-secondary)',
                      padding: '0.4rem 0.5rem', 
                      fontSize: '0.8rem', 
                      borderRadius: '6px',
                      cursor: 'pointer' 
                    }}
                    className="role-btn"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => {
              setShowNotificationDropdown(!showNotificationDropdown);
              if (!showNotificationDropdown) markAllRead();
            }}
            className="btn btn-secondary" 
            style={{ padding: '0.5rem', borderRadius: '50%' }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span 
                style={{ 
                  position: 'absolute', 
                  top: '-4px', 
                  right: '-4px', 
                  background: 'var(--secondary)', 
                  color: 'white', 
                  fontSize: '0.65rem', 
                  fontWeight: 'bold', 
                  borderRadius: '50%', 
                  width: '16px', 
                  height: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  lineHeight: '1',
                  padding: '0'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotificationDropdown && (
            <div 
              className="glass-panel" 
              style={{ 
                position: 'absolute', 
                top: '120%', 
                right: 0, 
                zIndex: 100, 
                width: '300px', 
                padding: '0.5rem',
                background: '#0d1023',
                border: '1px solid var(--primary-glow)' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0.5rem 0.5rem 0.5rem', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Notifications</span>
                <button 
                  onClick={() => setNotifications([])} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer' }}
                >
                  Clear all
                </button>
              </div>

              <div style={{ maxHeight: '250px', overflowY: 'auto', padding: '0.25rem' }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map((n, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        padding: '0.6rem 0.5rem', 
                        borderBottom: idx === notifications.length - 1 ? 'none' : '1px solid var(--border-light)',
                        fontSize: '0.75rem',
                        lineHeight: 1.3
                      }}
                    >
                      <div style={{ color: 'var(--text-primary)' }}>{n.text}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '0.2rem' }}>{n.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Session details / Logout */}
        {role === 'customer' && customerSession.loggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'none', minWidth: '40px' }}>{customerSession.name}</span>
            <button 
              onClick={handleCustomerLogout} 
              className="btn btn-secondary" 
              style={{ padding: '0.5rem', borderRadius: '50%' }}
              title="Logout Customer"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}

        {role === 'provider' && providerSession.loggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={handleProviderLogout} 
              className="btn btn-secondary" 
              style={{ padding: '0.5rem', borderRadius: '50%' }}
              title="Logout Provider"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
