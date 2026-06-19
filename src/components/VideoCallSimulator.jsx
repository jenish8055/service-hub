import React, { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Camera } from 'lucide-react';

export default function VideoCallSimulator({ isCaller, targetName, targetAvatar, onClose }) {
  const [callState, setCallState] = useState('ringing'); // ringing, connected, disconnected
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Ring for 3 seconds then connect
    const ringTimeout = setTimeout(() => {
      setCallState('connected');
    }, 3000);

    // Request camera access for picture-in-picture overlay
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          streamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn('Webcam stream request declined or unavailable: ', err);
        });
    }

    return () => {
      clearTimeout(ringTimeout);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Duration timer
  useEffect(() => {
    let timer = null;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callState]);

  const handleHangUp = () => {
    setCallState('disconnected');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="dialog-backdrop" style={{ background: '#02030a', zIndex: 1100 }}>
      <div 
        className="glass-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '650px', 
          height: '85vh', 
          maxHeight: '700px', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden', 
          position: 'relative',
          background: '#080a1c',
          border: '1px solid var(--primary-glow)'
        }}
      >
        {/* Call status / Name overlay */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '20px', 
            zIndex: 10, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            background: 'rgba(0,0,0,0.5)', 
            padding: '0.5rem 1rem', 
            borderRadius: '12px',
            backdropFilter: 'blur(8px)' 
          }}
        >
          <img 
            src={targetAvatar} 
            alt={targetName} 
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
          />
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{targetName}</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              {callState === 'ringing' ? 'Calling...' : `Connected • ${formatDuration(callDuration)}`}
            </p>
          </div>
        </div>

        {/* Remote Video Stream (Static visual mock of the other person) */}
        <div style={{ flexGrow: 1, position: 'relative', background: '#030408', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={targetAvatar} 
            alt="Remote View" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              filter: callState === 'ringing' ? 'blur(10px) brightness(0.6)' : 'none',
              transition: 'filter 1s ease'
            }} 
          />
          
          {callState === 'ringing' && (
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div 
                className="wiggle-call" 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white',
                  boxShadow: '0 0 30px var(--primary-glow)' 
                }}
              >
                <Video size={40} style={{ margin: 'auto' }} />
              </div>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', letterSpacing: '0.05em' }}>CONNECTING LINE...</p>
            </div>
          )}
        </div>

        {/* Local Video Stream (Webcam or self-avatar) */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '100px', 
            right: '20px', 
            width: '120px', 
            height: '170px', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            border: '2px solid white', 
            boxShadow: 'var(--shadow-md)',
            background: '#1e293b',
            zIndex: 10
          }}
        >
          {isVideoOff ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0c16' }}>
              <VideoOff size={24} color="var(--text-muted)" />
            </div>
          ) : (
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />
          )}
        </div>

        {/* Call Action Bar */}
        <div 
          style={{ 
            height: '85px', 
            background: 'rgba(13, 16, 35, 0.95)', 
            borderTop: '1px solid var(--border-light)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '1.5rem',
            paddingBottom: '10px'
          }}
        >
          {/* Audio toggle */}
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="btn" 
            style={{ 
              borderRadius: '50%', 
              width: '46px', 
              height: '46px', 
              padding: 0, 
              background: isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.06)',
              color: isMuted ? '#f87171' : 'white',
              border: isMuted ? '1px solid var(--danger)' : '1px solid var(--border-light)' 
            }}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Hang Up Button */}
          <button 
            onClick={handleHangUp} 
            className="btn btn-danger" 
            style={{ 
              borderRadius: '50%', 
              width: '56px', 
              height: '56px', 
              padding: 0,
              background: 'var(--danger)',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' 
            }}
          >
            <PhoneOff size={24} color="white" />
          </button>

          {/* Video Toggle */}
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)} 
            className="btn" 
            style={{ 
              borderRadius: '50%', 
              width: '46px', 
              height: '46px', 
              padding: 0, 
              background: isVideoOff ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.06)',
              color: isVideoOff ? '#f87171' : 'white',
              border: isVideoOff ? '1px solid var(--danger)' : '1px solid var(--border-light)'
            }}
          >
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
