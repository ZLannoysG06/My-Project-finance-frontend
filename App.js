import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // เพิ่ม Routes และ Route
import LoginScreen from './LoginScreen';
import FinanceScreen from './FinanceScreen';
import AccountSettings from './AccountSettings'; 
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<FinanceScreen onLogout={handleLogout} />} />
            <Route path="/account-settings" element={<AccountSettings />} /> {/* Route ใหม่ */}
          </Routes>
        ) : (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;