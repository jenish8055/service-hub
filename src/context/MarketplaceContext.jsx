import React, { createContext, useContext, useState, useEffect } from 'react';

const MarketplaceContext = createContext();

// Initial mock categories with commission percentages
const INITIAL_CATEGORIES = [
  { id: 'electrician', name: 'Electrician', icon: 'Zap', commission: 10 },
  { id: 'plumber', name: 'Plumber', icon: 'Droplet', commission: 12 },
  { id: 'carpenter', name: 'Carpenter', icon: 'Hammer', commission: 10 },
  { id: 'painter', name: 'Painter', icon: 'Paintbrush', commission: 15 },
  { id: 'cleaner', name: 'Cleaning Service', icon: 'Sparkles', commission: 8 },
  { id: 'ac-repair', name: 'AC Repair', icon: 'Wind', commission: 12 },
  { id: 'pest-control', name: 'Pest Control', icon: 'Bug', commission: 15 },
  { id: 'tutor', name: 'Home Tutor', icon: 'BookOpen', commission: 5 },
  { id: 'beauty', name: 'Beauty Service', icon: 'Scissors', commission: 18 },
  { id: 'appliance', name: 'Appliance Repair', icon: 'Wrench', commission: 10 }
];

// Initial mock providers
const INITIAL_PROVIDERS = [
  {
    id: 'prov-1',
    name: 'Rajesh Sharma',
    category: 'electrician',
    rating: 4.8,
    reviewsCount: 42,
    experience: 6,
    hourlyRate: 199,
    phone: '+91 98250 12345',
    email: 'rajesh.sharma@servicehub.com',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
    verification: 'verified',
    aadhaarFile: 'aadhaar_rajesh.jpg',
    panFile: 'pan_rajesh.jpg',
    gallery: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500'
    ],
    reviews: [
      { id: 'r1', customerName: 'Aarav Mehta', rating: 5, text: 'Very professional. Fixed short circuit issues in 10 minutes.', date: '2026-06-15' },
      { id: 'r2', customerName: 'Pooja Shah', rating: 4, text: 'Polite and efficient. Prices are reasonable.', date: '2026-06-10' }
    ]
  },
  {
    id: 'prov-2',
    name: 'Amit Patel',
    category: 'plumber',
    rating: 4.6,
    reviewsCount: 38,
    experience: 8,
    hourlyRate: 249,
    phone: '+91 94260 54321',
    email: 'amit.plumb@servicehub.com',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
    verification: 'verified',
    aadhaarFile: 'aadhaar_amit.jpg',
    panFile: 'pan_amit.jpg',
    gallery: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500'
    ],
    reviews: [
      { id: 'r3', customerName: 'Kunal Sen', rating: 5, text: 'Excellent leak repair. Highly recommended.', date: '2026-06-12' }
    ]
  },
  {
    id: 'prov-3',
    name: 'Vikram Singh',
    category: 'ac-repair',
    rating: 4.9,
    reviewsCount: 55,
    experience: 7,
    hourlyRate: 299,
    phone: '+91 97123 98765',
    email: 'vikram.ac@servicehub.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    verification: 'verified',
    aadhaarFile: 'aadhaar_vikram.jpg',
    panFile: 'pan_vikram.jpg',
    gallery: [
      'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=500'
    ],
    reviews: [
      { id: 'r4', customerName: 'Sneha Rao', rating: 5, text: 'AC is freezing cold now! Great job servicing the outdoor unit.', date: '2026-06-17' }
    ]
  },
  {
    id: 'prov-4',
    name: 'Rohan Joshi',
    category: 'carpenter',
    rating: 4.4,
    reviewsCount: 22,
    experience: 4,
    hourlyRate: 179,
    phone: '+91 99000 11223',
    email: 'rohan.wood@servicehub.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    verification: 'verified',
    aadhaarFile: 'aadhaar_rohan.jpg',
    panFile: 'pan_rohan.jpg',
    gallery: [],
    reviews: []
  },
  {
    id: 'prov-5',
    name: 'Neha Gupta',
    category: 'beauty',
    rating: 4.9,
    reviewsCount: 61,
    experience: 5,
    hourlyRate: 499,
    phone: '+91 98888 77777',
    email: 'neha.salon@servicehub.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    verification: 'verified',
    aadhaarFile: 'aadhaar_neha.jpg',
    panFile: 'pan_neha.jpg',
    gallery: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500'
    ],
    reviews: [
      { id: 'r5', customerName: 'Ritu Patel', rating: 5, text: 'Fantastic bridal package. Extremely clean and professional.', date: '2026-06-14' }
    ]
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 'SH-2947',
    customerName: 'Jenish Ramoliya',
    customerMobile: '9876543210',
    customerEmail: 'jenish@gmail.com',
    customerAddress: '404, Girdhar Nagar Heights, Ahmedabad',
    providerId: 'prov-1',
    providerName: 'Rajesh Sharma',
    serviceName: 'Full Home Wiring Checkup',
    category: 'electrician',
    date: '2026-06-20',
    timeSlot: '10:00 AM - 12:00 PM',
    notes: 'Please check the main circuit breaker, it trips frequently.',
    price: 350,
    commission: 35,
    providerEarned: 315,
    status: 'requested',
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    otp: '4839',
    timeline: [
      { status: 'requested', time: '2026-06-19 09:00 AM', label: 'Booking Requested' }
    ]
  },
  {
    id: 'SH-1102',
    customerName: 'Jenish Ramoliya',
    customerMobile: '9876543210',
    customerEmail: 'jenish@gmail.com',
    customerAddress: '404, Girdhar Nagar Heights, Ahmedabad',
    providerId: 'prov-3',
    providerName: 'Vikram Singh',
    serviceName: 'Split AC Cleaning',
    category: 'ac-repair',
    date: '2026-06-18',
    timeSlot: '02:00 PM - 04:00 PM',
    notes: 'Water leakage issue.',
    price: 299,
    commission: 35.88,
    providerEarned: 263.12,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    otp: '1102',
    timeline: [
      { status: 'requested', time: '2026-06-18 10:00 AM', label: 'Booking Requested' },
      { status: 'accepted', time: '2026-06-18 10:15 AM', label: 'Booking Accepted' },
      { status: 'on_the_way', time: '2026-06-18 01:40 PM', label: 'Provider Dispatched' },
      { status: 'started', time: '2026-06-18 02:05 PM', label: 'Job Started' },
      { status: 'completed', time: '2026-06-18 03:10 PM', label: 'Job Completed' }
    ]
  }
];

const INITIAL_TRANSACTIONS = [
  { id: 'TX-1001', type: 'credit', amount: 2000, description: 'Added money to wallet via UPI', date: '2026-06-15 12:30 PM' },
  { id: 'TX-1002', type: 'debit', amount: 299, description: 'Paid for Booking SH-1102 (AC Repair)', date: '2026-06-18 03:10 PM' }
];

const INITIAL_DISPUTES = [
  {
    id: 'DISP-401',
    bookingId: 'SH-1102',
    customerName: 'Jenish Ramoliya',
    providerName: 'Vikram Singh',
    issue: 'The AC leaks slightly again after servicing.',
    status: 'open',
    resolution: '',
    date: '2026-06-18'
  }
];

const INITIAL_BANNERS = [
  { id: 'b1', title: 'Monsoon AC Special', subtitle: 'Get flat 20% off on premium AC servicing', code: 'MONSOON20', active: true, image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800' },
  { id: 'b2', title: 'Festive Home Sparkle', subtitle: 'Deep cleaning service starting at just ₹999', code: 'SPARKLE', active: true, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800' }
];

export const MarketplaceProvider = ({ children }) => {
  // App Modes: 'visitor' | 'customer' | 'provider' | 'admin'
  const [role, setRole] = useState('visitor');
  const [currentLocation, setCurrentLocation] = useState('Girdhar Nagar, Ahmedabad');
  
  // Simulated users/sessions
  const [customerSession, setCustomerSession] = useState({
    loggedIn: false,
    name: 'Jenish Ramoliya',
    mobile: '9876543210',
    email: 'jenish@gmail.com',
    city: 'Ahmedabad'
  });

  const [providerSession, setProviderSession] = useState({
    loggedIn: false,
    id: 'prov-new', // if they register, they become prov-new or match standard
    name: '',
    category: '',
    experience: '',
    hourlyRate: 150,
    phone: '',
    email: '',
    verification: 'none', // none, pending, verified, rejected
    aadhaarFile: '',
    panFile: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    gallery: [],
    reviews: []
  });

  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [wallet, setWallet] = useState({
    balance: 1701, // 2000 - 299
    transactions: INITIAL_TRANSACTIONS
  });
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [chats, setChats] = useState({
    'prov-1_customer': [
      { id: 'c1', sender: 'provider', text: 'Hello, I will be reaching your place at 10 AM tomorrow.', time: '2026-06-19 09:30 AM' },
      { id: 'c2', sender: 'customer', text: 'Sure Rajesh, please call me when you reach the gate.', time: '2026-06-19 09:35 AM' }
    ]
  });

  // Global Alerts / Notifications
  const [notifications, setNotifications] = useState([
    { id: 'n1', text: 'Welcome to ServiceHub! Explore local top providers.', read: false, time: '1 hour ago' }
  ]);

  // Helper: Trigger broad app notification
  const addNotification = (text) => {
    setNotifications(prev => [
      { id: Date.now().toString(), text, read: false, time: 'Just now' },
      ...prev
    ]);
  };

  // Customer Actions
  const handleCustomerLogin = (mobile) => {
    setCustomerSession(prev => ({ ...prev, loggedIn: true, mobile }));
    setRole('customer');
    addNotification('Logged in successfully as Customer!');
  };

  const handleCustomerRegister = (formData) => {
    setCustomerSession({
      loggedIn: true,
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      city: formData.city
    });
    setRole('customer');
    addNotification(`Welcome to ServiceHub, ${formData.name}!`);
  };

  const handleCustomerLogout = () => {
    setCustomerSession(prev => ({ ...prev, loggedIn: false }));
    setRole('visitor');
    addNotification('Logged out successfully.');
  };

  const handleAddWalletMoney = (amount) => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    setWallet(prev => ({
      balance: prev.balance + amt,
      transactions: [
        {
          id: `TX-${Date.now().toString().slice(-4)}`,
          type: 'credit',
          amount: amt,
          description: 'Added money to wallet via Net Banking/UPI',
          date: new Date().toLocaleString()
        },
        ...prev.transactions
      ]
    }));
    addNotification(`₹${amt} added to your wallet!`);
  };

  const handleCreateBooking = (bookingDetails) => {
    // Check wallet balance if payment is wallet
    if (bookingDetails.paymentMethod === 'wallet' && wallet.balance < bookingDetails.price) {
      alert('Insufficient wallet balance. Please add money or choose pay later.');
      return false;
    }

    const newBookingId = `SH-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Find provider details
    const selectedProvider = providers.find(p => p.id === bookingDetails.providerId);
    
    // Compute commissions
    const categoryObj = categories.find(c => c.id === selectedProvider?.category);
    const commPct = categoryObj ? categoryObj.commission : 10;
    const commVal = parseFloat(((bookingDetails.price * commPct) / 100).toFixed(2));
    const earnedVal = parseFloat((bookingDetails.price - commVal).toFixed(2));

    const newBooking = {
      id: newBookingId,
      customerName: customerSession.name,
      customerMobile: customerSession.mobile,
      customerEmail: customerSession.email,
      customerAddress: bookingDetails.address,
      providerId: bookingDetails.providerId,
      providerName: bookingDetails.providerName,
      serviceName: bookingDetails.serviceName,
      category: bookingDetails.category,
      date: bookingDetails.date,
      timeSlot: bookingDetails.timeSlot,
      notes: bookingDetails.notes || 'No extra notes',
      price: bookingDetails.price,
      commission: commVal,
      providerEarned: earnedVal,
      status: 'requested',
      paymentStatus: bookingDetails.paymentMethod === 'wallet' ? 'paid' : 'pending',
      paymentMethod: bookingDetails.paymentMethod,
      otp: randomOtp,
      timeline: [
        { status: 'requested', time: new Date().toLocaleString(), label: 'Booking Requested' }
      ]
    };

    // Deduct wallet if paid
    if (bookingDetails.paymentMethod === 'wallet') {
      setWallet(prev => ({
        balance: prev.balance - bookingDetails.price,
        transactions: [
          {
            id: `TX-${Date.now().toString().slice(-4)}`,
            type: 'debit',
            amount: bookingDetails.price,
            description: `Paid for Booking ${newBookingId}`,
            date: new Date().toLocaleString()
          },
          ...prev.transactions
        ]
      }));
    }

    setBookings(prev => [newBooking, ...prev]);
    addNotification(`New booking ${newBookingId} created successfully!`);
    return newBooking;
  };

  const handleAddReview = (providerId, rating, reviewText, base64Images = []) => {
    // Add review to provider
    setProviders(prev => prev.map(p => {
      if (p.id === providerId) {
        const updatedReviews = [
          {
            id: `rev-${Date.now()}`,
            customerName: customerSession.name,
            rating: parseInt(rating),
            text: reviewText,
            images: base64Images,
            date: new Date().toISOString().split('T')[0]
          },
          ...p.reviews
        ];
        // Calculate new rating
        const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAvg = parseFloat((totalRating / updatedReviews.length).toFixed(1));

        return {
          ...p,
          reviews: updatedReviews,
          rating: newAvg,
          reviewsCount: updatedReviews.length
        };
      }
      return p;
    }));
    addNotification('Thank you! Review submitted successfully.');
  };

  const handleOpenDispute = (bookingId, issue) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const newDispute = {
      id: `DISP-${Math.floor(100 + Math.random() * 900)}`,
      bookingId,
      customerName: booking.customerName,
      providerName: booking.providerName,
      issue,
      status: 'open',
      resolution: '',
      date: new Date().toISOString().split('T')[0]
    };

    setDisputes(prev => [newDispute, ...prev]);
    addNotification(`Dispute opened for booking ${bookingId}`);
  };

  // Chat actions
  const sendChatMessage = (sessionId, sender, text, type = 'text', content = '') => {
    setChats(prev => {
      const existing = prev[sessionId] || [];
      return {
        ...prev,
        [sessionId]: [
          ...existing,
          {
            id: `msg-${Date.now()}`,
            sender,
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type,
            content
          }
        ]
      };
    });
  };

  // Provider Actions
  const handleProviderRegister = (formData) => {
    const newProvId = `prov-${Date.now()}`;
    const newProviderDetails = {
      id: newProvId,
      name: formData.name,
      category: formData.category,
      experience: parseInt(formData.experience),
      hourlyRate: parseInt(formData.charges),
      phone: formData.mobile,
      email: formData.email,
      verification: 'pending', // awaits admin verification
      aadhaarFile: formData.aadhaarName || 'aadhaar_doc.jpg',
      panFile: formData.panName || 'pan_doc.jpg',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      gallery: [],
      reviews: []
    };

    // Add to state providers list
    setProviders(prev => [...prev, newProviderDetails]);
    
    // Set active provider session
    setProviderSession({
      loggedIn: true,
      ...newProviderDetails
    });

    setRole('provider');
    addNotification('Provider registration submitted! Review is pending admin approval.');
  };

  const handleProviderLogin = (phone) => {
    // Find provider by phone
    const existing = providers.find(p => p.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, '') || p.phone.includes(phone));
    if (existing) {
      setProviderSession({
        loggedIn: true,
        ...existing
      });
      setRole('provider');
      addNotification(`Logged in as Provider: ${existing.name}`);
    } else {
      // Create a quick mock one if not existing
      const newProv = {
        loggedIn: true,
        id: 'prov-mock',
        name: 'Rajesh Sharma',
        category: 'electrician',
        experience: 5,
        hourlyRate: 199,
        phone,
        email: 'rajesh@servicehub.com',
        verification: 'verified',
        avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
        gallery: [],
        reviews: []
      };
      setProviderSession(newProv);
      setRole('provider');
      addNotification(`Logged in as Provider: ${newProv.name}`);
    }
  };

  const handleProviderLogout = () => {
    setProviderSession(prev => ({ ...prev, loggedIn: false }));
    setRole('visitor');
    addNotification('Provider logged out.');
  };

  const handleUpdateBookingStatus = (bookingId, newStatus, extraData = {}) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        // Validation check for Start Work (OTP Verification)
        if (newStatus === 'started') {
          if (extraData.otp !== booking.otp) {
            alert('Incorrect Security OTP. Please enter the code displayed on the customer app.');
            return booking;
          }
        }

        // Timeline labels mapping
        let label = '';
        switch (newStatus) {
          case 'accepted': label = 'Booking Accepted'; break;
          case 'on_the_way': label = 'Provider Dispatched'; break;
          case 'started': label = 'Job Started'; break;
          case 'completed': 
            label = 'Job Completed & QR Scanned'; 
            // Transfer funds if Cash on completion or Wallet already paid
            if (booking.paymentMethod === 'cash') {
              booking.paymentStatus = 'paid';
            }
            break;
          case 'cancelled': label = `Cancelled: ${extraData.reason || 'User cancelled'}`; break;
          default: label = `Status updated to ${newStatus}`;
        }

        const updatedTimeline = [
          ...booking.timeline,
          { status: newStatus, time: new Date().toLocaleString(), label }
        ];

        return {
          ...booking,
          status: newStatus,
          timeline: updatedTimeline,
          paymentStatus: newStatus === 'completed' ? 'paid' : booking.paymentStatus
        };
      }
      return booking;
    }));

    addNotification(`Booking ${bookingId} is now ${newStatus.toUpperCase().replace(/_/g, ' ')}`);
  };

  const handleProviderAddService = (serviceDetails) => {
    // Update provider profile hourly charges or service specs
    setProviders(prev => prev.map(p => {
      if (p.id === providerSession.id) {
        return {
          ...p,
          hourlyRate: serviceDetails.price,
          gallery: [...p.gallery, serviceDetails.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500']
        };
      }
      return p;
    }));
    // Sync session
    setProviderSession(prev => ({
      ...prev,
      hourlyRate: serviceDetails.price,
      gallery: [...prev.gallery, serviceDetails.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500']
    }));
    addNotification('Service offering updated successfully.');
  };

  // Admin Actions
  const handleVerifyProvider = (provId, action) => {
    // action: 'approved' | 'rejected'
    setProviders(prev => prev.map(p => {
      if (p.id === provId) {
        return { ...p, verification: action === 'approved' ? 'verified' : 'rejected' };
      }
      return p;
    }));

    // Sync session if matching
    if (providerSession.id === provId) {
      setProviderSession(prev => ({
        ...prev,
        verification: action === 'approved' ? 'verified' : 'rejected'
      }));
    }

    addNotification(`Provider ${provId} verification: ${action.toUpperCase()}`);
  };

  const handleBlockUser = (userId, type) => {
    // Simulating block/unblock
    addNotification(`User ${userId} (${type}) block state toggled.`);
  };

  const handleAddCategory = (newCat) => {
    setCategories(prev => [
      ...prev,
      {
        id: newCat.name.toLowerCase().replace(/\s+/g, '-'),
        name: newCat.name,
        icon: newCat.icon || 'Sparkles',
        commission: parseInt(newCat.commission) || 10
      }
    ]);
    addNotification(`New Category "${newCat.name}" added successfully.`);
  };

  const handleEditCategory = (catId, updatedFields) => {
    setCategories(prev => prev.map(c => {
      if (c.id === catId) {
        return { ...c, ...updatedFields };
      }
      return c;
    }));
    addNotification('Category updated.');
  };

  const handleDeleteCategory = (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    addNotification('Category deleted.');
  };

  const handleUpdateCommission = (catId, newComm) => {
    setCategories(prev => prev.map(c => {
      if (c.id === catId) {
        return { ...c, commission: parseFloat(newComm) };
      }
      return c;
    }));
    addNotification(`Commission updated to ${newComm}%`);
  };

  const handleResolveDispute = (dispId, resolution, refundCustomer = false) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === dispId) {
        return { ...d, status: 'resolved', resolution };
      }
      return d;
    }));

    if (refundCustomer) {
      // Find booking details
      const dispObj = disputes.find(d => d.id === dispId);
      const bookingObj = bookings.find(b => b.id === dispObj?.bookingId);
      if (bookingObj) {
        // Credit back customer wallet
        setWallet(prev => ({
          balance: prev.balance + bookingObj.price,
          transactions: [
            {
              id: `TX-${Date.now().toString().slice(-4)}`,
              type: 'credit',
              amount: bookingObj.price,
              description: `Refund issued for Booking ${bookingObj.id} via Dispute Resolution`,
              date: new Date().toLocaleString()
            },
            ...prev.transactions
          ]
        }));
        // Update booking paymentStatus
        setBookings(prev => prev.map(b => {
          if (b.id === bookingObj.id) {
            return { ...b, paymentStatus: 'refunded' };
          }
          return b;
        }));
        addNotification(`Refund of ₹${bookingObj.price} credited to Customer wallet.`);
      }
    } else {
      addNotification(`Dispute ${dispId} resolved: ${resolution}`);
    }
  };

  const handleAddBanner = (newBanner) => {
    setBanners(prev => [
      ...prev,
      {
        id: `b-${Date.now()}`,
        title: newBanner.title,
        subtitle: newBanner.subtitle,
        code: newBanner.code,
        image: newBanner.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
        active: true
      }
    ]);
    addNotification(`Banner "${newBanner.title}" scheduled.`);
  };

  const handleToggleBanner = (bannerId) => {
    setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, active: !b.active } : b));
    addNotification('Banner active status toggled.');
  };

  return (
    <MarketplaceContext.Provider value={{
      role, setRole,
      currentLocation, setCurrentLocation,
      customerSession, setCustomerSession,
      providerSession, setProviderSession,
      categories, setCategories,
      providers, setProviders,
      bookings, setBookings,
      wallet, setWallet,
      disputes, setDisputes,
      banners, setBanners,
      chats, setChats,
      notifications, setNotifications,
      addNotification,
      
      // Actions
      handleCustomerLogin,
      handleCustomerRegister,
      handleCustomerLogout,
      handleAddWalletMoney,
      handleCreateBooking,
      handleAddReview,
      handleOpenDispute,
      sendChatMessage,
      
      handleProviderRegister,
      handleProviderLogin,
      handleProviderLogout,
      handleUpdateBookingStatus,
      handleProviderAddService,
      
      handleVerifyProvider,
      handleBlockUser,
      handleAddCategory,
      handleEditCategory,
      handleDeleteCategory,
      handleUpdateCommission,
      handleResolveDispute,
      handleAddBanner,
      handleToggleBanner
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => useContext(MarketplaceContext);
