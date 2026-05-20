import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginWithEmailAndPassword } from '../../services/firebase';
import { useAuth } from './ProtectedRoute';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect to original page or fallback to dashboard if already logged in
  const from = (location.state as any)?.from?.pathname || "/admin";
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginWithEmailAndPassword(email, password);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  const isMockMode = !import.meta.env.VITE_FIREBASE_API_KEY;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      position: 'relative',
      padding: '24px',
      overflow: 'hidden'
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(163,207,207,0.15) 0%, rgba(249,249,249,0) 70%)',
        zIndex: -1,
        borderRadius: '50%'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--outline-variant)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 32px 64px -16px rgba(0, 28, 29, 0.12)',
        zIndex: 1
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="gold-text" style={{ fontSize: '28px', marginBottom: '8px', letterSpacing: '0.05em' }}>LFTO Admin</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
            Enter your credentials to access the admin portal.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            backgroundColor: 'rgba(186, 26, 26, 0.08)',
            border: '1px solid rgba(186, 26, 26, 0.25)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '24px',
            color: 'var(--error)',
            fontSize: '13px',
            lineHeight: '1.4'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--on-surface-variant)',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                required
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  fontSize: '14px',
                  borderRadius: '12px',
                  border: '1px solid var(--outline-variant)',
                  backgroundColor: 'var(--surface-container-lowest)',
                  color: 'var(--on-surface)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: "'Inter', sans-serif"
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--outline-variant)'}
              />
              <Mail size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--outline)'
              }} />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--on-surface-variant)',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 44px',
                  fontSize: '14px',
                  borderRadius: '12px',
                  border: '1px solid var(--outline-variant)',
                  backgroundColor: 'var(--surface-container-lowest)',
                  color: 'var(--on-surface)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: "'Inter', sans-serif"
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--outline-variant)'}
              />
              <Lock size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--outline)'
              }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--outline)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="lfto-btn lfto-btn-primary"
            style={{
              padding: '14px',
              fontSize: '14px',
              borderRadius: '12px',
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                Signing In...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        {/* Mock Mode Reminder Box */}
        {isMockMode && (
          <div style={{
            marginTop: '32px',
            backgroundColor: 'var(--surface-container-low)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px dashed var(--outline-variant)',
            fontSize: '12px',
            color: 'var(--on-surface-variant)',
            lineHeight: '1.5',
            fontFamily: "'Inter', sans-serif"
          }}>
            <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🔧 Local Mock Mode Active
            </div>
            Use the offline simulated credentials to log in:
            <div style={{ marginTop: '8px', fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.03)', padding: '6px 8px', borderRadius: '6px' }}>
              Email: <strong>admin@lfto.com</strong><br />
              Pass: <strong>admin123</strong>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
