import React, { useState, useEffect } from 'react';
import SignIn from './components/SignIn';
import Welcome from './components/Welcome';
import Home from './components/Home';
import HomeUser from './components/homeUser';
import Discover from './components/Discover';
import Reports from './components/Reports';
import Services from './components/Services';
import ClientMsg from './components/ClientMsg';
import './index.css';

interface User {
  username: string;
  password: string;
  email: string;
  createdAt: string;
  banned?: boolean;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'signin' | 'welcome' | 'home' | 'discover' | 'reports' | 'services' | 'clientmsg'>('signin');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load current user from localStorage on component mount
  useEffect(() => {
    try {
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const user = JSON.parse(currentUserStr);
        console.log('App component loaded current user from localStorage:', user);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  }, []);

  const handleNavigation = (page: 'signin' | 'welcome' | 'home' | 'discover' | 'reports' | 'services' | 'clientmsg') => {
    console.log('Navigation requested to:', page);
    setCurrentPage(page);
    console.log('Current page updated to:', page);
    
    // Update currentUser from localStorage when navigating to home page
    if (page === 'home') {
      try {
        const currentUserStr = localStorage.getItem('currentUser');
        if (currentUserStr) {
          const user = JSON.parse(currentUserStr);
          setCurrentUser(user);
          console.log('Current user updated from localStorage:', user);
        }
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    }
  };

  // Function to set admin status when user logs in
  const handleUserType = (isAdminUser: boolean) => {
    setIsAdmin(isAdminUser);
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {currentPage === 'signin' && <SignIn onNavigate={handleNavigation} onUserType={handleUserType} />}
      {currentPage === 'welcome' && <Welcome onNavigate={handleNavigation} />}
      {currentPage === 'home' && (isAdmin ? <Home onNavigate={handleNavigation} isAdmin={isAdmin} /> : <HomeUser onNavigate={handleNavigation} currentUser={currentUser} />)}
      {currentPage === 'discover' && <Discover onNavigate={handleNavigation} />}
      {currentPage === 'reports' && <Reports onNavigate={handleNavigation} />}
      {currentPage === 'services' && <Services onNavigate={handleNavigation} />}
      {currentPage === 'clientmsg' && <ClientMsg onNavigate={handleNavigation} currentUser={currentUser} />}
    </div>
  );
};

export default App;
