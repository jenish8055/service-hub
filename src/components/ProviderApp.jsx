import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  User, Briefcase, Calendar, Clock, DollarSign, Star, FileText, CheckCircle2, 
  XCircle, ArrowRight, ShieldAlert, Award, QrCode, LogIn, Plus, Trash2, 
  ToggleLeft, ToggleRight, Sparkles, Building, Settings, RefreshCw, BarChart2
} from 'lucide-react';

export default function ProviderApp() {
  const {
    role,
    providers,
    bookings,
    categories,
    providerSession,
    handleProviderRegister,
    handleProviderLogin,
    handleUpdateBookingStatus,
    handleProviderAddService,
    addNotification
  } = useMarketplace();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, jobs, services, schedule, earnings, profile
  const [loginPhone, setLoginPhone] = useState('');
  
  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    mobile: '',
    email: '',
    category: 'electrician',
    experience: '',
    charges: '',
    aadhaarName: '',
    panName: ''
  });

  // Services manager state
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  // Job progress interactive state
  const [activeJobForOtp, setActiveJobForOtp] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [showQrCodeForBooking, setShowQrCodeForBooking] = useState(null);

  // Weekly Schedule State
  const [schedule, setSchedule] = useState({
    monday: { active: true, slots: ['09:00 AM - 11:00 AM', '02:00 PM - 04:00 PM'] },
    tuesday: { active: true, slots: ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM'] },
    wednesday: { active: true, slots: ['09:00 AM - 11:00 AM', '02:00 PM - 04:00 PM'] },
    thursday: { active: true, slots: ['09:00 AM - 11:00 AM', '02:00 PM - 04:00 PM'] },
    friday: { active: true, slots: ['09:00 AM - 11:00 AM', '02:00 PM - 04:00 PM'] },
    saturday: { active: false, slots: [] },
    sunday: { active: false, slots: [] }
  });
  const [vacationMode, setVacationMode] = useState(false);

  // Withdrawal Module State
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankDetails, setBankDetails] = useState({ account: '', name: '', bank: '' });
  const [withdrawalLogs, setWithdrawalLogs] = useState([]);

  // Mock document uploading helper
  const handleDocUpload = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      setRegisterForm(prev => ({
        ...prev,
        [docType]: file.name
      }));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!registerForm.aadhaarName || !registerForm.panName) {
      alert('Aadhaar card and PAN card documents are required for marketplace registration.');
      return;
    }
    handleProviderRegister(registerForm);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginPhone) {
      alert('Enter mobile number.');
      return;
    }
    handleProviderLogin(loginPhone);
  };

  const handleOtpVerifyAndStart = (e) => {
    e.preventDefault();
    if (!activeJobForOtp) return;
    
    if (enteredOtp !== activeJobForOtp.otp) {
      alert('Incorrect security code. Please check the Customer booking dashboard.');
      return;
    }

    handleUpdateBookingStatus(activeJobForOtp.id, 'started', { otp: enteredOtp });
    setActiveJobForOtp(null);
    setEnteredOtp('');
  };

  // Withdraw money handler
  const handleWithdrawalRequest = (e) => {
    e.preventDefault();
    const amt = parseFloat(withdrawalAmount);
    const earnedBalance = getProviderEarningsSummary().withdrawable;
    
    if (isNaN(amt) || amt <= 0) {
      alert('Invalid withdrawal amount');
      return;
    }
    if (amt > earnedBalance) {
      alert('Insufficient withdrawable funds.');
      return;
    }

    setWithdrawalLogs(prev => [
      {
        id: `WITH-${Date.now().toString().slice(-4)}`,
        amount: amt,
        method: upiId ? `UPI (${upiId})` : `Bank A/C (...${bankDetails.account.slice(-4)})`,
        status: 'pending',
        date: new Date().toLocaleDateString()
      },
      ...prev
    ]);
    setWithdrawalAmount('');
    addNotification(`Withdrawal request for ₹${amt} filed! Admin review is underway.`);
  };

  // Calculate earnings summary for provider
  const getProviderEarningsSummary = () => {
    const provId = providerSession.id || 'prov-1';
    const providerJobs = bookings.filter(b => b.providerId === provId && b.status === 'completed');
    
    const totalEarnings = providerJobs.reduce((sum, b) => sum + b.providerEarned, 0);
    const commDeducted = providerJobs.reduce((sum, b) => sum + b.commission, 0);
    
    // Deduct withdrawals
    const totalWithdrawn = withdrawalLogs
      .filter(w => w.status === 'approved' || w.status === 'pending')
      .reduce((sum, w) => sum + w.amount, 0);

    return {
      total: totalEarnings,
      commission: commDeducted,
      withdrawable: Math.max(0, totalEarnings - totalWithdrawn),
      withdrawn: totalWithdrawn,
      jobCount: providerJobs.length
    };
  };

  const getProviderProfileObj = () => {
    const provId = providerSession.id || 'prov-1';
    return providers.find(p => p.id === provId) || providerSession;
  };

  // Switch schedule slot toggle
  const toggleScheduleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        active: !prev[day].active
      }
    }));
  };

  const currentProviderProfile = getProviderProfileObj();
  const providerBookings = bookings.filter(b => b.providerId === (providerSession.id || 'prov-1'));
  const activeRequests = providerBookings.filter(b => b.status === 'requested');
  const ongoingJobs = providerBookings.filter(b => ['accepted', 'on_the_way', 'started'].includes(b.status));

  // Render Login/Signup if not authenticated
  if (!providerSession.loggedIn) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', minHeight: '80vh', padding: '2rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Provider Login Form */}
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogIn size={20} color="var(--primary-light)" /> Service Pro Login
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Access your bookings job board. Input a number matching a profile (e.g. <strong>+91 98250 12345</strong>).
            </p>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Registered Mobile Number</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="e.g. 98250 12345"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary btn-glow" style={{ width: '100%', marginTop: '1.5rem' }}>
                Secure Login
              </button>
            </form>
          </div>

          {/* Provider Signup Registration */}
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={20} color="var(--secondary)" /> Partner Onboarding
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Register as a local marketplace service contractor. Aadhaar/PAN is verified by admin.
            </p>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Full Contractor Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Rajesh Sharma"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Select Category</label>
                  <select 
                    className="form-control" 
                    value={registerForm.category}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Service Rate (₹/hr)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 200" 
                    value={registerForm.charges}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, charges: e.target.value }))}
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    placeholder="99988 88888" 
                    value={registerForm.mobile}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, mobile: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 5" 
                    value={registerForm.experience}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, experience: e.target.value }))}
                    required 
                  />
                </div>
              </div>

              {/* Aadhaar and PAN file simulator */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Upload Aadhaar: <span style={{ color: 'var(--primary-light)' }}>{registerForm.aadhaarName || 'None'}</span>
                  </label>
                  <input 
                    type="file" 
                    id="aadhaar-upload" 
                    style={{ display: 'none' }} 
                    onChange={(e) => handleDocUpload(e, 'aadhaarName')} 
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
                    onClick={() => document.getElementById('aadhaar-upload').click()}
                  >
                    Select File
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Upload PAN: <span style={{ color: 'var(--primary-light)' }}>{registerForm.panName || 'None'}</span>
                  </label>
                  <input 
                    type="file" 
                    id="pan-upload" 
                    style={{ display: 'none' }} 
                    onChange={(e) => handleDocUpload(e, 'panName')} 
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
                    onClick={() => document.getElementById('pan-upload').click()}
                  >
                    Select File
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-glow" style={{ width: '100%', marginTop: '1rem' }}>
                Submit Verification Documents
              </button>
            </form>
          </div>

        </div>
      </div>
    );
  }

  // Dashboard Summary Numbers
  const earningsSummary = getProviderEarningsSummary();

  return (
    <div className="animate-fade">
      
      {/* Top dashboard alerts if pending approval */}
      {currentProviderProfile.verification === 'pending' && (
        <div className="glass-panel-glow" style={{ padding: '1rem', border: '1px solid var(--warning)', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', animation: 'pulseLight 2s infinite' }}>
          <ShieldAlert size={36} color="var(--warning)" style={{ flexShrink: 0 }} />
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ color: 'white', fontWeight: 700 }}>Marketplace Review Pending</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Your professional document profile is under review by admin team. Job board requests will unlock upon approval. (Tip: Switch to Admin Panel to Approve!)
            </p>
          </div>
        </div>
      )}

      {/* Main Tab Controls */}
      <div 
        className="glass-panel" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          padding: '0.25rem', 
          marginBottom: '2rem', 
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'dashboard', name: 'Dashboard', icon: <BarChart2 size={16} /> },
          { id: 'jobs', name: 'Job Board', icon: <Calendar size={16} /> },
          { id: 'services', name: 'My Offerings', icon: <Briefcase size={16} /> },
          { id: 'schedule', name: 'Work Hours', icon: <Clock size={16} /> },
          { id: 'earnings', name: 'Payouts & UPI', icon: <DollarSign size={16} /> }
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
        
        {/* TAB 1: PROVIDER DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', textAlign: 'left' }}>
                Welcome Back, {currentProviderProfile.name}!
              </h2>
              <span className={`badge ${currentProviderProfile.verification === 'verified' ? 'badge-success' : 'badge-warning'}`}>
                {currentProviderProfile.verification.toUpperCase()} PARTNER
              </span>
            </div>

            {/* Stats Cards Row */}
            <div className="dashboard-grid">
              <div className="glass-panel stat-card">
                <div className="stat-title">Month Earnings</div>
                <div className="stat-value">₹{earningsSummary.total.toFixed(2)}</div>
                <div className="stat-subtitle">Net split after admin fee</div>
              </div>

              <div className="glass-panel stat-card">
                <div className="stat-title">Available Payout</div>
                <div className="stat-value">₹{earningsSummary.withdrawable.toFixed(2)}</div>
                <div className="stat-subtitle">UPI/Bank transfer available</div>
              </div>

              <div className="glass-panel stat-card">
                <div className="stat-title">Completed Work</div>
                <div className="stat-value">{earningsSummary.jobCount} Jobs</div>
                <div className="stat-subtitle">100% completion rate</div>
              </div>

              <div className="glass-panel stat-card">
                <div className="stat-title">Average Rating</div>
                <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Star fill="var(--warning)" color="var(--warning)" size={24} />
                  <span>{currentProviderProfile.rating || 5.0}</span>
                </div>
                <div className="stat-subtitle">Based on latest feedback logs</div>
              </div>
            </div>

            {/* Dashboard Graphs & Reviews summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', textAlign: 'left' }}>
              
              {/* SVG Charts representation */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1.25rem' }}>Earnings Overview</h3>
                <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div style={{ width: '40px', background: 'var(--primary-glow)', height: '20px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'center' }} title="Week 1: ₹200"><span style={{ fontSize: '0.65rem', color: 'white', marginTop: '-18px' }}>W1</span></div>
                  <div style={{ width: '40px', background: 'var(--primary-glow)', height: '45px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'center' }} title="Week 2: ₹450"><span style={{ fontSize: '0.65rem', color: 'white', marginTop: '-18px' }}>W2</span></div>
                  <div style={{ width: '40px', background: 'var(--primary-glow)', height: '80px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'center' }} title="Week 3: ₹800"><span style={{ fontSize: '0.65rem', color: 'white', marginTop: '-18px' }}>W3</span></div>
                  <div style={{ width: '40px', background: 'linear-gradient(to top, var(--primary), var(--secondary))', height: '110px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'center' }} title="Week 4: ₹1200"><span style={{ fontSize: '0.65rem', color: 'white', marginTop: '-18px' }}>W4</span></div>
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Weekly Revenue split totals</div>
              </div>

              {/* Reviews Summary list */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1.25rem' }}>Latest Reviews</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {currentProviderProfile.reviews.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No client feedback logged.</p>
                  ) : (
                    currentProviderProfile.reviews.map((r, i) => (
                      <div key={i} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 600, color: 'white' }}>{r.customerName}</span>
                          <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center' }}><Star size={10} fill="currentColor" /> {r.rating}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>"{r.text}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: JOB BOARD */}
        {activeTab === 'jobs' && (
          <div className="animate-fade" style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>Booking Jobs Board</h2>
            
            {currentProviderProfile.verification !== 'verified' ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <ShieldAlert size={48} color="var(--warning)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Verification Required</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Please wait for the administrator to review and verify your identity documents before accepting live customer requests.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                
                {/* Column 1: New job requests */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Incoming Requests ({activeRequests.length})
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {activeRequests.length === 0 ? (
                      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No new bookings pending approval.</p>
                      </div>
                    ) : (
                      activeRequests.map(b => (
                        <div key={b.id} className="glass-panel animate-slide-up" style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 'bold' }}>TICKET: {b.id}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>₹{b.price}</span>
                          </div>
                          <h4 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'white' }}>{b.serviceName}</h4>
                          
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> Customer: {b.customerName}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> Slot: {b.date} • {b.timeSlot}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FileText size={12} /> Notes: {b.notes}</div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button 
                              onClick={() => handleUpdateBookingStatus(b.id, 'cancelled', { reason: 'Partner Rejected' })}
                              className="btn btn-secondary" 
                              style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}
                            >
                              <XCircle size={14} /> Decline
                            </button>
                            <button 
                              onClick={() => handleUpdateBookingStatus(b.id, 'accepted')}
                              className="btn btn-primary" 
                              style={{ flex: 2, padding: '0.4rem', fontSize: '0.8rem' }}
                            >
                              <CheckCircle2 size={14} /> Accept Request
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Column 2: In-Progress / Ongoing Jobs */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Active Ongoing Board ({ongoingJobs.length})
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {ongoingJobs.length === 0 ? (
                      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No current jobs active.</p>
                      </div>
                    ) : (
                      ongoingJobs.map(b => (
                        <div key={b.id} className="glass-panel animate-slide-up" style={{ padding: '1rem', borderColor: 'var(--primary-glow)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span className="badge badge-info">{b.status.replace(/_/g, ' ')}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {b.id}</span>
                          </div>

                          <h4 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'white' }}>{b.serviceName}</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>Client: {b.customerName} (+91 {b.customerMobile})</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Address: {b.customerAddress}</p>

                          {/* Control transitions buttons based on state */}
                          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {b.status === 'accepted' && (
                              <button 
                                onClick={() => handleUpdateBookingStatus(b.id, 'on_the_way')}
                                className="btn btn-primary" 
                                style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}
                              >
                                <ArrowRight size={14} /> Dispatch/On The Way
                              </button>
                            )}

                            {b.status === 'on_the_way' && (
                              <button 
                                onClick={() => setActiveJobForOtp(b)}
                                className="btn btn-primary btn-glow" 
                                style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}
                              >
                                🔒 Verify Security OTP to Start
                              </button>
                            )}

                            {b.status === 'started' && (
                              <button 
                                onClick={() => setShowQrCodeForBooking(b)}
                                className="btn btn-primary" 
                                style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}
                              >
                                <QrCode size={14} /> Complete Work (Scan QR)
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 3: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="animate-fade" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>My Service Catalogue</h2>
              <button className="btn btn-primary" onClick={() => setShowAddServiceModal(true)}>
                <Plus size={16} /> Add Custom Service
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              
              {/* Default primary service */}
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>PRIMARY SERVICE OFFER</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', textTransform: 'capitalize' }}>
                  {currentProviderProfile.category} Service
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
                  Standard diagnostic visit, short circuit fixes, wiring repair checks.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Charges rate:</span>
                  <strong style={{ fontSize: '1.1rem', color: 'white' }}>₹{currentProviderProfile.hourlyRate} / hr</strong>
                </div>
              </div>

              {/* Extra mapped ones */}
              {currentProviderProfile.gallery.length > 0 && currentProviderProfile.gallery.map((img, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={img} alt="Catalog service" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Diagnostic Offering {idx + 1}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>Hourly setup with high-grade components.</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hourly rate:</span>
                      <strong style={{ fontSize: '1.1rem', color: 'white' }}>₹{currentProviderProfile.hourlyRate}</strong>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* TAB 4: SCHEDULE hours config */}
        {activeTab === 'schedule' && (
          <div className="animate-fade" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>Availability Schedule</h2>
              
              {/* Vacation Mode Toggle */}
              <button 
                onClick={() => setVacationMode(!vacationMode)}
                className={`btn ${vacationMode ? 'btn-danger' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                {vacationMode ? '🌴 Vacation Mode Active' : '🗓️ Go on Vacation'}
              </button>
            </div>

            {vacationMode ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <Sparkles size={48} color="var(--primary-light)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Vacation Mode Active</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  You are offline. Customer app will temporarily hide your profile from listings to prevent missed requests.
                </p>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Configure weekly operational hours and custom time slots.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.keys(schedule).map((day) => (
                    <div 
                      key={day} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '0.75rem 1rem', 
                        background: schedule[day].active ? 'rgba(139,92,246,0.04)' : 'transparent',
                        border: '1px solid var(--border-light)',
                        borderRadius: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button 
                          onClick={() => toggleScheduleDay(day)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: schedule[day].active ? 'var(--primary)' : 'var(--text-muted)' }}
                        >
                          {schedule[day].active ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                        </button>
                        <span style={{ fontWeight: 600, textTransform: 'capitalize', color: 'white', width: '90px' }}>{day}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '350px' }}>
                        {schedule[day].active ? (
                          schedule[day].slots.map((s, idx) => (
                            <span key={idx} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                              {s}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Closed/Non-operational</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PAYOUTS & UPI */}
        {activeTab === 'earnings' && (
          <div className="animate-fade" style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>Earnings & UPI Settlements</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Withdrawal Request Form */}
              <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1.25rem' }}>Withdrawal Request</h3>
                
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Withdrawable Balance:</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>₹{earningsSummary.withdrawable.toFixed(2)}</div>
                </div>

                <form onSubmit={handleWithdrawalRequest}>
                  <div className="form-group">
                    <label className="form-label">Payout Amount (INR)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 500" 
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">UPI ID (Instant Settlement)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. rajesh@paytm" 
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setBankDetails({ account: '', name: '', bank: '' });
                      }}
                      required={!bankDetails.account}
                    />
                  </div>

                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0.5rem 0' }}>— OR —</div>

                  <div className="form-group">
                    <label className="form-label">Bank Account Number</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="9182394859" 
                      value={bankDetails.account}
                      onChange={(e) => {
                        setBankDetails(prev => ({ ...prev, account: e.target.value }));
                        setUpiId('');
                      }}
                      required={!upiId}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-glow" style={{ width: '100%', marginTop: '1rem' }}>
                    Request Fund Settlement
                  </button>
                </form>
              </div>

              {/* Settlement logs history */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1.25rem' }}>Settlement Logs</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '380px', overflowY: 'auto' }}>
                  {withdrawalLogs.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent withdrawal records.</p>
                  ) : (
                    withdrawalLogs.map((log) => (
                      <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'white' }}>₹{log.amount}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Method: {log.method} • {log.date}</div>
                        </div>
                        <span className={`badge ${log.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                          {log.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* POPUP: OTP SECURE VERIFICATION */}
      {activeJobForOtp && (
        <div className="dialog-backdrop">
          <div className="dialog-content animate-slide-up" style={{ maxWidth: '380px' }}>
            <div className="dialog-header">
              <h3 className="dialog-title">OTP Security Check</h3>
              <button className="dialog-close" onClick={() => {
                setActiveJobForOtp(null);
                setEnteredOtp('');
              }}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="dialog-body" style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Type the 4-digit code displayed on the client's app (Ticket: <strong>{activeJobForOtp.id}</strong>) to confirm your check-in.
              </p>
              <form onSubmit={handleOtpVerifyAndStart}>
                <div className="form-group">
                  <label className="form-label">Security OTP Code</label>
                  <input 
                    type="text" 
                    maxLength="4" 
                    placeholder="XXXX"
                    className="form-control" 
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em', fontWeight: 'bold' }}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Verify & Start Work
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: COMPLETED QR CODE SCAN */}
      {showQrCodeForBooking && (
        <div className="dialog-backdrop">
          <div className="dialog-content animate-slide-up" style={{ maxWidth: '380px' }}>
            <div className="dialog-header">
              <h3 className="dialog-title">Job Completion Scan</h3>
              <button className="dialog-close" onClick={() => setShowQrCodeForBooking(null)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="dialog-body" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Show this QR code to the customer. Scanning completes the ticket and triggers wallet transfer.
              </p>
              
              {/* Draw custom visual mock QR code */}
              <div 
                style={{ 
                  margin: '0 auto 1.5rem auto', 
                  width: '180px', 
                  height: '180px', 
                  border: '8px solid white', 
                  borderRadius: '12px',
                  background: 'white',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundImage: 'radial-gradient(black 30%, transparent 30%), radial-gradient(black 30%, transparent 30%)',
                    backgroundSize: '12px 12px',
                    backgroundPosition: '0 0, 6px 6px',
                    position: 'relative'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', border: '5px solid black' }}></div>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', border: '5px solid black' }}></div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px', border: '5px solid black' }}></div>
                </div>
              </div>

              <span className="badge badge-info" style={{ marginBottom: '1.5rem' }}>TICKET ID: {showQrCodeForBooking.id}</span>

              {/* Force complete option for simulator testing ease */}
              <button 
                onClick={() => {
                  handleUpdateBookingStatus(showQrCodeForBooking.id, 'completed');
                  setShowQrCodeForBooking(null);
                }}
                className="btn btn-primary" 
                style={{ width: '100%' }}
              >
                ⚡ Force Complete (Scan Simulation)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM SERVICE CATALOG */}
      {showAddServiceModal && (
        <div className="dialog-backdrop">
          <div className="dialog-content animate-slide-up">
            <div className="dialog-header">
              <h3 className="dialog-title">Add Custom Catalog Service</h3>
              <button className="dialog-close" onClick={() => setShowAddServiceModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="dialog-body" style={{ textAlign: 'left' }}>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleProviderAddService(newService);
                setNewService({ name: '', price: '', description: '', image: '' });
                setShowAddServiceModal(false);
              }}>
                <div className="form-group">
                  <label className="form-label">Service Offering Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Copper wiring installation" 
                    value={newService.name}
                    onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Service Rate (₹ / hr)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 299" 
                    value={newService.price}
                    onChange={(e) => setNewService(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL (Optional)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. https://images.unsplash.com/photo-..." 
                    value={newService.image}
                    onChange={(e) => setNewService(prev => ({ ...prev, image: e.target.value }))}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Publish Offering
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
