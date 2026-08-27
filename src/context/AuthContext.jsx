import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_CHECK_INTERVAL_MS = 5 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const inactivityTimer = useRef(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(async () => {
      console.warn('[Security] Auto-logout: inactivity timeout exceeded.');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    }, INACTIVITY_TIMEOUT_MS);
  }, []);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

    const handleActivity = () => {
      if (user) resetInactivityTimer();
    };

    EVENTS.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));
    if (user) resetInactivityTimer();

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, handleActivity));
      clearInactivityTimer();
    };
  }, [user, resetInactivityTimer, clearInactivityTimer]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error || !currentSession) {
          setUser(null);
          setSession(null);
        } else {
          setUser(currentSession.user);
          setSession(currentSession);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error || !currentSession) {
        console.warn('[Security] Session expired — signing out.');
        setUser(null);
        setSession(null);
      } else {
        await supabase.auth.refreshSession();
      }
    }, SESSION_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (err) {
        console.warn('[Auth] Session retrieval error:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      const safeEmail    = String(email).trim().toLowerCase().slice(0, 254);
      const safePassword = String(password).slice(0, 128);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: safeEmail,
        password: safePassword,
      });

      if (error) throw error;

      setUser(data.user);
      setSession(data.session);
      resetInactivityTimer();
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid email or password' };
    }
  };

  const signOut = async () => {
    clearInactivityTimer();
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      return { success: true };
    } catch (error) {
      console.error('[Auth] Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
