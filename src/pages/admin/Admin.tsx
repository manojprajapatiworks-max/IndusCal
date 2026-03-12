import { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  return isAuthenticated ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
