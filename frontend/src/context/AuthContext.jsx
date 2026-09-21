import { createContext, useContext, useState } from 'react';
import { login as loginRequest } from '../services/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('nita_admin_token'));
  const [username, setUsername] = useState(() => localStorage.getItem('nita_admin_username'));

  const login = async (u, p) => {
    const data = await loginRequest(u, p);
    localStorage.setItem('nita_admin_token', data.token);
    localStorage.setItem('nita_admin_username', data.username);
    setToken(data.token);
    setUsername(data.username);
  };

  const logout = () => {
    localStorage.removeItem('nita_admin_token');
    localStorage.removeItem('nita_admin_username');
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
