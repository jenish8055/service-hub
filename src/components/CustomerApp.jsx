import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import LiveTrackingMap from './LiveTrackingMap';
import VoiceSearchSimulator from './VoiceSearchSimulator';
import VideoCallSimulator from './VideoCallSimulator';
import { 
  Zap, Droplet, Hammer, Paintbrush, Sparkles, Wind, Bug, BookOpen, Scissors, Wrench, 
  Search, Mic, Star, Filter, Calendar, Clock, CreditCard, MessageSquare, Phone, 
  ShieldAlert, DollarSign, PlusCircle, CheckCircle2, ListOrdered, MapPin, Sliders, 
  User, Map, Video, Send, ChevronRight, Image as ImageIcon, Volume2, ArrowLeft,
  X, Check, Trash2, Heart, Award, ArrowUpRight
} from 'lucide-react';

export default function CustomerApp({ showSplash, setShowSplash }) {
  const {
    role, setRole,
    currentLocation,
    customerSession,
    categories,
    providers,
    bookings,
    wallet,
    chats,
    handleCustomerLogin,
    handleCustomerRegister,
    handleCreateBooking,
    handleAddReview,
    handleOpenDispute,
    sendChatMessage,
    handleAddWalletMoney
  } = useMarketplace();

  // Navigation states
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('home'); // home, bookings, wallet, profile
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
  const [chatProvider, setChatProvider] = useState(null);

  // Filters state
  const [filterRating, setFilterRating] = useState(0);
  const [filterPrice, setFilterPrice] = useState(1000);
  const [filterDistance, setFilterDistance] = useState(15);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Modals state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState('phone'); // phone, otp, register
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', city: 'Ahmedabad' });
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);

  // Booking Flow State
  const [bookingWizard, setBookingWizard] = useState({
    date: '',
    timeSlot: '',
    address: '404, Girdhar Nagar Heights, Ahmedabad',
    notes: '',
    paymentMethod: 'wallet',
    price: 0,
    serviceName: 'Standard Diagnostic Visit'
  });

  // Review & Rating State
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    text: '',
    images: []
  });

  // Dispute Form State
  const [disputeText, setDisputeText] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  // Chat message typing
  const [chatInput, setChatInput] = useState('');
  const chatMessagesEndRef = useRef(null);

  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, chatProvider]);

  // Onboarding slides
  const onboardingSlides = [
    { title: "Find Trusted Local Services", desc: "Browse pre-verified electricians, plumbers, painters, and cleaners near you.", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500" },
    { title: "Book Services Instantly", desc: "Select time-slots that fit your routine and pay securely via wallet.", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500" },
    { title: "Track Service Status Live", desc: "Follow your service professional moving real-time on our mapping system.", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500" }
  ];

  // Auto scroll/dismiss splash screen
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const triggerLoginPrompt = () => {
    setLoginStep('phone');
    setLoginPhone('');
    setLoginOtp('');
    setShowLoginModal(true);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.length < 10) {
      alert('Enter a valid 10-digit mobile number');
      return;
    }
    const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(mockOtp);
    setLoginStep('otp');
    // Simulate SMS alert
    setTimeout(() => {
      alert(`[SMS Gateway Simulate] ServiceHub OTP Code: ${mockOtp}`);
    }, 500);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (loginOtp !== generatedOtp) {
      alert('Invalid OTP. Please check the simulated SMS alert.');
      return;
    }

    // Check if phone matches pre-registered ones, or needs registration
    if (loginPhone.includes('9876543210') || loginPhone === '9876543210') {
      handleCustomerLogin(loginPhone);
      setShowLoginModal(false);
    } else {
      setLoginStep('register');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    handleCustomerRegister({
      name: registerForm.name,
      mobile: loginPhone,
      email: registerForm.email,
      city: registerForm.city
    });
    setShowLoginModal(false);
  };

  const autoReadOtp = () => {
    setLoginOtp(generatedOtp);
  };

  // Filter logic
  const getFilteredProviders = () => {
    return providers.filter(p => {
      // Category match
      if (selectedCategory && p.category !== selectedCategory) return false;
      // Search query match
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      // Rating match
      if (p.rating < filterRating) return false;
      // Hourly rate match
      if (p.hourlyRate > filterPrice) return false;
      
      return true;
    });
  };

  const getCategoryIcon = (iconName) => {
    const icons = {
      Zap: <Zap size={22} />,
      Droplet: <Droplet size={22} />,
      Hammer: <Hammer size={22} />,
      Paintbrush: <Paintbrush size={22} />,
      Sparkles: <Sparkles size={22} />,
      Wind: <Wind size={22} />,
      Bug: <Bug size={22} />,
      BookOpen: <BookOpen size={22} />,
      Scissors: <Scissors size={22} />,
      Wrench: <Wrench size={22} />
    };
    return icons[iconName] || <Sparkles size={22} />;
  };

  const initiateBooking = (provider) => {
    if (!customerSession.loggedIn) {
      triggerLoginPrompt();
      return;
    }
    setSelectedProvider(provider);
    setBookingWizard(prev => ({
      ...prev,
      providerId: provider.id,
      providerName: provider.name,
      category: provider.category,
      price: provider.hourlyRate + 50, // base hourly charge + ₹50 marketplace booking fee
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0] // default tomorrow
    }));
    setActiveTab('booking-wizard');
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!bookingWizard.timeSlot) {
      alert('Please select a time slot.');
      return;
    }
    const result = handleCreateBooking(bookingWizard);
    if (result) {
      setActiveBooking(result);
      setActiveTab('booking-success');
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim() || !chatProvider) return;
    const sessionKey = `${chatProvider.id}_customer`;
    sendChatMessage(sessionKey, 'customer', chatInput);
    setChatInput('');

    // Simulate auto provider response after 2 seconds
    setTimeout(() => {
      sendChatMessage(
        sessionKey, 
        'provider', 
        `Thanks for contacting me! I'm reviewing your message regarding the wiring job. Let's touch base.`
      );
    }, 2000);
  };

  const sendMockLocationShare = () => {
    const sessionKey = `${chatProvider.id}_customer`;
    sendChatMessage(
      sessionKey, 
      'customer', 
      'Shared location: 404, Girdhar Nagar Heights, Ahmedabad',
      'location',
      'https://maps.google.com/?q=23.0425,72.6186'
    );
  };

  const sendMockImageShare = () => {
    const sessionKey = `${chatProvider.id}_customer`;
    sendChatMessage(
      sessionKey, 
      'customer', 
      'Sent an image of the electrical board',
      'image',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300'
    );
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!selectedProvider) return;
    handleAddReview(selectedProvider.id, reviewForm.rating, reviewForm.text, reviewForm.images);
    // Reset review
    setReviewForm({ rating: 5, text: '', images: [] });
    // Go to provider details again
    // Re-fetch updated provider
    const updated = providers.find(p => p.id === selectedProvider.id);
    setSelectedProvider(updated);
  };

  // Wallet payment
  const [walletAddAmount, setWalletAddAmount] = useState('');

  // Main UI render switches
  if (showSplash) {
    return (
      <div className="splash-bg">
        <div className="splash-logo-container">
          <Wrench size={50} color="white" />
        </div>
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: '2.5rem', letterSpacing: '0.05em' }}>
          Service<span style={{ color: 'var(--secondary)' }}>Hub</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Local Service Marketplace</p>
        <div className="splash-spinner"></div>
      </div>
    );
  }

  if (!isOnboarded) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', minHeight: '100vh', padding: '2rem 1rem' }}>
        <div className="glass-panel" style={{ maxWidth: '450px', margin: '0 auto', overflow: 'hidden', border: '1px solid var(--primary-glow)' }}>
          <div style={{ overflow: 'hidden' }}>
            <div className="onboarding-slider" style={{ transform: `translateX(-${onboardingIndex * 33.333}%)` }}>
              {onboardingSlides.map((slide, idx) => (
                <div className="onboarding-slide" key={idx}>
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }} 
                  />
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>{slide.title}</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{slide.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '0 2rem 2rem 2rem' }}>
            <div className="onboarding-dots">
              {onboardingSlides.map((_, idx) => (
                <div key={idx} className={`onboarding-dot ${onboardingIndex === idx ? 'active' : ''}`}></div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem' }}>
              {onboardingIndex < 2 ? (
                <>
                  <button className="btn btn-secondary" onClick={() => setIsOnboarded(true)} style={{ flex: 1 }}>Skip</button>
                  <button className="btn btn-primary" onClick={() => setOnboardingIndex(p => p + 1)} style={{ flex: 1 }}>Next</button>
                </>
              ) : (
                <button className="btn btn-primary btn-glow" onClick={() => setIsOnboarded(true)} style={{ width: '100%' }}>Get Started</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      {/* Search and Hero Area for Home Tab */}
      {activeTab === 'home' && !selectedProvider && (
        <section style={{ textAlign: 'center', margin: '2.5rem 0' }}>
          <h1 className="animate-slide-up" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
            Find & Book Local Services
          </h1>
          <p className="animate-slide-up" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Instant bookings with verified experts in {currentLocation.split(',')[0]}
          </p>

          {/* Search bar & voice button */}
          <div 
            className="glass-panel" 
            style={{ 
              maxWidth: '600px', 
              margin: '0 auto', 
              padding: '0.25rem', 
              display: 'flex', 
              alignItems: 'center',
              border: '1px solid var(--border-light)',
              borderRadius: '12px'
            }}
          >
            <Search size={20} color="var(--text-muted)" style={{ marginLeft: '1rem' }} />
            <input 
              type="text" 
              placeholder='Search e.g. Plumber, Electrician...' 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                flexGrow: 1, 
                background: 'transparent', 
                border: 'none', 
                outline: 'none', 
                color: 'white', 
                fontSize: '0.95rem', 
                padding: '0.75rem 1rem' 
              }} 
            />
            
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
                <X size={18} />
              </button>
            )}

            <button 
              onClick={() => setShowVoiceModal(true)} 
              className="btn btn-secondary" 
              style={{ borderRadius: '10px', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)' }}
            >
              <Mic size={16} color="var(--primary-light)" />
            </button>
            
            <button 
              onClick={() => setShowFilterModal(true)}
              className="btn btn-primary" 
              style={{ borderRadius: '10px', padding: '0.6rem 1rem', marginLeft: '0.25rem' }}
            >
              <Sliders size={16} /> Filters
            </button>
          </div>
        </section>
      )}

      {/* Primary Navigation Panels */}
      <div className="main-content">
        
        {/* TAB 1: HOME DASHBOARD */}
        {activeTab === 'home' && !selectedProvider && (
          <div>
            {/* Horizontal Categories Grid */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'left', color: 'white' }}>Categories</h3>
              <div className="categories-grid">
                {categories.map((cat) => (
                  <div 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                    className={`category-card ${selectedCategory === cat.id ? 'active' : ''}`}
                  >
                    <div className="category-icon-wrapper">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <div className="category-name">{cat.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Banners Slider */}
            <div style={{ marginBottom: '2.5rem', overflow: 'hidden', borderRadius: '16px' }}>
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <div 
                  className="glass-panel" 
                  style={{ 
                    minWidth: '280px', 
                    flex: '0 0 auto', 
                    padding: '1.25rem', 
                    textAlign: 'left',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.15))',
                    border: '1px solid var(--primary-glow)',
                    borderRadius: '16px',
                    position: 'relative'
                  }}
                >
                  <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>20% OFF</span>
                  <h4 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.25rem' }}>Monsoon AC Special</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Get premium AC servicing at standard price</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px dashed var(--primary)' }}>USE CODE: MONSOON20</code>
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                <div 
                  className="glass-panel" 
                  style={{ 
                    minWidth: '280px', 
                    flex: '0 0 auto', 
                    padding: '1.25rem', 
                    textAlign: 'left',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.15))',
                    border: '1px solid var(--border-light)',
                    borderRadius: '16px'
                  }}
                >
                  <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>POPULAR</span>
                  <h4 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.25rem' }}>Deep Cleaning Offer</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Starting at just ₹999 for full apartment check</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px dashed var(--border-light)' }}>USE CODE: SPARKLE</code>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Providers Listing (Grid of cards) */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>
                  {selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name} Professionals` : 'Recommended Service Partners'}
                </h3>
                {selectedCategory && (
                  <button onClick={() => setSelectedCategory('')} style={{ background: 'transparent', border: 'none', color: 'var(--primary-light)', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Clear Category
                  </button>
                )}
              </div>

              {getFilteredProviders().length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>No service providers found matching filters.</p>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setSelectedCategory('');
                      setSearchQuery('');
                      setFilterRating(0);
                      setFilterPrice(1000);
                    }}
                    style={{ marginTop: '1rem' }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
                  {getFilteredProviders().map((prov) => (
                    <div key={prov.id} className="glass-panel provider-card animate-slide-up" style={{ padding: 0 }}>
                      <div className="provider-header">
                        <img src={prov.avatar} alt={prov.name} className="provider-avatar" />
                        <div className="provider-meta">
                          <div className="provider-name">{prov.name}</div>
                          <div className="provider-title">{prov.category}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                            <Star size={12} fill="var(--warning)" color="var(--warning)" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white' }}>{prov.rating}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({prov.reviewsCount} reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="provider-info-grid">
                        <div className="info-item">
                          <Award size={14} color="var(--primary-light)" />
                          <span>{prov.experience} yrs exp</span>
                        </div>
                        <div className="info-item">
                          <MapPin size={14} color="var(--primary-light)" />
                          <span>Within 3.5 km</span>
                        </div>
                        <div className="info-item" style={{ gridColumn: 'span 2' }}>
                          <CheckCircle2 size={14} color="var(--success)" />
                          <span style={{ color: 'var(--success)' }}>Govt ID Verified</span>
                        </div>
                      </div>

                      <div className="provider-footer">
                        <div>
                          <div className="price-label">Starting Price</div>
                          <div className="price-amount">₹{prov.hourlyRate} <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/ hr</span></div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.5rem 0.75rem' }}
                            onClick={() => setSelectedProvider(prov)}
                          >
                            Details
                          </button>
                          <button 
                            className="btn btn-primary"
                            onClick={() => initiateBooking(prov)}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How It Works section */}
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', background: 'rgba(255,255,255,0.01)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white', textAlign: 'center' }}>How ServiceHub Works</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'white', marginBottom: '0.25rem' }}>Choose Service & Partner</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Filter by pricing, rating and experience reviews.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'white', marginBottom: '0.25rem' }}>Schedule & Book</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Book a convenient slot. Security OTP checks protect you.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', fontWeight: 'bold', flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'white', marginBottom: '0.25rem' }}>Track & Complete</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Track location live. Complete using QR-Code scans.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: PROVIDER DETAILS */}
        {selectedProvider && activeTab === 'home' && (
          <div className="animate-fade">
            <button className="btn btn-secondary" onClick={() => setSelectedProvider(null)} style={{ marginBottom: '1.5rem', padding: '0.5rem 0.75rem', gap: '0.25rem' }}>
              <ArrowLeft size={16} /> Back to Listings
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Profile Card */}
              <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', height: 'fit-content' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <img src={selectedProvider.avatar} alt={selectedProvider.name} style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', border: '3px solid var(--primary-glow)' }} />
                  <div>
                    <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>{selectedProvider.name}</h2>
                    <span className="badge badge-info" style={{ marginTop: '0.25rem', textTransform: 'uppercase' }}>{selectedProvider.category}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                      <Star size={14} fill="var(--warning)" color="var(--warning)" />
                      <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{selectedProvider.rating}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({selectedProvider.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <hr style={{ borderColor: 'var(--border-light)', margin: '1.5rem 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Experience:</span>
                    <span style={{ fontWeight: 600, color: 'white' }}>{selectedProvider.experience} Years</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Hourly Rate:</span>
                    <span style={{ fontWeight: 600, color: 'white' }}>₹{selectedProvider.hourlyRate} / hr</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Availability:</span>
                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>Mon - Sun (8am - 8pm)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                    <span className="badge badge-success">Govt ID Verified</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                  {customerSession.loggedIn ? (
                    <>
                      <button 
                        onClick={() => {
                          setChatProvider(selectedProvider);
                          setActiveTab('chat');
                        }}
                        className="btn btn-secondary" 
                        style={{ flex: 1 }}
                      >
                        <MessageSquare size={16} /> Chat
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedProvider(selectedProvider);
                          setShowVideoCall(true);
                        }}
                        className="btn btn-secondary" 
                        style={{ flex: 1 }}
                      >
                        <Video size={16} /> Call
                      </button>
                    </>
                  ) : null}
                  <button 
                    onClick={() => initiateBooking(selectedProvider)} 
                    className="btn btn-primary btn-glow" 
                    style={{ flex: 2 }}
                  >
                    {customerSession.loggedIn ? 'Book Service Now' : 'Login to Book'}
                  </button>
                </div>
              </div>

              {/* Gallery & Reviews tab column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
                
                {/* Portfolio Gallery */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Work Portfolio</h3>
                  {selectedProvider.gallery.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No portfolio images uploaded yet.</p>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
                      {selectedProvider.gallery.map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt="Portfolio work" 
                          style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-light)' }} 
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Reviews listing & Review Form */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Reviews</h3>
                  
                  {/* Review writing form for logged in customer */}
                  {customerSession.loggedIn && (
                    <form onSubmit={submitReview} style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', marginBottom: '0.75rem' }}>Write a Review</h4>
                      <div className="form-group">
                        <label className="form-label">Rating</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                              type="button" 
                              key={star}
                              onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                            >
                              <Star 
                                size={20} 
                                fill={reviewForm.rating >= star ? "var(--warning)" : "transparent"} 
                                color={reviewForm.rating >= star ? "var(--warning)" : "var(--text-muted)"} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Your Feedback</label>
                        <textarea 
                          className="form-control" 
                          rows="3" 
                          placeholder="Tell us about the quality, clean-up, and behavior..."
                          value={reviewForm.text}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        Submit Review
                      </button>
                    </form>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedProvider.reviews.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No reviews yet. Be the first to leave one!</p>
                    ) : (
                      selectedProvider.reviews.map((rev) => (
                        <div key={rev.id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>{rev.customerName}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.25rem', margin: '0.25rem 0' }}>
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={10} fill={rev.rating >= s ? "var(--warning)" : "transparent"} color={rev.rating >= s ? "var(--warning)" : "transparent"} />
                            ))}
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{rev.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 2: MY BOOKINGS SCREEN */}
        {activeTab === 'bookings' && (
          <div className="animate-fade">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', textAlign: 'left' }}>My Booking Schedule</h2>
            
            {!customerSession.loggedIn ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <ShieldAlert size={48} color="var(--primary-light)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Authentication Required</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Please login to view your active service tickets and booking history.</p>
                <button className="btn btn-primary" onClick={triggerLoginPrompt}>Login / Sign Up</button>
              </div>
            ) : (
              <div>
                {/* Booking status sub-filter tabs */}
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                  {['all', 'requested', 'accepted', 'on_the_way', 'started', 'completed', 'cancelled'].map(stat => (
                    <button 
                      key={stat}
                      onClick={() => setSelectedCategory(stat)} // reuse state variable to filter status
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        borderBottom: (selectedCategory === stat || (stat === 'all' && !selectedCategory)) ? '2px solid var(--primary)' : 'none',
                        color: (selectedCategory === stat || (stat === 'all' && !selectedCategory)) ? 'white' : 'var(--text-muted)',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {stat.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>

                {/* Bookings Card List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                  {bookings
                    .filter(b => b.customerMobile === customerSession.mobile)
                    .filter(b => !selectedCategory || selectedCategory === 'all' || b.status === selectedCategory)
                    .length === 0 ? (
                      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No service bookings found matching selection.</p>
                      </div>
                    ) : (
                      bookings
                        .filter(b => b.customerMobile === customerSession.mobile)
                        .filter(b => !selectedCategory || selectedCategory === 'all' || b.status === selectedCategory)
                        .map(b => (
                          <div key={b.id} className="glass-panel animate-slide-up" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                              <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ticket ID: </span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{b.id}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span className={`badge ${
                                  b.status === 'requested' ? 'badge-warning' :
                                  b.status === 'accepted' ? 'badge-info' :
                                  b.status === 'on_the_way' || b.status === 'started' ? 'badge-info' :
                                  b.status === 'completed' ? 'badge-success' : 'badge-danger'
                                }`}>
                                  {b.status.replace(/_/g, ' ')}
                                </span>
                                <span className={`badge ${b.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                  {b.paymentStatus === 'paid' ? 'PAID' : 'PAY PENDING'}
                                </span>
                              </div>
                            </div>

                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>{b.serviceName}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--primary-light)', marginBottom: '0.75rem' }}>Service Pro: {b.providerName}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={14} />
                                <span>{b.date}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Clock size={14} />
                                <span>{b.timeSlot}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', gridColumn: 'span 2' }}>
                                <MapPin size={14} />
                                <span>{b.customerAddress}</span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                              <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Price Details: </span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>₹{b.price}</span>
                              </div>

                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {(b.status === 'on_the_way' || b.status === 'started' || b.status === 'accepted') && (
                                  <button 
                                    className="btn btn-primary" 
                                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                                    onClick={() => {
                                      setSelectedBookingForDetails(b);
                                      setActiveTab('tracking');
                                    }}
                                  >
                                    <Map size={14} /> Track Status
                                  </button>
                                )}
                                <button 
                                  className="btn btn-secondary" 
                                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                                  onClick={() => {
                                    const prov = providers.find(p => p.id === b.providerId);
                                    if (prov) {
                                      setChatProvider(prov);
                                      setActiveTab('chat');
                                    }
                                  }}
                                >
                                  <MessageSquare size={14} /> Message Pro
                                </button>
                                {b.status === 'completed' && (
                                  <button 
                                    className="btn btn-danger" 
                                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                                    onClick={() => {
                                      setSelectedBookingForDetails(b);
                                      setShowDisputeModal(true);
                                    }}
                                  >
                                    Raise Dispute
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WALLET */}
        {activeTab === 'wallet' && (
          <div className="animate-fade">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', textAlign: 'left' }}>ServiceHub Digital Wallet</h2>
            
            {!customerSession.loggedIn ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <ShieldAlert size={48} color="var(--primary-light)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Authentication Required</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Please login to add money or verify billing logs.</p>
                <button className="btn btn-primary" onClick={triggerLoginPrompt}>Login / Sign Up</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', textAlign: 'left' }}>
                
                {/* Balance & Add Money Card */}
                <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Wallet Balance</h3>
                      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginTop: '0.15rem' }}>₹{wallet.balance.toFixed(2)}</h1>
                    </div>
                  </div>

                  <hr style={{ borderColor: 'var(--border-light)', margin: '1.5rem 0' }} />

                  <div className="form-group">
                    <label className="form-label">Add Funds (INR)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Enter Amount e.g. 500" 
                        value={walletAddAmount}
                        onChange={(e) => setWalletAddAmount(e.target.value)}
                      />
                      <button 
                        onClick={() => {
                          handleAddWalletMoney(walletAddAmount);
                          setWalletAddAmount('');
                        }}
                        className="btn btn-primary btn-glow"
                      >
                        Add Money
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    {['200', '500', '1000'].map(val => (
                      <button 
                        key={val} 
                        onClick={() => setWalletAddAmount(val)}
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}
                      >
                        +₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Billing Statement logs */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1.25rem' }}>Billing Statement</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
                    {wallet.transactions.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent transactions.</p>
                    ) : (
                      wallet.transactions.map((tx) => (
                        <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'white' }}>{tx.description}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{tx.date} • {tx.id}</div>
                          </div>
                          <div style={{ fontWeight: 'bold', fontSize: '1rem', color: tx.type === 'credit' ? 'var(--success)' : 'var(--danger)' }}>
                            {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
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

        {/* TAB 4: PROFILE & SETTINGS */}
        {activeTab === 'profile' && (
          <div className="animate-fade">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', textAlign: 'left' }}>User Account Profile</h2>
            
            {!customerSession.loggedIn ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <ShieldAlert size={48} color="var(--primary-light)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Authentication Required</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Login to modify contact cards, manage default locations, or request help.</p>
                <button className="btn btn-primary" onClick={triggerLoginPrompt}>Login / Sign Up</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', textAlign: 'left' }}>
                {/* Contact Card details */}
                <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>
                      {customerSession.name.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{customerSession.name}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Registered Customer</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Mobile Phone</span>
                      <span style={{ fontWeight: 600, color: 'white' }}>{customerSession.mobile}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email Address</span>
                      <span style={{ fontWeight: 600, color: 'white' }}>{customerSession.email}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Current City</span>
                      <span style={{ fontWeight: 600, color: 'white' }}>{customerSession.city}</span>
                    </div>
                  </div>
                </div>

                {/* Saved addresses & system info */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1.25rem' }}>Saved Addresses</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ border: '1px solid var(--primary-glow)', background: 'rgba(139,92,246,0.04)', padding: '1rem', borderRadius: '10px', display: 'flex', gap: '0.75rem' }}>
                      <MapPin size={20} color="var(--primary-light)" style={{ flexShrink: 0 }} />
                      <div>
                        <h4 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white', marginBottom: '0.25rem' }}>Home (Default Address)</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>404, Girdhar Nagar Heights, Girdhar Nagar, Ahmedabad</p>
                      </div>
                    </div>

                    <div style={{ border: '1px solid var(--border-light)', background: 'transparent', padding: '1rem', borderRadius: '10px', display: 'flex', gap: '0.75rem', opacity: 0.6 }}>
                      <MapPin size={20} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      <div>
                        <h4 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white', marginBottom: '0.25rem' }}>Office</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>702, Dev Aurum Complex, Prahlad Nagar, Ahmedabad</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '2.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', marginBottom: '0.75rem' }}>Help Center & SOS</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Need immediate support or have safety disputes on-site?</p>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.8rem' }} onClick={() => alert('Support Ticket Raised! Standard response time is 15 minutes.')}>Chat Support</button>
                      <button className="btn btn-danger" style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.8rem' }} onClick={() => alert('🚨 EMERGENCY SOS DISPATCHED: Admin has been pings with your GPS coordinates. Local help is alerted!')}>⚠️ SOS Alert</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOOKING FLOW WIZARD */}
        {activeTab === 'booking-wizard' && selectedProvider && (
          <div className="glass-panel animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>Confirm Service Booking</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img src={selectedProvider.avatar} alt={selectedProvider.name} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontWeight: 600, color: 'white' }}>{selectedProvider.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>Expert {selectedProvider.category}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div className="form-group">
                <label className="form-label">Service Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={bookingWizard.serviceName}
                  onChange={(e) => setBookingWizard(prev => ({ ...prev, serviceName: e.target.value }))}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Select Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={bookingWizard.date}
                    onChange={(e) => setBookingWizard(prev => ({ ...prev, date: e.target.value }))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <select 
                    className="form-control"
                    value={bookingWizard.timeSlot}
                    onChange={(e) => setBookingWizard(prev => ({ ...prev, timeSlot: e.target.value }))}
                    required
                  >
                    <option value="">Select slot...</option>
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Address for Visit</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={bookingWizard.address}
                  onChange={(e) => setBookingWizard(prev => ({ ...prev, address: e.target.value }))}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Special Notes (Optional)</label>
                <textarea 
                  className="form-control" 
                  rows="2" 
                  placeholder="e.g. Bring a tall ladder, water valve leaks..."
                  value={bookingWizard.notes}
                  onChange={(e) => setBookingWizard(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label className="glass-panel" style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', borderColor: bookingWizard.paymentMethod === 'wallet' ? 'var(--primary)' : 'var(--border-light)' }}>
                    <input 
                      type="radio" 
                      name="payMethod" 
                      checked={bookingWizard.paymentMethod === 'wallet'}
                      onChange={() => setBookingWizard(prev => ({ ...prev, paymentMethod: 'wallet' }))}
                      style={{ accentColor: 'var(--primary)' }} 
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>Pay via Wallet</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Bal: ₹{wallet.balance.toFixed(2)}</div>
                    </div>
                  </label>

                  <label className="glass-panel" style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', borderColor: bookingWizard.paymentMethod === 'cash' ? 'var(--primary)' : 'var(--border-light)' }}>
                    <input 
                      type="radio" 
                      name="payMethod" 
                      checked={bookingWizard.paymentMethod === 'cash'}
                      onChange={() => setBookingWizard(prev => ({ ...prev, paymentMethod: 'cash' }))}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>Pay Later / Cash</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Pay on completion</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price calculation list */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Partner Hourly Base:</span>
                  <span style={{ color: 'white' }}>₹{selectedProvider.hourlyRate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Marketplace Convenience Fee:</span>
                  <span style={{ color: 'white' }}>₹50</span>
                </div>
                <hr style={{ borderColor: 'var(--border-light)', margin: '0.5rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1rem' }}>
                  <span style={{ color: 'white' }}>Total Amount Due:</span>
                  <span style={{ color: 'var(--primary-light)' }}>₹{bookingWizard.price}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('home')} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-glow" style={{ flex: 2 }}>Confirm & Pay</button>
              </div>
            </form>
          </div>
        )}

        {/* BOOKING SUCCESS SCREEN */}
        {activeTab === 'booking-success' && activeBooking && (
          <div className="glass-panel animate-slide-up" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem', textAlign: 'center' }}>
            <svg className="success-checkmark-svg" viewBox="0 0 52 52">
              <circle className="success-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Your ticket ID is <strong>{activeBooking.id}</strong>. Awaiting service partner response.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '10px', textAlign: 'left', marginBottom: '2.0rem', fontSize: '0.85rem' }}>
              <div style={{ marginBottom: '0.5rem' }}><span style={{ color: 'var(--text-secondary)' }}>Service:</span> <span style={{ color: 'white', fontWeight: 600 }}>{activeBooking.serviceName}</span></div>
              <div style={{ marginBottom: '0.5rem' }}><span style={{ color: 'var(--text-secondary)' }}>Partner:</span> <span style={{ color: 'white', fontWeight: 600 }}>{activeBooking.providerName}</span></div>
              <div style={{ marginBottom: '0.5rem' }}><span style={{ color: 'var(--text-secondary)' }}>Scheduled:</span> <span style={{ color: 'white', fontWeight: 600 }}>{activeBooking.date} • {activeBooking.timeSlot}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(139,92,246,0.1)', padding: '0.5rem', borderRadius: '6px', border: '1px dashed var(--primary)', marginTop: '0.75rem' }}>
                <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>🔒 Security Start OTP:</span>
                <strong style={{ color: 'white', fontSize: '1rem', letterSpacing: '0.1em' }}>{activeBooking.otp}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  setSelectedBookingForDetails(activeBooking);
                  setActiveTab('tracking');
                }} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                Track Booking
              </button>
              <button 
                onClick={() => {
                  setSelectedProvider(null);
                  setActiveTab('bookings');
                }} 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                My Bookings
              </button>
            </div>
          </div>
        )}

        {/* BOOKING LIVE TRACKING TAB */}
        {activeTab === 'tracking' && selectedBookingForDetails && (
          <div className="animate-fade" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
            <button className="btn btn-secondary" onClick={() => setActiveTab('bookings')} style={{ marginBottom: '1.5rem', padding: '0.5rem 0.75rem', gap: '0.25rem' }}>
              <ArrowLeft size={16} /> Back to Bookings
            </button>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
                {selectedBookingForDetails.serviceName}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--primary-light)', marginBottom: '1rem' }}>
                Partner: {selectedBookingForDetails.providerName} • Ticket {selectedBookingForDetails.id}
              </p>

              {/* Dynamic live map widget */}
              <LiveTrackingMap status={selectedBookingForDetails.status} providerName={selectedBookingForDetails.providerName} />
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Service Timeline</h3>
              
              <div className="timeline-list">
                <div className={`timeline-item done`}>
                  <div className="timeline-indicator"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Booking Placed</div>
                    <div className="timeline-time">{selectedBookingForDetails.date} • {selectedBookingForDetails.timeSlot}</div>
                  </div>
                </div>

                <div className={`timeline-item ${
                  ['accepted', 'on_the_way', 'started', 'completed'].includes(selectedBookingForDetails.status) ? 'done' : 
                  selectedBookingForDetails.status === 'requested' ? 'active' : ''
                }`}>
                  <div className="timeline-indicator"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Request Accepted by Partner</div>
                    <div className="timeline-time">
                      {['accepted', 'on_the_way', 'started', 'completed'].includes(selectedBookingForDetails.status) ? 'Approved' : 'Pending partner response'}
                    </div>
                  </div>
                </div>

                <div className={`timeline-item ${
                  ['on_the_way', 'started', 'completed'].includes(selectedBookingForDetails.status) ? 'done' : 
                  selectedBookingForDetails.status === 'accepted' ? 'active' : ''
                }`}>
                  <div className="timeline-indicator"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Provider Dispatched</div>
                    <div className="timeline-time">
                      {['on_the_way', 'started', 'completed'].includes(selectedBookingForDetails.status) ? 'On the way' : 'Awaiting partner dispatch'}
                    </div>
                  </div>
                </div>

                <div className={`timeline-item ${
                  ['started', 'completed'].includes(selectedBookingForDetails.status) ? 'done' : 
                  selectedBookingForDetails.status === 'on_the_way' ? 'active' : ''
                }`}>
                  <div className="timeline-indicator"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Job Started (OTP Verified)</div>
                    <div className="timeline-time font-mono" style={{ color: 'var(--secondary)' }}>
                      {['started', 'completed'].includes(selectedBookingForDetails.status) ? 'Started' : `Requires OTP: ${selectedBookingForDetails.otp}`}
                    </div>
                  </div>
                </div>

                <div className={`timeline-item ${selectedBookingForDetails.status === 'completed' ? 'done' : selectedBookingForDetails.status === 'started' ? 'active' : ''}`}>
                  <div className="timeline-indicator"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Completed & Rated</div>
                    <div className="timeline-time">{selectedBookingForDetails.status === 'completed' ? 'Job completed successfully' : 'Pending work'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHAT MODULE PANEL */}
        {activeTab === 'chat' && chatProvider && (
          <div className="glass-panel animate-slide-up" style={{ maxWidth: '500px', margin: '0 auto', overflow: 'hidden', border: '1px solid var(--primary-glow)' }}>
            <div className="chat-window">
              <div className="chat-header">
                <button 
                  onClick={() => setActiveTab('bookings')} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginRight: '0.25rem' }}
                >
                  <ArrowLeft size={20} />
                </button>
                <img src={chatProvider.avatar} alt={chatProvider.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flexGrow: 1, textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{chatProvider.name}</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Online</p>
                </div>
                <button 
                  onClick={() => setShowVideoCall(true)}
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem', borderRadius: '50%' }}
                >
                  <Video size={16} />
                </button>
              </div>

              <div className="chat-messages">
                {(chats[`${chatProvider.id}_customer`] || []).map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`chat-bubble ${msg.sender === 'customer' ? 'sent' : 'received'}`}
                  >
                    {msg.type === 'location' ? (
                      <a href={msg.content} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={16} /> {msg.text}
                      </a>
                    ) : msg.type === 'image' ? (
                      <div>
                        <img src={msg.content} alt="shared upload" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.25rem' }} />
                        <div>{msg.text}</div>
                      </div>
                    ) : (
                      <div>{msg.text}</div>
                    )}
                    <div className="chat-time">{msg.time}</div>
                  </div>
                ))}
                <div ref={chatMessagesEndRef} />
              </div>

              <div className="chat-input-area">
                <button 
                  onClick={sendMockImageShare}
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem', borderRadius: '8px' }}
                  title="Share board image"
                >
                  <ImageIcon size={18} />
                </button>
                <button 
                  onClick={sendMockLocationShare}
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem', borderRadius: '8px' }}
                  title="Share house location"
                >
                  <MapPin size={18} />
                </button>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Type message for provider..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                />
                <button className="btn btn-primary" onClick={handleSendChat} style={{ padding: '0.5rem' }}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Persistent Bottom Mobile-style Tab Bar */}
      {role !== 'visitor' && (
        <nav 
          className="glass-panel" 
          style={{ 
            position: 'fixed', 
            bottom: '1rem', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '90%', 
            maxWidth: '500px', 
            zIndex: 90, 
            display: 'flex', 
            justifyContent: 'space-around', 
            padding: '0.5rem',
            borderRadius: '16px',
            border: '1px solid var(--primary-glow)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <button 
            onClick={() => {
              setSelectedProvider(null);
              setActiveTab('home');
            }} 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', border: 'none', color: activeTab === 'home' ? 'var(--primary-light)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
          >
            <Search size={18} /> Home
          </button>
          
          <button 
            onClick={() => {
              setSelectedProvider(null);
              setActiveTab('bookings');
            }} 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', border: 'none', color: activeTab === 'bookings' ? 'var(--primary-light)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
          >
            <Calendar size={18} /> Bookings
          </button>
          
          <button 
            onClick={() => {
              setSelectedProvider(null);
              setActiveTab('wallet');
            }} 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', border: 'none', color: activeTab === 'wallet' ? 'var(--primary-light)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
          >
            <CreditCard size={18} /> Wallet
          </button>
          
          <button 
            onClick={() => {
              setSelectedProvider(null);
              setActiveTab('profile');
            }} 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', border: 'none', color: activeTab === 'profile' ? 'var(--primary-light)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
          >
            <User size={18} /> Profile
          </button>
        </nav>
      )}

      {/* Floating Log in prompt for Visitors */}
      {role === 'visitor' && (
        <div 
          className="glass-panel" 
          style={{ 
            position: 'fixed', 
            bottom: '1.5rem', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '90%', 
            maxWidth: '500px', 
            zIndex: 90, 
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '16px',
            border: '1px solid var(--secondary)',
            background: 'rgba(13,16,35,0.95)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>Unlock Custom Marketplace Bookings</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Login to access direct chat, SOS and live tracking.</p>
          </div>
          <button className="btn btn-primary" onClick={triggerLoginPrompt} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Login</button>
        </div>
      )}

      {/* MODAL: CUSTOMER AUTH LOGIN & REGISTRATION */}
      {showLoginModal && (
        <div className="dialog-backdrop">
          <div className="dialog-content animate-slide-up">
            <div className="dialog-header">
              <h3 className="dialog-title">
                {loginStep === 'phone' ? 'Customer Authentication' : 
                 loginStep === 'otp' ? 'Security Verification' : 'Customer Signup Profile'}
              </h3>
              <button className="dialog-close" onClick={() => setShowLoginModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="dialog-body">
              {loginStep === 'phone' && (
                <form onSubmit={handlePhoneSubmit}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    Verify your number via standard OTP protocols. Try using <strong>9876543210</strong> to login to the pre-filled account.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-muted)' }}>+91</span>
                      <input 
                        type="tel" 
                        maxLength="10"
                        className="form-control" 
                        placeholder="98765 43210" 
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                        required 
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-glow" style={{ width: '100%', marginTop: '1rem' }}>
                    Send Secure OTP
                  </button>
                </form>
              )}

              {loginStep === 'otp' && (
                <form onSubmit={handleOtpVerify}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    We sent a verification code to <strong>+91 {loginPhone}</strong>. Check your browser alert notifications.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Enter 4-Digit OTP</label>
                    <input 
                      type="text" 
                      maxLength="4"
                      className="form-control" 
                      placeholder="XXXX"
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                      style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em', fontWeight: 'bold' }}
                      required 
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button 
                      type="button" 
                      onClick={autoReadOtp}
                      className="btn btn-secondary" 
                      style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                    >
                      ⚡ Auto Read OTP
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ flex: 2 }}
                    >
                      Verify & Log In
                    </button>
                  </div>
                </form>
              )}

              {loginStep === 'register' && (
                <form onSubmit={handleRegisterSubmit}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    Create a new customer profile on ServiceHub.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Jenish Ramoliya"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="e.g. jenish@example.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={registerForm.city}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, city: e.target.value }))}
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-glow" style={{ width: '100%', marginTop: '1rem' }}>
                    Complete Registration
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOM FILTERS */}
      {showFilterModal && (
        <div className="dialog-backdrop">
          <div className="dialog-content animate-slide-up" style={{ maxWidth: '400px' }}>
            <div className="dialog-header">
              <h3 className="dialog-title">Search Filters</h3>
              <button className="dialog-close" onClick={() => setShowFilterModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="dialog-body" style={{ textAlign: 'left' }}>
              <div className="form-group">
                <label className="form-label">Minimum Professional Rating ({filterRating}★+)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="5" 
                  step="0.5"
                  className="form-control"
                  style={{ accentColor: 'var(--primary)', height: '8px', cursor: 'pointer' }}
                  value={filterRating}
                  onChange={(e) => setFilterRating(parseFloat(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <span>Any</span>
                  <span>3.0★</span>
                  <span>4.0★</span>
                  <span>5.0★</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Maximum Hourly Budget (₹{filterPrice})</label>
                <input 
                  type="range" 
                  min="100" 
                  max="1000" 
                  step="50"
                  className="form-control"
                  style={{ accentColor: 'var(--primary)', height: '8px', cursor: 'pointer' }}
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(parseInt(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <span>₹100</span>
                  <span>₹500</span>
                  <span>₹1000</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Maximum Distance Radius ({filterDistance} km)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  className="form-control"
                  style={{ accentColor: 'var(--primary)', height: '8px', cursor: 'pointer' }}
                  value={filterDistance}
                  onChange={(e) => setFilterDistance(parseInt(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <span>1 km</span>
                  <span>15 km</span>
                  <span>30 km</span>
                </div>
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={() => {
                setFilterRating(0);
                setFilterPrice(1000);
                setFilterDistance(15);
              }}>
                Reset
              </button>
              <button className="btn btn-primary" onClick={() => setShowFilterModal(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VOICE SEARCH SIMULATOR */}
      {showVoiceModal && (
        <div className="dialog-backdrop">
          <div className="dialog-content animate-slide-up" style={{ maxWidth: '380px' }}>
            <div className="dialog-header">
              <h3 className="dialog-title">Voice Search</h3>
              <button className="dialog-close" onClick={() => setShowVoiceModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="dialog-body">
              <VoiceSearchSimulator 
                onSearchSelect={(term) => setSearchQuery(term)} 
                onClose={() => setShowVoiceModal(false)} 
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DISPUTE FORM */}
      {showDisputeModal && selectedBookingForDetails && (
        <div className="dialog-backdrop">
          <div className="dialog-content animate-slide-up">
            <div className="dialog-header">
              <h3 className="dialog-title" style={{ color: 'var(--danger)' }}>Raise Marketplace Dispute</h3>
              <button className="dialog-close" onClick={() => setShowDisputeModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="dialog-body" style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Your ticket <strong>{selectedBookingForDetails.id}</strong> has been logged. Tell our support admins the issue.
              </p>
              <div className="form-group">
                <label className="form-label">Describe your dispute</label>
                <textarea 
                  rows="4" 
                  className="form-control" 
                  placeholder="Tell us what was incorrect with the work or if payment issues occurred..."
                  value={disputeText}
                  onChange={(e) => setDisputeText(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={() => setShowDisputeModal(false)}>Cancel</button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  if (!disputeText.trim()) return;
                  handleOpenDispute(selectedBookingForDetails.id, disputeText);
                  setDisputeText('');
                  setShowDisputeModal(false);
                }}
              >
                File Dispute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE VIDEO CALL SIMULATOR */}
      {showVideoCall && selectedProvider && (
        <VideoCallSimulator 
          isCaller={true}
          targetName={selectedProvider.name}
          targetAvatar={selectedProvider.avatar}
          onClose={() => setShowVideoCall(false)}
        />
      )}

    </div>
  );
}
