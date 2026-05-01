import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { OnboardingFlow } from './features/onboarding';
import { api } from './services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function MainApp() {
  const [view, setView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/auth/me')
        .then((response) => {
          setIsOnboardingCompleted(response.data.onboarding_completed);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          // Clear session on ANY auth-related error to prevent stuck states
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setView('login');
        })
        .finally(() => {
          setIsLoadingUser(false);
        });
    } else {
      setIsLoadingUser(false);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setView('login');
  };

  if (isLoadingUser) {
    return (
      <div className="bg-background text-primary min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl">autorenew</span>
      </div>
    );
  }

  if (isAuthenticated) {
    if (!isOnboardingCompleted) {
      return <OnboardingFlow onComplete={() => setIsOnboardingCompleted(true)} onLogout={handleLogout} />;
    }
    return <DashboardPage onLogout={handleLogout} />;
  }

  return view === 'login'
    ? <LoginPage onSwitch={() => setView('register')} onLogin={() => setIsAuthenticated(true)} API_URL={API_URL} />
    : <RegisterPage onSwitch={() => setView('login')} API_URL={API_URL} />;
}

export default MainApp;
