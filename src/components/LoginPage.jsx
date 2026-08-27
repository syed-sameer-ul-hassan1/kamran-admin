import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

const LOCK_START_ATTEMPT = 4;
const LOCK_BASE_SECONDS  = 30;

export default function LoginPage() {
  const { signIn } = useAuth();

  const [step, setStep] = useState('email');

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [attempts, setAttempts]     = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [countdown, setCountdown]   = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!lockedUntil) return;
    timerRef.current = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setLockedUntil(null);
        setAttempts(0);
        setCountdown(0);
        setErrorMessage('');
      } else {
        setCountdown(remaining);
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [lockedUntil]);

  const handleEmailNext = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmed,
        password: '__PROBE__',
      });

      if (!error || error.message.toLowerCase().includes('invalid login credentials')) {
        setStep('password');
      } else {
        setStep('blocked');
      }
    } catch {
      setStep('blocked');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (lockedUntil && Date.now() < lockedUntil) return;
    if (!password) return;

    setIsSubmitting(true);
    const res = await signIn(email.trim().toLowerCase(), password);
    setIsSubmitting(false);

    if (!res.success) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts < LOCK_START_ATTEMPT) {
        const left = LOCK_START_ATTEMPT - newAttempts;
        setErrorMessage(
          `Incorrect email or password. Retry. (${left} free attempt${left === 1 ? '' : 's'} left before lockout)`
        );
      } else {
        const lockSeconds = LOCK_BASE_SECONDS * Math.pow(2, newAttempts - LOCK_START_ATTEMPT);
        const unlockAt = new Date(Date.now() + lockSeconds * 1000);
        setLockedUntil(unlockAt);
        setCountdown(lockSeconds);
        const mins = Math.floor(lockSeconds / 60);
        const secs = lockSeconds % 60;
        const timeStr = mins > 0 ? `${mins}m ${secs > 0 ? secs + 's' : ''}`.trim() : `${secs}s`;
        setErrorMessage(`Incorrect email or password. Wait ${timeStr} before retrying.`);
      }
      setPassword('');
    }
  };

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  if (step === 'blocked') {
    return (
      <div className="login-page-wrap">
        <div className="login-backdrop-glow" />
        <div className="login-card-container login-card-center">
          <div className="login-blocked-icon">✕</div>
          <p className="login-blocked-msg">You are not allowed to log in.</p>
          <button
            type="button"
            className="login-back-btn"
            onClick={() => { setStep('email'); setEmail(''); setErrorMessage(''); }}
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  if (step === 'password') {
    return (
      <div className="login-page-wrap">
        <div className="login-backdrop-glow" />
        <div className="login-card-container">
          <p className="login-step-title">Enter your password</p>

          <form onSubmit={handlePasswordSubmit} className="login-form">
            {errorMessage && (
              <div className="login-error-alert" role="alert">
                <span style={{ flexShrink: 0 }}>⚠️</span>
                <span>
                  {errorMessage}
                  {isLocked && countdown > 0 && (
                    <strong> ({countdown}s)</strong>
                  )}
                </span>
              </div>
            )}

            <div className="login-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label htmlFor="admin-password" style={{ margin: 0 }}>Password</label>
                <button
                  type="button"
                  className="login-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="login-input-wrap">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting || isLocked}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLocked || !password}
              className="btn btn-primary login-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="scm-spinner" />
                  <span>Signing In…</span>
                </>
              ) : isLocked ? (
                <span>Locked — wait {countdown}s</span>
              ) : (
                <span>Sign In →</span>
              )}
            </button>

            <button
              type="button"
              className="login-back-btn"
              onClick={() => { setStep('email'); setPassword(''); setErrorMessage(''); setAttempts(0); setLockedUntil(null); setCountdown(0); }}
            >
              ←  Back to Email
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page-wrap">
      <div className="login-backdrop-glow" />
      <div className="login-card-container">
        <p className="login-step-title">Welcome back</p>

        <form onSubmit={handleEmailNext} className="login-form">
          {errorMessage && (
            <div className="login-error-alert" role="alert">
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="login-field-group">
            <label htmlFor="admin-email">Email</label>
            <div className="login-input-wrap">
              <input
                id="admin-email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="btn btn-primary login-submit-btn"
          >
            {isSubmitting ? (
              <>
                <span className="scm-spinner" />
                <span>Checking…</span>
              </>
            ) : (
              <span>Next →</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
