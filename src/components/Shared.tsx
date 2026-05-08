import React, { useState } from 'react';
import { joinWaitlist } from '../services/firebase';
import { subscribeToWaitlist } from '../services/klaviyo';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button className="lfto-btn lfto-btn-primary" {...props}>
    {children}
  </button>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input className="lfto-input" {...props} />
);

export const WaitlistForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !agreed) return;

    setStatus('loading');
    
    // Send to both services simultaneously
    const sourceStr = window.location.pathname === '/waitlist' ? 'Inner Circle Page' : 'Homepage';
    
    const [firebaseResult] = await Promise.all([
      joinWaitlist({ 
        fullName: fullName.trim(),
        email: email.trim(), 
        source: sourceStr 
      }),
      subscribeToWaitlist({
        fullName: fullName.trim(),
        email: email.trim(),
        source: sourceStr
      })
    ]);

    // We consider it a success if either service succeeds, but ideally both do.
    // For now, if Firebase succeeds, we show success.
    if (firebaseResult.success) {
      setStatus('success');
      setErrorMessage('');
    } else {
      setStatus('error');
      setErrorMessage(firebaseResult.message);
      // Reset error after 3 seconds so they can try again
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 3000);
    }
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <p className="body-lg" style={{ color: 'var(--primary)' }}>Thank you. You are on the waitlist for BATCH 001.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px', margin: '0 auto' }}>
      <Input
        type="text"
        placeholder="ENTER FULL NAME"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        disabled={status === 'loading'}
      />
      <Input
        type="email"
        placeholder="ENTER EMAIL ADDRESS"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === 'loading'}
      />
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', textAlign: 'left' }}>
        <input 
          type="checkbox" 
          id="terms" 
          checked={agreed} 
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ marginTop: '6px', cursor: 'pointer' }}
          required
        />
        <label htmlFor="terms" className="body-md" style={{ color: 'var(--on-surface-variant)', fontSize: '12px', lineHeight: '1.4', cursor: 'pointer' }}>
          I agree to the Batch 001 terms and conditions and want to join the Inner Circle waitlist.
        </label>
      </div>

      <Button type="submit" disabled={status === 'loading' || !agreed || !fullName.trim() || !email.trim()}>
        {status === 'loading' ? 'SUBMITTING...' : 'Join the Waitlist'}
      </Button>
      {status === 'error' && (
        <p className="body-md" style={{ color: '#ba1a1a', textAlign: 'center', marginTop: '8px' }}>
          {errorMessage || 'Something went wrong. Please try again.'}
        </p>
      )}
    </form>
  );
};
