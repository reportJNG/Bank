import React, { useState, useEffect } from 'react';
import './SignIn.css';
import logo from '../Pictures/logo.png';

interface User {
  username: string;
  password: string;
  email: string;
  createdAt: string;
  banned?: boolean;
}

interface SignInProps {
  onNavigate: (page: 'signin' | 'welcome' | 'home') => void;
  onUserType: (isAdmin: boolean) => void;
}

const SignIn: React.FC<SignInProps> = ({ onNavigate, onUserType }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [newPasswordError, setNewPasswordError] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetEmailError, setResetEmailError] = useState<boolean>(false);
  const [resetStep, setResetStep] = useState<'email' | 'reset'>('email');

  // Load users from localStorage on component mount
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('authUsers');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        // Add default admin user if no users exist
        const defaultUsers = [
          { 
            username: 'Admin', 
            password: 'Admin', 
            email: 'admin@example.com',
            createdAt: new Date().toISOString(),
            banned: false
          }
        ];
        setUsers(defaultUsers);
        localStorage.setItem('authUsers', JSON.stringify(defaultUsers));
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Initialize with default admin if there's an error
      const defaultUsers = [
        { 
          username: 'Admin', 
          password: 'Admin', 
          email: 'admin@example.com',
          createdAt: new Date().toISOString(),
          banned: false
        }
      ];
      setUsers(defaultUsers);
    }
  }, []);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const isPasswordStrong = (password: string): boolean => {
    // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsLoading(true);
    
    // Reset all error states
    setUsernameError(false);
    setPasswordError(false);
    setEmailError(false);
    setShowError(false);
    
    // Clear any existing error timeout
    if (errorTimeout) {
      clearTimeout(errorTimeout);
      setErrorTimeout(null);
    }
    
    console.log('Form submitted with:', { username, password, email });

    if (isSignUp) {
      // Validate sign up fields
      let hasErrors = false;
      
      // Check username
      if (username.length < 3) {
        setUsernameError(true);
        setErrorMessage('Username must be at least 3 characters long');
        setShowError(true);
        hasErrors = true;
      } else if (users.some(user => user.username === username)) {
        setUsernameError(true);
        setErrorMessage('Username already exists');
        setShowError(true);
        hasErrors = true;
      }
      
      // Check email
      if (!isValidEmail(email)) {
        setEmailError(true);
        setErrorMessage('Please enter a valid email address');
        setShowError(true);
        hasErrors = true;
      }
      
      // Check password
      if (!isPasswordStrong(password)) {
        setPasswordError(true);
        setErrorMessage('Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number');
        setShowError(true);
        hasErrors = true;
      }
      
      if (hasErrors) {
        setIsLoading(false);
        return;
      }
      
      // Create new user
      const newUser: User = { 
        username, 
        password, 
        email,
        createdAt: new Date().toISOString(),
        banned: false
      };
      
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('authUsers', JSON.stringify(updatedUsers));
      
      setShowSuccess(true);
      setTimeout(() => {
        setIsSignUp(false);
        setShowSuccess(false);
        setUsername('');
        setPassword('');
        setEmail('');
        setIsLoading(false);
      }, 1500);
    } else {
      // Handle sign in logic
      // Special case for Admin user - provide specific feedback for incorrect credentials
      if (username === 'Admin') {
        if (password === 'Admin') {
          console.log('Admin credentials valid, navigating to welcome');
          const adminUser = users.find(u => u.username === 'Admin') || {
            username: 'Admin',
            password: 'Admin',
            email: 'admin@example.com',
            createdAt: new Date().toISOString(),
            banned: false
          };
          console.log('Admin user found or created:', adminUser);
          setCurrentUser(adminUser);
          // Store admin user in localStorage
          localStorage.setItem('currentUser', JSON.stringify(adminUser));
          console.log('Stored admin user in localStorage:', adminUser);
          setShowSuccess(true);
          
          // Set user type as admin
          onUserType(true);
          
          setTimeout(() => {
            onNavigate('welcome');
            setIsLoading(false);
          }, 1000);
        } else {
          // Admin username correct but password wrong
          
          setPasswordError(true);
          setErrorMessage('Wrong password');
          setShowError(true);
          setIsLoading(false);
          
          // Disable the button for 2 seconds when credentials are incorrect
          setIsButtonDisabled(true);
          
          // Clear error states after 3 seconds
          const timeout = setTimeout(() => {
            setPasswordError(false);
            setShowError(false);
          }, 3000);
          
          setErrorTimeout(timeout);
          
          // Re-enable the button after 2 seconds
          setTimeout(() => {
            setIsButtonDisabled(false);
          }, 2000);
        }
      } else if (password === 'Admin' && username !== 'Admin') {
        // Admin password entered but wrong username
        
        setUsernameError(true);
        
        setShowError(true);
        setIsLoading(false);
        
        // Disable the button for 2 seconds when credentials are incorrect
        setIsButtonDisabled(true);
        
        // Clear error states after 3 seconds
        const timeout = setTimeout(() => {
          setUsernameError(false);
          setShowError(false);
        }, 3000);
        
        setErrorTimeout(timeout);
        
        // Re-enable the button after 2 seconds
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, 2000);
      } else {
        // For all other users, check against the users array
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
          // Check if user is banned
          if (user.banned) {
            setShowError(true);
            setErrorMessage('Your account has been banned. Please contact support for assistance.');
            setIsLoading(false);
            
            // Disable the button for 2 seconds
            setIsButtonDisabled(true);
            
            // Clear error states after 5 seconds
            const timeout = setTimeout(() => {
              setShowError(false);
            }, 5000);
            
            setErrorTimeout(timeout);
            
            // Re-enable the button after 2 seconds
            setTimeout(() => {
              setIsButtonDisabled(false);
            }, 2000);
            
            return;
          }
          
          console.log('Credentials valid, navigating to welcome');
          console.log('User found in users array:', user);
          setCurrentUser(user);
          // Store current user in localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          console.log('Stored user in localStorage:', user);
          setShowSuccess(true);
          
          // Set user type as normal user
          onUserType(false);
          
          setTimeout(() => {
            onNavigate('welcome');
            setIsLoading(false);
          }, 1000);
        } else {
          console.log('Invalid credentials');
          
          // Determine which field is wrong
          const userExists = users.some(u => u.username === username);
          const passwordCorrect = userExists && users.find(u => u.username === username)?.password === password;
          
          if (!userExists) {
            setUsernameError(true);
          }
          if (userExists && !passwordCorrect) {
            setPasswordError(true);
          }
          
          // Set appropriate error message
          if (!userExists && !passwordCorrect) {
            setErrorMessage('Wrong username or password');
          } else if (!userExists) {
            setErrorMessage('Wrong username');
          } else if (!passwordCorrect) {
            setErrorMessage('Wrong password');
          }
          
          setShowError(true);
          setIsLoading(false);
          
          // Disable the button for 2 seconds when credentials are incorrect
          setIsButtonDisabled(true);
          
          // Clear error states after 3 seconds
          const timeout = setTimeout(() => {
            setUsernameError(false);
            setPasswordError(false);
            setShowError(false);
          }, 3000);
          
          setErrorTimeout(timeout);
          
          // Re-enable the button after 2 seconds
          setTimeout(() => {
            setIsButtonDisabled(false);
          }, 2000);
        }
      }
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
    setResetStep('email');
    setShowError(false);
    setShowSuccess(false);
    setUsernameError(false);
    setPasswordError(false);
    setEmailError(false);
    setIsButtonDisabled(false);
    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignUp(false);
    setResetStep('email');
    setShowError(false);
    setShowSuccess(false);
    setResetEmailError(false);
    setResetEmail('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleResetEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Reset error states
    setResetEmailError(false);
    setShowError(false);
    
    // Clear any existing error timeout
    if (errorTimeout) {
      clearTimeout(errorTimeout);
      setErrorTimeout(null);
    }
    
    // Validate email
    if (!isValidEmail(resetEmail)) {
      setResetEmailError(true);
      setErrorMessage('Please enter a valid email address');
      setShowError(true);
      setIsLoading(false);
      return;
    }
    
    // Check if email exists in users array
    const userWithEmail = users.find(user => user.email === resetEmail);
    
    if (!userWithEmail) {
      setResetEmailError(true);
      setErrorMessage('No account found with this email address');
      setShowError(true);
      setIsLoading(false);
      return;
    }
    
    // Email exists, proceed to reset password step
    setResetStep('reset');
    setShowSuccess(true);
    setSuccessMessage('Email verified. Please set a new password.');
    setIsLoading(false);
  };

  const handleResetPasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Reset error states
    setNewPasswordError(false);
    setConfirmPasswordError(false);
    setShowError(false);
    
    // Clear any existing error timeout
    if (errorTimeout) {
      clearTimeout(errorTimeout);
      setErrorTimeout(null);
    }
    
    // Validate new password
    if (!isPasswordStrong(newPassword)) {
      setNewPasswordError(true);
      setErrorMessage('Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number');
      setShowError(true);
      setIsLoading(false);
      return;
    }
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(true);
      setErrorMessage('Passwords do not match');
      setShowError(true);
      setIsLoading(false);
      return;
    }
    
    // Find user with the reset email
    const userIndex = users.findIndex(user => user.email === resetEmail);
    
    if (userIndex === -1) {
      setErrorMessage('User not found');
      setShowError(true);
      setIsLoading(false);
      return;
    }
    
    // Update user's password
    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword
    };
    
    setUsers(updatedUsers);
    localStorage.setItem('authUsers', JSON.stringify(updatedUsers));
    
    // Show success message
    setShowSuccess(true);
    setSuccessMessage('Password reset successful! You can now sign in with your new password.');
    
    // Reset form after delay
    setTimeout(() => {
      setIsForgotPassword(false);
      setResetStep('email');
      setShowSuccess(false);
      setResetEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setIsLoading(false);
    }, 2000);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image failed to load');
    e.currentTarget.style.display = 'none';
  };

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    };
  }, [errorTimeout]);

  return (
    <div className="signin-container">
      {showError && (
        <div className="error-notification">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}
      
      {showSuccess && (
        <div className="success-notification">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{isSignUp ? 'Registration successful!' : (isForgotPassword ? successMessage : 'Login successful!')}</span>
        </div>
      )}
      
      <div className={`container ${isSignUp ? 'signup-mode' : ''} ${isForgotPassword ? 'forgot-password-mode' : ''}`}>
        <h1 className="bank-name">Bank Al-Salam</h1>
        
        {!isForgotPassword ? (
          <form onSubmit={validateForm}>
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            {isSignUp && (
              <div className="input-container">
                <span className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={emailError ? 'error-input' : ''}
                  disabled={isLoading}
                />
              </div>
            )}
            
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || isButtonDisabled}
              className={isButtonDisabled ? 'error-button' : ''}
            >
              {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>
        ) : (
          resetStep === 'email' ? (
            <form onSubmit={handleResetEmailSubmit}>
              <div className="input-container">
                <span className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  type="email"
                  id="reset-email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className={resetEmailError ? 'error-input' : ''}
                  disabled={isLoading}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Verify Email'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPasswordSubmit}>
              <div className="input-container">
                <span className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  id="new-password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className={newPasswordError ? 'error-input' : ''}
                  disabled={isLoading}
                />
              </div>
              
              <div className="input-container">
                <span className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={confirmPasswordError ? 'error-input' : ''}
                  disabled={isLoading}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Reset Password'}
              </button>
            </form>
          )
        )}
        
        <div className="toggle-form">
          {!isForgotPassword ? (
            <>
              <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <span 
                  className="toggle-button"
                  onClick={toggleForm}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </span>
              </p>
              {!isSignUp && (
                <p className="forgot-password-link">
                  <span 
                    className="toggle-button"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </span>
                </p>
              )}
            </>
          ) : (
            <p>
              Create an new account ?
              <span 
                className="toggle-button"
                onClick={toggleForm}
              >
                Sign In
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn; 