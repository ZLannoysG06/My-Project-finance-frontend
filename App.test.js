import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FinanceScreen from './FinanceScreen';
import LoginScreen from './LoginScreen';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // อัปเดตสถานะล็อกอิน
    localStorage.setItem('token', 'authenticated'); // เก็บ token หรือข้อมูลสถานะการล็อกอิน
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // รีเซ็ตสถานะล็อกอิน
    localStorage.removeItem('token'); // ลบ token ออกจาก localStorage
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <FinanceScreen onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <LoginScreen onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
