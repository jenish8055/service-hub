import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function VoiceSearchSimulator({ onSearchSelect, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('Click start & speak (e.g., "Plumber", "AC Repair")');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setTranscript('Listening for service name...');
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(`Heard: "${text}"`);
        setTimeout(() => {
          onSearchSelect(text);
          onClose();
        }, 1200);
      };

      rec.onerror = (event) => {
        console.error(event.error);
        setTranscript('Could not detect speech. Try again.');
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, [onSearchSelect, onClose]);

  const startSpeechRecognition = () => {
    if (recognition) {
      try {
        recognition.start();
      } catch (err) {
        recognition.stop();
      }
    } else {
      // Simulate speech detection if API is unsupported
      setIsListening(true);
      setTranscript('Simulating speech recognition...');
      const mockPhrases = ['Electrician', 'Plumber', 'AC Repair', 'Deep Cleaning', 'Home Tutor', 'Beauty Service'];
      const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      
      setTimeout(() => {
        setTranscript(`Heard (Simulated): "${randomPhrase}"`);
        setTimeout(() => {
          onSearchSelect(randomPhrase);
          setIsListening(false);
          onClose();
        }, 1200);
      }, 2500);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognition) {
      recognition.stop();
    } else {
      setIsListening(false);
      setTranscript('Click start & speak (e.g., "Plumber", "AC Repair")');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        {transcript}
      </p>

      {isListening ? (
        <>
          <div className="voice-wave-container">
            <div className="voice-wave-bar"></div>
            <div className="voice-wave-bar"></div>
            <div className="voice-wave-bar"></div>
            <div className="voice-wave-bar"></div>
            <div className="voice-wave-bar"></div>
          </div>
          <button className="btn btn-danger" onClick={stopSpeechRecognition} style={{ marginTop: '1.5rem', borderRadius: '50%', width: '60px', height: '60px', padding: 0 }}>
            <MicOff size={24} />
          </button>
        </>
      ) : (
        <button 
          className="btn btn-primary btn-glow" 
          onClick={startSpeechRecognition} 
          style={{ 
            borderRadius: '50%', 
            width: '80px', 
            height: '80px', 
            padding: 0, 
            boxShadow: '0 0 20px var(--primary-glow)' 
          }}
        >
          <Mic size={36} className="wiggle-call" />
        </button>
      )}

      <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        {!recognition && "⚠️ Speech API not supported in this browser. Running high-fidelity simulation mode."}
      </div>
    </div>
  );
}
