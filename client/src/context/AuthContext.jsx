import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem('linkvault_token')) api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => localStorage.removeItem('linkvault_token')).finally(() => setLoading(false));
    else setLoading(false);
  }, []);
  const signIn = (data) => { localStorage.setItem('linkvault_token', data.token); setUser(data.user); };
  const signOut = () => { localStorage.removeItem('linkvault_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
