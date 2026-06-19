import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Home, Compass } from 'lucide-react';

export default function LiveTrackingMap({ status, providerName }) {
  const [progress, setProgress] = useState(15);
  const [eta, setEta] = useState(12);

  useEffect(() => {
    let interval = null;
    if (status === 'on_the_way') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            setEta(0);
            return 100;
          }
          const next = prev + 5;
          // Calculate remaining minutes based on distance
          setEta(Math.max(1, Math.ceil((100 - next) * 0.15)));
          return next;
        });
      }, 1500);
    } else if (status === 'started' || status === 'completed') {
      setProgress(100);
      setEta(0);
    } else {
      setProgress(10);
      setEta(15);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  // Provider start coordinate (20, 170), Customer coordinate (260, 40)
  const startX = 30;
  const startY = 160;
  const endX = 350;
  const endY = 40;

  // Linear interpolation for current position
  const currentX = startX + (endX - startX) * (progress / 100);
  const currentY = startY + (endY - startY) * (progress / 100);

  return (
    <div className="animate-fade">
      <div className="map-canvas-simulator">
        {/* Road 1 */}
        <div className="map-road" style={{ top: '160px', left: '30px', width: '340px', transform: 'rotate(-20deg)', transformOrigin: 'top left' }}></div>
        {/* Road 2 (crossroad) */}
        <div className="map-road" style={{ top: '30px', left: '100px', width: '180px', transform: 'rotate(70deg)', transformOrigin: 'top left' }}></div>
        
        {/* Landmarks */}
        <div style={{ position: 'absolute', top: '90px', left: '40px', fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Compass size={10} /> Sector 15 Cross
        </div>
        <div style={{ position: 'absolute', top: '50px', left: '260px', fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Compass size={10} /> Market Area
        </div>

        {/* Customer Location Marker */}
        <div className="map-marker map-marker-customer" style={{ left: `${endX}px`, top: `${endY}px` }}>
          <Home size={10} color="white" />
          <div className="map-marker-ping"></div>
        </div>

        {/* Provider Location Marker */}
        <div className="map-marker map-marker-provider" style={{ left: `${currentX}px`, top: `${currentY}px` }}>
          <Navigation size={10} color="white" style={{ transform: 'rotate(45deg)' }} />
          <div className="map-marker-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {status === 'on_the_way' ? 'Provider is on the way' : 
             status === 'started' ? 'Provider is working' : 
             status === 'completed' ? 'Job completed' : 'Provider assigned'}
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {status === 'on_the_way' ? `Tracking ${providerName}` : `Status: ${status}`}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          {status === 'on_the_way' && eta > 0 ? (
            <>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-light)' }}>{eta} mins</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Arrival</div>
            </>
          ) : status === 'started' ? (
            <div className="badge badge-info">IN PROGRESS</div>
          ) : status === 'completed' ? (
            <div className="badge badge-success">ARRIVED & DONE</div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Awaiting Dispatch</div>
          )}
        </div>
      </div>
    </div>
  );
}
