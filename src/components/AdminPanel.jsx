import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Users, Briefcase, FileText, IndianRupee, ShieldAlert, Sparkles, Plus, 
  Trash2, Sliders, Volume2, Edit, AlertCircle, CheckCircle2, XCircle, 
  ChevronRight, RefreshCw, BarChart2
} from 'lucide-react';

export default function AdminPanel() {
  const {
    bookings,
    providers,
    categories,
    wallet,
    disputes,
    banners,
    notifications,
    addNotification,
    handleVerifyProvider,
    handleBlockUser,
    handleAddCategory,
    handleDeleteCategory,
    handleUpdateCommission,
    handleResolveDispute,
    handleAddBanner,
    handleToggleBanner
  } = useMarketplace();

  // Navigation tab
  const [activeTab, setActiveTab] = useState('overview'); // overview, providers, categories, disputes, banners, broadcaster
  
  // Commission settings
  const [editingCommissionId, setEditingCommissionId] = useState('');
  const [tempCommission, setTempCommission] = useState(10);

  // Categories addition state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryCommission, setNewCategoryCommission] = useState(10);
  const [newCategoryIcon, setNewCategoryIcon] = useState('Sparkles');

  // Broadcast state
  const [broadcastText, setBroadcastText] = useState('');
  
  // Banner scheduling state
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    code: '',
    image: ''
  });

  // Calculate admin totals
  const getAdminStatistics = () => {
    const totalBookings = bookings.length;
    
    // Revenue is the sum of commissions from completed bookings
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalRev = completedBookings.reduce((sum, b) => sum + b.commission, 0);
    
    // Today's bookings
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.date === today);
    const todayRev = todayBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.commission, 0);
    
    return {
      bookingsCount: totalBookings,
      revenue: totalRev,
      todayBookingsCount: todayBookings.length,
      todayRevenue: todayRev,
      providersCount: providers.length,
      pendingProviders: providers.filter(p => p.verification === 'pending').length
    };
  };

  const stats = getAdminStatistics();

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    addNotification(`📢 [GLOBAL BROADCAST] ${broadcastText}`);
    setBroadcastText('');
    alert('Push Notification broadcasted successfully to all platform users!');
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', textAlign: 'left' }}>
          ServiceHub Platform Controller
        </h2>
        <span className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <RefreshCw size={12} className="wiggle-call" /> SYSTEM ACTIVE
        </span>
      </div>

      {/* Admin Tab Navigation */}
      <div 
        className="glass-panel" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          padding: '0.25rem', 
          marginBottom: '2rem', 
          border: '1px solid var(--primary-glow)',
          borderRadius: '12px',
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'overview', name: 'Overview', icon: <BarChart2 size={16} /> },
          { id: 'providers', name: 'Identity Approvals', icon: <Users size={16} /> },
          { id: 'categories', name: 'Categories & Split', icon: <Sliders size={16} /> },
          { id: 'disputes', name: 'Disputes & Refund', icon: <ShieldAlert size={16} /> },
          { id: 'banners', name: 'Banner Promo', icon: <Sparkles size={16} /> },
          { id: 'broadcaster', name: 'Broadcaster', icon: <Volume2 size={16} /> }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ flex: 1, padding: '0.6rem 0.5rem', border: 'none', background: 'transparent', color: activeTab === tab.id ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            className={`role-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="main-content">
        
        {/* TAB 1: SYSTEM OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade">
            {/* Stats Summary row */}
            <div className="dashboard-grid">
              <div className="glass-panel stat-card">
                <div className="stat-title">Platform Revenue</div>
                <div className="stat-value" style={{ color: 'var(--success)' }}>₹{stats.revenue.toFixed(2)}</div>
                <div className="stat-subtitle">Calculated marketplace split</div>
              </div>

              <div className="glass-panel stat-card">
                <div className="stat-title">Total Bookings</div>
                <div className="stat-value">{stats.bookingsCount}</div>
                <div className="stat-subtitle">All-time customer requests</div>
              </div>

              <div className="glass-panel stat-card">
                <div className="stat-title">Identity Approvals</div>
                <div className="stat-value" style={{ color: stats.pendingProviders > 0 ? 'var(--warning)' : 'white' }}>
                  {stats.pendingProviders} Pending
                </div>
                <div className="stat-subtitle">Providers awaiting document audit</div>
              </div>

              <div className="glass-panel stat-card">
                <div className="stat-title">Active Partners</div>
                <div className="stat-value">{stats.providersCount}</div>
                <div className="stat-subtitle">Registered service contractors</div>
              </div>
            </div>

            {/* Live activity log */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', textAlign: 'left' }}>
              
              {/* Completed/Ongoing Bookings Table */}
              <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1.25rem' }}>Global Service Tickets Log</h3>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '0.75rem 0.5rem' }}>ID</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Customer</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Partner</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Service</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Commission</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>{b.id}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{b.customerName}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{b.providerName}</td>
                          <td style={{ padding: '0.75rem 0.5rem', textTransform: 'capitalize' }}>{b.category}</td>
                          <td style={{ padding: '0.75rem 0.5rem', color: 'var(--success)' }}>₹{b.commission}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span className={`badge ${
                              b.status === 'completed' ? 'badge-success' : 
                              b.status === 'cancelled' ? 'badge-danger' : 'badge-warning'
                            }`} style={{ fontSize: '0.65rem' }}>
                              {b.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: IDENTITY APPROVALS */}
        {activeTab === 'providers' && (
          <div className="animate-fade" style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>Partner Verification Panel</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {providers.filter(p => p.verification === 'pending').length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                  <CheckCircle2 size={48} color="var(--success)" style={{ marginBottom: '1rem', display: 'block', margin: '0 auto 1rem auto' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>All registration documents are verified. No pending tasks.</p>
                </div>
              ) : (
                providers
                  .filter(p => p.verification === 'pending')
                  .map(p => (
                    <div key={p.id} className="glass-panel animate-slide-up" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{p.name}</h3>
                          <p style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>
                            Category: {p.category} • Experience: {p.experience} years
                          </p>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            Phone: {p.phone} | Email: {p.email}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleVerifyProvider(p.id, 'rejected')}
                            className="btn btn-secondary" 
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderColor: 'var(--danger)', color: '#fca5a5' }}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                          <button 
                            onClick={() => handleVerifyProvider(p.id, 'approved')}
                            className="btn btn-primary" 
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                          >
                            <CheckCircle2 size={14} /> Approve Verified Partner
                          </button>
                        </div>
                      </div>

                      {/* Display high fidelity mock Aadhaar and PAN previews */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Simulated Aadhaar Card</div>
                          <div className="doc-mock-preview">
                            <div className="doc-header">
                              <div className="doc-logo">AADHAAR</div>
                              <div className="doc-flag"></div>
                            </div>
                            <div className="doc-body">
                              <div className="doc-photo">Photo</div>
                              <div className="doc-details">
                                <div><strong>Name:</strong> {p.name}</div>
                                <div><strong>DOB:</strong> 15/08/1992</div>
                                <div><strong>Gender:</strong> Male</div>
                                <div className="doc-id-number">5938 1029 4829</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Simulated PAN Card</div>
                          <div className="doc-mock-preview" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)' }}>
                            <div className="doc-header" style={{ borderBottomColor: '#0369a1' }}>
                              <div className="doc-logo" style={{ color: '#0369a1' }}>INCOME TAX DEPARTMENT</div>
                            </div>
                            <div className="doc-body">
                              <div className="doc-photo">Photo</div>
                              <div className="doc-details">
                                <div><strong>Name:</strong> {p.name.toUpperCase()}</div>
                                <div><strong>Father:</strong> S. SHARMA</div>
                                <div><strong>DOB:</strong> 15/08/1992</div>
                                <div className="doc-id-number" style={{ letterSpacing: '0.1em' }}>BCKPS4829K</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES Split config */}
        {activeTab === 'categories' && (
          <div className="animate-fade" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>Split Commission settings</h2>
              <button className="btn btn-primary" onClick={() => setShowAddCategoryModal(true)}>
                <Plus size={16} /> Add Category
              </button>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Adjust the percentage split. The marketplace commission applies dynamically to future booking computations.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {categories.map((cat) => (
                  <div 
                    key={cat.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.75rem 1rem', 
                      border: '1px solid var(--border-light)', 
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.01)'
                    }}
                  >
                    <div>
                      <h4 style={{ fontWeight: 600, color: 'white' }}>{cat.name} Split</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {cat.id} • Split: {cat.commission}% to Admin, {100 - cat.commission}% to Partner</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      {editingCommissionId === cat.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input 
                            type="range" 
                            min="5" 
                            max="30" 
                            style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                            value={tempCommission}
                            onChange={(e) => setTempCommission(parseInt(e.target.value))}
                          />
                          <span style={{ fontWeight: 'bold', fontSize: '0.9rem', width: '35px', textAlign: 'right', color: 'white' }}>{tempCommission}%</span>
                          <button 
                            onClick={() => {
                              handleUpdateCommission(cat.id, tempCommission);
                              setEditingCommissionId('');
                            }}
                            className="btn btn-primary" 
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <strong style={{ fontSize: '1rem', color: 'var(--primary-light)' }}>{cat.commission}% Commission</strong>
                          <button 
                            onClick={() => {
                              setEditingCommissionId(cat.id);
                              setTempCommission(cat.commission);
                            }}
                            className="btn btn-secondary" 
                            style={{ padding: '0.3rem', borderRadius: '6px' }}
                            title="Edit Split"
                          >
                            <Edit size={12} />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Delete category ${cat.name}?`)) handleDeleteCategory(cat.id);
                            }}
                            className="btn btn-danger" 
                            style={{ padding: '0.3rem', borderRadius: '6px' }}
                            title="Delete Category"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DISPUTES MANAGER */}
        {activeTab === 'disputes' && (
          <div className="animate-fade" style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>Platform Complaint Resolution</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {disputes.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                  <CheckCircle2 size={48} color="var(--success)" style={{ marginBottom: '1rem', display: 'block', margin: '0 auto 1rem auto' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>All client dispute logs are cleared.</p>
                </div>
              ) : (
                disputes.map((d) => (
                  <div key={d.id} className="glass-panel animate-slide-up" style={{ padding: '1.25rem', borderColor: d.status === 'open' ? 'var(--danger)' : 'var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ticket ID: <strong>{d.bookingId}</strong> | Dispute: <strong>{d.id}</strong></span>
                      </div>
                      <span className={`badge ${d.status === 'resolved' ? 'badge-success' : 'badge-danger'}`}>
                        {d.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 style={{ fontWeight: 600, color: 'white' }}>Client complaint:</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(239, 68, 68, 0.05)', padding: '0.75rem', borderRadius: '6px', margin: '0.5rem 0' }}>
                      "{d.issue}"
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '1rem 0' }}>
                      <div>👤 Customer: <strong>{d.customerName}</strong></div>
                      <div>🛠️ Contractor: <strong>{d.providerName}</strong></div>
                    </div>

                    {d.status === 'open' ? (
                      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => {
                            if (confirm('Approve resolution? This will refund the full booking price back to the Customer wallet.')) {
                              handleResolveDispute(d.id, 'Dispute approved, refund issued to customer.', true);
                            }
                          }}
                          className="btn btn-primary btn-glow" 
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          Approve Resolution & Refund Wallet
                        </button>
                        <button 
                          onClick={() => {
                            const note = prompt('Type close resolution remarks:');
                            if (note) handleResolveDispute(d.id, `Dismissed: ${note}`, false);
                          }}
                          className="btn btn-secondary" 
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          Dismiss Dispute Log
                        </button>
                      </div>
                    ) : (
                      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--success)' }}>
                        Resolved: <strong>{d.resolution}</strong>
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: BANNER PROMOTION */}
        {activeTab === 'banners' && (
          <div className="animate-fade" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>Promo Banners & Offers</h2>
              <button className="btn btn-primary" onClick={() => setShowAddBannerModal(true)}>
                <Plus size={16} /> Schedule Promo Banner
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
              {banners.map((b) => (
                <div key={b.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={b.image} alt={b.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontWeight: 700, color: 'white' }}>{b.title}</h4>
                      <span className={`badge ${b.active ? 'badge-success' : 'badge-danger'}`}>
                        {b.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{b.subtitle}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                      <code style={{ fontSize: '0.75rem' }}>{b.code}</code>
                      <button 
                        onClick={() => handleToggleBanner(b.id)}
                        className="btn btn-secondary" 
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Toggle Status
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PUSH BROADCASTER */}
        {activeTab === 'broadcaster' && (
          <div className="animate-fade" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Volume2 size={22} color="var(--primary-light)" /> Broadcast Alerts
              </h3>
              
              <form onSubmit={handleBroadcast}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  This broadcast tool pushes notifications to the header inboxes of all active Visitor and Customer app sessions.
                </p>
                
                <div className="form-group">
                  <label className="form-label">Notification Message Text</label>
                  <textarea 
                    rows="3" 
                    className="form-control" 
                    placeholder="e.g. System upgrade scheduled for tonight at 2 AM. Bookings will pause."
                    value={broadcastText}
                    onChange={(e) => setBroadcastText(e.target.value)}
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-glow" style={{ width: '100%', marginTop: '1rem' }}>
                  Broadcast Push Notification
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD CATEGORY */}
      {showAddCategoryModal && (
        <div className="dialog-backdrop">
          <div className="dialog-content animate-slide-up" style={{ maxWidth: '400px' }}>
            <div className="dialog-header">
              <h3 className="dialog-title">Create Service Category</h3>
              <button className="dialog-close" onClick={() => setShowAddCategoryModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="dialog-body" style={{ textAlign: 'left' }}>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddCategory({ name: newCategoryName, commission: newCategoryCommission, icon: newCategoryIcon });
                setNewCategoryName('');
                setShowAddCategoryModal(false);
              }}>
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Pest Control" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Split Commission Rate ({newCategoryCommission}%)</label>
                  <input 
                    type="range" 
                    min="5" 
                    max="30" 
                    className="form-control" 
                    style={{ accentColor: 'var(--primary)', cursor: 'pointer', height: '8px' }}
                    value={newCategoryCommission}
                    onChange={(e) => setNewCategoryCommission(parseInt(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Accent Icon Class</label>
                  <select 
                    className="form-control" 
                    value={newCategoryIcon}
                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                  >
                    <option value="Sparkles">Sparkles</option>
                    <option value="Bug">Bug / Insects</option>
                    <option value="BookOpen">BookOpen / Education</option>
                    <option value="Scissors">Scissors / Salon</option>
                    <option value="Wrench">Wrench / Hardware</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Add Platform Category
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD BANNER */}
      {showAddBannerModal && (
        <div className="dialog-backdrop">
          <div className="dialog-content animate-slide-up" style={{ maxWidth: '400px' }}>
            <div className="dialog-header">
              <h3 className="dialog-title">Schedule Promo Banner</h3>
              <button className="dialog-close" onClick={() => setShowAddBannerModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="dialog-body" style={{ textAlign: 'left' }}>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddBanner(newBanner);
                setNewBanner({ title: '', subtitle: '', code: '', image: '' });
                setShowAddBannerModal(false);
              }}>
                <div className="form-group">
                  <label className="form-label">Promotion Banner Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Festival Light Special" 
                    value={newBanner.title}
                    onChange={(e) => setNewBanner(prev => ({ ...prev, title: e.target.value }))}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subtitle Description</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Flat 15% off electrician wiring fixes" 
                    value={newBanner.subtitle}
                    onChange={(e) => setNewBanner(prev => ({ ...prev, subtitle: e.target.value }))}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Coupon Code (Optional)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. FESTIVE15" 
                    value={newBanner.code}
                    onChange={(e) => setNewBanner(prev => ({ ...prev, code: e.target.value }))}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Schedule Offer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
