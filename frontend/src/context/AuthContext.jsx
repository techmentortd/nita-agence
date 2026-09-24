import { createContext, useContext, useState } from 'react';
import { login as loginRequest } from '../services/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('nita_admin_token'));
  const [username, setUsername] = useState(() => localStorage.getItem('nita_admin_username'));
  const [zone, setZone] = useState(() => localStorage.getItem('nita_admin_zone') || null);

  const login = async (u, p) => {
    const data = await loginRequest(u, p);
    localStorage.setItem('nita_admin_token', data.token);
    localStorage.setItem('nita_admin_username', data.username);
    if (data.zone) localStorage.setItem('nita_admin_zone', data.zone);
    else localStorage.removeItem('nita_admin_zone');
    setToken(data.token);
    setUsername(data.username);
    setZone(data.zone || null);
  };

  const updateUsername = (u) => {
    localStorage.setItem('nita_admin_username', u);
    setUsername(u);
  };

  const logout = () => {
    localStorage.removeItem('nita_admin_token');
    localStorage.removeItem('nita_admin_username');
    localStorage.removeItem('nita_admin_zone');
    setToken(null);
    setUsername(null);
    setZone(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, zone, isAuthenticated: !!token, login, logout, updateUsername }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
