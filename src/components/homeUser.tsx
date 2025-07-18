import React, { useState, useRef, useEffect, FC } from 'react';
import styles from './homeUser.module.css';
import { IconType } from 'react-icons';
import { FaMoneyBillWave, FaPiggyBank, FaExchangeAlt, FaFileInvoiceDollar, FaHeadset, FaChartLine, FaCreditCard, FaWallet, FaUniversity, FaShieldAlt } from 'react-icons/fa';

interface HomeUserProps {
  onNavigate?: (page: 'signin' | 'welcome' | 'home' | 'discover' | 'reports' | 'services') => void;
  currentUser?: {
    username: string;
    password: string;
    email: string;
    createdAt: string;
  } | null;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface User {
  username: string;
  password: string;
  email: string;
  createdAt: string;
}

interface Message {
  id: string;
  date: string;
  problem: string;
  description: string;
  status: 'pending' | 'resolved' | 'in-progress' | 'rejected';
  response?: {
    text: string;
    timestamp: string;
    adminName: string;
  };
  rejectionReason?: string;
}

// Add chatbot message interface
interface ChatMessage {
  text: string;
  isUser: boolean;
}

// Add predefined questions and responses
const predefinedQuestions = [
  "How can I text the center?",
  "How can I buy a new card?",
  "How can I use this service?",
  "What if My messege get rejected?",
  "How can I send a good messege to staff?",
  "How I can use my visa card? and where I can use it?"
];

const botResponses: { [key: string]: string } = {
  "How can I text the center?": "You can contact our support center through multiple channels:\n1. Use this chat interface\n2. Call our 24/7 helpline at 1-800-XXX-XXXX\n3. Send an email to support@bank.com\n4. Visit any of our branch locations\n\nOur support team is available 24/7 to assist you with any queries.",
  
  "How can I buy a new card?": "To get a new card, follow these steps:\n1. Log in to your account\n2. Go to 'Card Services'\n3. Select 'Request New Card'\n4. Choose your card type (Debit/Credit)\n5. Complete the verification process\n\nYour new card will be delivered within 5-7 business days.",
  
  "How can I use this service?": "Our banking service offers various features:\n1. Account Management\n2. Money Transfers\n3. Bill Payments\n4. Card Services\n5. Investment Options\n\nTo get started, simply navigate through the menu options or use the search feature to find specific services.",
  
  "What if My messege get rejected?": "If your message is rejected, here's what you can do:\n1. Check the rejection reason provided\n2. Ensure all required information is included\n3. Verify your account status\n4. Contact support if you need clarification\n5. You can always submit a new message with corrections",
  
  "How can I send a good messege to staff?": "To send an effective message to our staff:\n1. Be clear and specific about your issue\n2. Include relevant account details\n3. Provide any reference numbers\n4. Explain what you've already tried\n5. Be polite and professional\n\nThis helps us assist you more efficiently!",
  
  "How I can use my visa card? and where I can use it?": "Your Visa card can be used:\n1. Online shopping worldwide\n2. In-store purchases globally\n3. ATM withdrawals\n4. Contactless payments\n5. International transactions\n\nFor security, always:\n- Keep your PIN confidential\n- Enable transaction alerts\n- Monitor your statements\n- Report any suspicious activity"
};

const HomeUser: FC<HomeUserProps> = ({ onNavigate, currentUser: propCurrentUser }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'form' | 'profile' | 'inbox'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [formData, setFormData] = useState({
    date: '',
    problem: '',
    description: ''
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPasswordErrors, setResetPasswordErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    message: string;
  }>({ score: 0, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successTimeout, setSuccessTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Add state for editing message
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  
  // Add state for delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  
  // Add refs for scroll reveal
  const featuresTitleRef = useRef<HTMLHeadingElement>(null);
  const featuresSubtitleRef = useRef<HTMLParagraphElement>(null);
  const featureCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Add ref for the spinning card
  const spinningCardRef = useRef<HTMLDivElement>(null);

  // Add state for active dropdown cards
  const [activeDropdowns, setActiveDropdowns] = useState<number[]>([]);

  // Add chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { text: "Hi! How can we help you today?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown for a specific card
  const toggleDropdown = (index: number) => {
    setActiveDropdowns(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // Fetch current user from localStorage on component mount or when prop changes
  useEffect(() => {
    const fetchCurrentUser = () => {
      try {
        // First check if we have a prop
        if (propCurrentUser) {
          console.log('Using prop current user:', propCurrentUser);
          setCurrentUser(propCurrentUser);
          setUserInfo({
            name: propCurrentUser.username || '',
            email: propCurrentUser.email || '',
            phone: '', // These fields might not exist in the user object
            address: ''
          });
          return;
        }
        
        // If no prop, try to get from localStorage
        const currentUserStr = localStorage.getItem('currentUser');
        if (currentUserStr) {
          const user = JSON.parse(currentUserStr);
          console.log('Using localStorage current user:', user);
          setCurrentUser(user);
          
          // Set user info from the current user
          setUserInfo({
            name: user.username || '',
            email: user.email || '',
            phone: '', // These fields might not exist in the user object
            address: ''
          });
        } else {
          console.log('No current user found in localStorage');
          // If no user found, redirect to signin
          if (onNavigate) {
            onNavigate('signin');
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        // If there's an error, redirect to signin
        if (onNavigate) {
          onNavigate('signin');
        }
      }
    };

    fetchCurrentUser();
  }, [propCurrentUser, onNavigate]);

  // Add useEffect to load messages from localStorage
  useEffect(() => {
    if (currentUser) {
      const userMessages = localStorage.getItem(`messages_${currentUser.username}`);
      if (userMessages) {
        try {
          const parsedMessages = JSON.parse(userMessages);
          setMessages(parsedMessages);
        } catch (error) {
          console.error('Error parsing messages from localStorage:', error);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    }
  }, [currentUser]);

  // Add effect for card movement
  useEffect(() => {
    const card = spinningCardRef.current;
    if (!card) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate rotation based on mouse position
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 10;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -10;
      
      // Apply the rotation
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    const handleMouseLeave = () => {
      // Reset the card position when mouse leaves
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Add intersection observer for scroll reveal
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, observerOptions);

    // Observe title and subtitle
    if (featuresTitleRef.current) {
      observer.observe(featuresTitleRef.current);
    }
    
    if (featuresSubtitleRef.current) {
      observer.observe(featuresSubtitleRef.current);
    }
    
    // Observe feature cards
    featureCardsRef.current.forEach(card => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [activeTab]); // Re-run when activeTab changes to handle tab switching

  // Load messages from localStorage when component mounts or user changes
  useEffect(() => {
    if (currentUser?.username) {
      const savedMessages = localStorage.getItem(`messages_${currentUser.username}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, [currentUser?.username]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (currentUser?.username && messages.length > 0) {
      localStorage.setItem(`messages_${currentUser.username}`, JSON.stringify(messages));
    }
  }, [messages, currentUser?.username]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add function to delete a message
  const handleDeleteMessage = (messageId: string) => {
    // Show confirmation dialog
    setMessageToDelete(messageId);
    setShowDeleteConfirmation(true);
  };

  // Add function to confirm deletion
  const confirmDelete = () => {
    if (messageToDelete && currentUser) {
      // Filter out the message with the matching ID
      const updatedMessages = messages.filter(message => message.id !== messageToDelete);
      setMessages(updatedMessages);
      
      // Update localStorage with the filtered messages
      localStorage.setItem(`messages_${currentUser.username}`, JSON.stringify(updatedMessages));
      
      // Show success notification
      setSuccessMessage('Message deleted successfully!');
      setShowSuccess(true);
      
      // Clear success message after 3 seconds
      if (successTimeout) {
        clearTimeout(successTimeout);
      }
      
      const timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      setSuccessTimeout(timeout);
      
      // Close confirmation dialog
      setShowDeleteConfirmation(false);
      setMessageToDelete(null);
    }
  };

  // Add function to start editing a message
  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setFormData({
      date: message.date,
      problem: message.problem,
      description: message.description
    });
    setActiveTab('form');
  };

  // Add function to show notifications
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setSuccessMessage(message);
    setShowSuccess(true);
    
    // Clear success message after 3 seconds
    if (successTimeout) {
      clearTimeout(successTimeout);
    }
    
    const timeout = setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
    
    setSuccessTimeout(timeout);
  };

  // Add function to cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setMessageToDelete(null);
  };

  // Modify handleFormSubmit to handle both new messages and edits
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      showNotification('Please log in to send messages', 'error');
      return;
    }

    if (editingMessage) {
      // Update existing message
      const updatedMessages = messages.map(msg => {
        if (msg.id === editingMessage.id) {
          return {
            ...msg,
            date: formData.date,
            problem: formData.problem,
            description: formData.description,
            status: 'pending' as const, // Reset status to pending when edited
            response: undefined // Clear the response when editing
          };
        }
        return msg;
      });
      setMessages(updatedMessages);
      localStorage.setItem(`messages_${currentUser.username}`, JSON.stringify(updatedMessages));
      setEditingMessage(null);
      showNotification('Message updated successfully!');
      
      // Navigate back to messages after a short delay
      setTimeout(() => {
        setActiveTab('inbox');
      }, 1000);
    } else {
      // Create new message
      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        problem: formData.problem,
        description: formData.description,
        status: 'pending'
      };

      // Get existing messages for current user
      const userMessages = localStorage.getItem(`messages_${currentUser.username}`);
      let messages: Message[] = [];
      
      if (userMessages) {
        try {
          messages = JSON.parse(userMessages);
        } catch (error) {
          console.error('Error parsing existing messages:', error);
          messages = [];
        }
      }

      // Add new message
      messages.push(newMessage);

      // Save updated messages
      try {
        localStorage.setItem(`messages_${currentUser.username}`, JSON.stringify(messages));
        console.log('Messages saved successfully:', messages);
        
        // Update state
        setMessages(messages);
        
        // Reset form
        setFormData({
          date: new Date().toISOString(),
          problem: '',
          description: ''
        });
        
        // Show success message
        showNotification('Message sent successfully!');
        
        // Navigate back to messages after a short delay
        setTimeout(() => {
          setActiveTab('inbox');
        }, 1000);
      } catch (error) {
        console.error('Error saving messages:', error);
        showNotification('Error sending message. Please try again.', 'error');
      }
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = () => {
    // Show password verification modal instead of saving directly
    setShowPasswordModal(true);
    setPassword('');
    setPasswordError('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentUser) {
      // Verify password
      if (password === currentUser.password) {
        // Password is correct, proceed with saving
        const updatedUser = {
          ...currentUser,
          username: userInfo.name,
          email: userInfo.email
        };
        
        // Update in localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update in users array
        try {
          const usersStr = localStorage.getItem('users');
          if (usersStr) {
            const users = JSON.parse(usersStr);
            const updatedUsers = users.map((user: User) => 
              user.username === currentUser.username ? updatedUser : user
            );
            localStorage.setItem('users', JSON.stringify(updatedUsers));
          }
        } catch (error) {
          console.error('Error updating user in users array:', error);
        }
        
        // Close modal and show success message
        setShowPasswordModal(false);
        
        // Show success notification
        setSuccessMessage('Profile updated successfully!');
        setShowSuccess(true);
        
        // Clear success message after 3 seconds
        if (successTimeout) {
          clearTimeout(successTimeout);
        }
        
        const timeout = setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
        
        setSuccessTimeout(timeout);
      } else {
        // Password is incorrect
        setPasswordError('Incorrect password. Please try again.');
      }
    }
  };

  const handleResetPassword = () => {
    setShowResetPasswordModal(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setResetPasswordErrors({});
    setPasswordStrength({ score: 0, message: '' });
  };

  const checkPasswordStrength = (password: string) => {
    // Password strength criteria
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Calculate strength score (0-4)
    let score = 0;
    if (hasMinLength) score++;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumbers) score++;
    if (hasSpecialChar) score++;
    
    // Determine strength message
    let message = '';
    if (score === 0) message = 'Very Weak';
    else if (score === 1) message = 'Weak';
    else if (score === 2) message = 'Fair';
    else if (score === 3) message = 'Good';
    else if (score === 4) message = 'Strong';
    else if (score === 5) message = 'Very Strong';
    
    return { score, message };
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    
    // Check password strength
    if (newPass) {
      setPasswordStrength(checkPasswordStrength(newPass));
    } else {
      setPasswordStrength({ score: 0, message: '' });
    }
    
    // Clear error if user is typing
    if (resetPasswordErrors.newPassword) {
      setResetPasswordErrors(prev => ({ ...prev, newPassword: undefined }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    
    // Clear error if user is typing
    if (resetPasswordErrors.confirmPassword) {
      setResetPasswordErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
    
    // Clear error if user is typing
    if (resetPasswordErrors.oldPassword) {
      setResetPasswordErrors(prev => ({ ...prev, oldPassword: undefined }));
    }
  };

  const validateResetPassword = () => {
    const errors: {
      oldPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};
    
    // Validate old password
    if (!oldPassword) {
      errors.oldPassword = 'Current password is required';
    } else if (currentUser && oldPassword !== currentUser.password) {
      errors.oldPassword = 'Current password is incorrect';
    }
    
    // Validate new password
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordStrength.score < 3) {
      errors.newPassword = 'Password is not strong enough';
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setResetPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateResetPassword() && currentUser) {
      // Update password in localStorage
      const updatedUser = {
        ...currentUser,
        password: newPassword
      };
      
      // Update in localStorage - this ensures the current session uses the new password
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in users array - this ensures the user can log in with the new password next time
      try {
        const usersStr = localStorage.getItem('users');
        if (usersStr) {
          const users = JSON.parse(usersStr);
          const updatedUsers = users.map((user: User) => 
            user.username === currentUser.username ? updatedUser : user
          );
          localStorage.setItem('users', JSON.stringify(updatedUsers));
        }
      } catch (error) {
        console.error('Error updating user in users array:', error);
      }
      
      // Close modal and show success message
      setShowResetPasswordModal(false);
      
      // Show success notification
      setSuccessMessage('Password updated successfully !');
      setShowSuccess(true);
      
      // Clear success message after 3 seconds
      if (successTimeout) {
        clearTimeout(successTimeout);
      }
      
      const timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      setSuccessTimeout(timeout);
    }
  };

  const handleLogout = () => {
    // Clear current user from localStorage
    localStorage.removeItem('currentUser');
    // Navigate to signin page
    if (onNavigate) {
      onNavigate('signin');
    }
  };

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (successTimeout) {
        clearTimeout(successTimeout);
      }
    };
  }, [successTimeout]);

  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const toggleCard = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  // Add console log to debug
  useEffect(() => {
    console.log("Features section should be visible now");
  }, []);

  const renderIcon = (Icon: any, size: number = 24) => {
    return <Icon size={size} />;
  };

  // Add chatbot functions
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = { text: inputMessage, isUser: true };
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        text: "Thank you for your message. Our support team will get back to you shortly.",
        isUser: false
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuestionClick = (question: string) => {
    // Hide questions when user selects one
    setShowQuestions(false);
    
    // Add user's question
    setChatMessages(prev => [...prev, { text: question, isUser: true }]);
    setIsTyping(true);

    // Add bot's response after a short delay
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { text: botResponses[question], isUser: false }]);
      
      // Show questions again after 10 seconds
      setTimeout(() => {
        setShowQuestions(true);
      }, 10000);
    }, 1500);
  };

  // Add scroll to bottom effect for chat
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className={styles['home-container']}>
      {showSuccess && (
        <div className={styles['success-notification']} style={{ zIndex: 9999 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{successMessage}</span>
        </div>
      )}
      
      <div className={styles.header}>
        <div className={styles['home-icon']} onClick={() => setActiveTab('home')} title="Home">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
        <div className={styles['header-actions']}>
          
          <div className={styles['submit-icon']} onClick={() => setActiveTab('inbox')} title="My Messages">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <div className={styles['profile-icon']} onClick={() => setActiveTab('profile')} title="My Profile">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <div className={styles['logout-icon']} onClick={handleLogout} title="Logout">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </div>
        </div>
      </div>

      {activeTab === 'home' && (
        <div className={styles['home-section']}>
                <div className={styles['services-container']}>
            <div className={styles['spinning-card-container']} ref={spinningCardRef} onClick={toggleCard}>
              <div className={`${styles['spinning-card']} ${isCardFlipped ? styles.flipped : ''}`}>
                <div className={styles['card-front']}>
                  <div className={styles['card-chip']}></div>
                  
                  <div className={styles['card-number']}> <h3 className={styles['card-number-text']}> **** **** **** 6741</h3></div>
                  <div className={styles['card-holder']}> <h6 className={styles['card-number-text']}> Owner :  {userInfo.name}</h6></div>
                  
                  <div className={styles['card-expiry']}> <span className={styles['card-expiry-label0']}>Al-Salam</span>  <span className={styles['card-expiry-label']}>Expiry Date :</span> <span className={styles['card-expiry-date']}>08/26</span></div>
                </div>
                <div className={styles['card-back']}>
                  <div className={styles['card-stripe']}></div>
                  <div className={styles['card-cvv']}>***</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Moved features section outside of services-container */}
          <div className={styles['features-section']} >
            
            
            <div className={styles['features-container']}>
              
              <div 
                className={`${styles['feature-card']} ${activeDropdowns.includes(0) ? styles.active : ''}`} 
                ref={el => featureCardsRef.current[0] = el}
              >
                <div className={styles['feature-image']}>
                  <img src={require('.././Pictures/bankingf.jpg')} alt="Bank Servers" />
                </div>
                <div className={styles['feature-description']}>
                  <h3 onClick={() => toggleDropdown(0)}>Secure Banking Infrastructure</h3>
                  <p>Our state-of-the-art banking servers provide the highest level of security and reliability for your financial transactions. With advanced encryption and 24/7 monitoring, your data is always protected.</p>
                  <div className={styles['feature-dropdown-content']}>
                    <ul>
                      <li>Advanced encryption protocols</li>
                      <li>24/7 security monitoring</li>
                      <li>Redundant backup systems</li>
                      <li>Regular security audits</li>
                      <li>Compliance with international standards</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div 
                className={`${styles['feature-card']} ${activeDropdowns.includes(1) ? styles.active : ''}`} 
                ref={el => featureCardsRef.current[1] = el}
              >
                <div className={styles['feature-image']}>
                  <img src={require('.././Pictures/alsalam.png')} alt="ATM Card" />
                </div>
                <div className={styles['feature-description']}>
                  <h3 onClick={() => toggleDropdown(1)}>The Importance of Digital Cards</h3>
                  <p>Digital cards have become essential in modern banking, providing secure 24/7 access to your funds. They eliminate the need to carry cash, enable instant online purchases, and offer real-time transaction monitoring.</p>
                  <div className={styles['feature-dropdown-content']}>
                    <ul>
                      <li>Secure 24/7 access to funds</li>
                      <li>Contactless payment technology</li>
                      <li>Real-time transaction monitoring</li>
                      <li>Global acceptance</li>
                      <li>Fraud protection features</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div 
                className={`${styles['feature-card']} ${activeDropdowns.includes(2) ? styles.active : ''}`} 
                ref={el => featureCardsRef.current[2] = el}
              >
                <div className={styles['feature-image']}>
                  <img src={require('.././Pictures/pc.jpg')} alt="Digital Banking" />
                </div>
                <div className={styles['feature-description']}>
                  <h3 onClick={() => toggleDropdown(2)}>Digital Banking Solutions</h3>
                  <p>Experience the future of banking with our comprehensive digital solutions. From mobile banking apps to secure online transactions, we provide cutting-edge technology to make managing your finances easier and more secure than ever.</p>
                  <div className={styles['feature-dropdown-content']}>
                    <ul>
                      <li>Mobile banking applications</li>
                      <li>Secure online transactions</li>
                      <li>Digital payment solutions</li>
                      <li>Account management tools</li>
                      <li>Financial planning features</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div 
                className={`${styles['feature-card']} ${activeDropdowns.includes(3) ? styles.active : ''}`} 
                ref={el => featureCardsRef.current[3] = el}
              >
                <div className={styles['feature-image']}>
                  <img src={require('.././Pictures/SL-110820-37810-11.jpg')} alt="Investment Services" />
                </div>
                <div className={styles['feature-description']}>
                  <h3 onClick={() => toggleDropdown(3)}>Investment Services</h3>
                  <p>Grow your wealth with our expert investment services. Our team of financial advisors provides personalized investment strategies tailored to your goals, whether you're planning for retirement, saving for education, or building long-term wealth.</p>
                  <div className={styles['feature-dropdown-content']}>
                    <ul>
                      <li>Personalized investment strategies</li>
                      <li>Retirement planning services</li>
                      <li>Education savings accounts</li>
                      <li>Wealth management solutions</li>
                      <li>Portfolio diversification advice</li>
                    </ul>
                  </div>
                </div>
              </div>
        
              
            </div>
          </div>
        </div>
      )}

      {activeTab === 'form' && (
        <div className={styles['form-section']}>
          <div className={styles['form-header']}>
            <button 
              className={styles['back-button']} 
              onClick={() => {
                setActiveTab('inbox');
                setEditingMessage(null);
                setFormData({
                  date: '',
                  problem: '',
                  description: ''
                });
              }}
              title="Go back to messages"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Messages
            </button>
            <h1>{editingMessage ? 'Edit Message' : 'Report to Support'}</h1>
          </div>
          <form onSubmit={handleSubmit} className={styles['problem-form']}>
            <div className={styles['form-group']}>
              
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles['form-group']}>
              
              <select
                id="problem"
                name="problem"
                value={formData.problem}
                onChange={handleInputChange}
                required
                className={styles['select-input']}
              >
                <option value="" disabled>Select an issue type</option>
                <option value="Buy Salam Card">Buy Salam Card</option>
                <option value="Money Issue">Money Issue</option>
                <option value="Account Issue">Account Issue</option>
                <option value="Services Issue">Services Issue</option>
                <option value="Random Question">Random Question</option>
              </select>
            </div>
            <div className={styles['form-group']}>
              
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of the issue"
                rows={5}
                required
              />
            </div>
            <button type="submit" className={styles['submit-btn']}>
              {editingMessage ? 'Confirm Changes' : 'Submit Report'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className={styles['profile-section']}>
          
          <div className={styles['profile-container']}>
            <div className={styles['profile-image-container']}>
              <div className={styles['profile-image']} onClick={triggerFileInput}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" />
                ) : (
                  <div className={styles['profile-placeholder']}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="32" 
                      height="32" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <span>Add Photo</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfileImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button onClick={triggerFileInput} className={styles['change-photo-btn']}>
                Change Photo
              </button>
            </div>
            <div className={styles['profile-info']}>
              <div className={styles['form-group']}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  minLength={3}
                  maxLength={20}
                  value={userInfo.name}
                  onChange={handleUserInfoChange}
                  placeholder=" "
                />
                <label htmlFor="name">Name</label>
              </div>
              <div className={styles['form-group']}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  minLength={8}
                  maxLength={30}
                  value={userInfo.email}
                  onChange={handleUserInfoChange}
                  placeholder=" "
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className={styles['profile-actions']}>
                <button className={styles['save-profile-btn']} onClick={handleSaveProfile}>Save Changes</button>
                <button className={styles['reset-password-btn']} onClick={handleResetPassword}>Reset Password</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inbox' && (
        <div className={styles['inbox-section']}>
          <div className={styles['inbox-header']}>
            <h1>My Messages</h1>
            <button 
              className={styles['new-message-btn']} 
              onClick={() => {
                setEditingMessage(null);
                setFormData({
                  date: '',
                  problem: '',
                  description: ''
                });
                setActiveTab('form');
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Message
            </button>
          </div>
          
          {messages.length === 0 ? (
            <div className={styles['no-messages']}>
              <div className={styles['empty-state-icon']}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="80" 
                  height="80" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h2>No Messages Yet</h2>
              <p>You haven't sent any messages to support yet.</p>
              <button 
                className={styles['create-message-btn']} 
                onClick={() => {
                  setEditingMessage(null);
                  setFormData({
                    date: '',
                    problem: '',
                    description: ''
                  });
                  setActiveTab('form');
                }}
              >
                Create Your First Message
              </button>
            </div>
          ) : (
            <div className={styles['messages-list']}>
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`${styles['message-card']} ${message.status === 'rejected' ? styles['rejected'] : ''}`}
                >
                  <div className={styles['message-header']}>
                    <h3>{message.problem}</h3>
                    <span className={`${styles['status-badge']} ${styles[message.status]}`}>
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                  </div>
                  <div className={styles['message-date']}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {new Date(message.date).toLocaleDateString()}
                  </div>
                  <p className={styles['message-description']}>{message.description}</p>
                  
                  {message.status === 'rejected' && message.rejectionReason && (
                    <div className={styles['rejection-reason']}>
                      <strong>Rejection Reason:</strong> {message.rejectionReason}
                    </div>
                  )}
                  
                  {/* Show response if it exists */}
                  {message.response && (
                    <div className={styles['message-response']}>
                      <div className={styles['response-header']}>
                        <span className={styles['response-label']}>Response from {message.response.adminName}</span>
                        <span className={styles['response-date']}>
                          {new Date(message.response.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={styles['response-text']}>{message.response.text}</p>
                    </div>
                  )}
                  
                  <div className={styles['message-actions']}>
                    <button 
                      className={`${styles['message-action-btn']} ${styles['edit-btn']} ${message.status === 'resolved' || message.status === 'rejected' ? styles['disabled'] : ''}`}
                      onClick={() => {
                        if (message.status !== 'resolved' && message.status !== 'rejected') {
                          handleEditMessage(message);
                        }
                      }}
                      disabled={message.status === 'resolved' || message.status === 'rejected'}
                      title={message.status === 'resolved' ? 'Cannot edit resolved messages' : message.status === 'rejected' ? 'Cannot edit rejected messages' : 'Edit message'}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Edit
                    </button>
                    <button 
                      className={`${styles['message-action-btn']} ${styles['delete-btn']}`}
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Password Verification Modal */}
      {showPasswordModal && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <h2>Verify Password</h2>
            <p>Please enter your password to confirm changes</p>
            <form onSubmit={handlePasswordSubmit}>
              <div className={styles['form-group']}>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="password">Password</label>
                {passwordError && <p className={styles['error-message']}>{passwordError}</p>}
              </div>
              <div className={styles['modal-actions']}>
                <button type="button" className={styles['cancel-btn']} onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles['confirm-btn']}>
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showResetPasswordModal && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <h2>Reset Password</h2>
            <p>Please enter your current password and choose a new password</p>
            <form onSubmit={handleResetPasswordSubmit}>
              <div className={styles['form-group']}>
                <input
                  type="password"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="oldPassword">Current Password</label>
                {resetPasswordErrors.oldPassword && (
                  <p className={styles['error-message']}>{resetPasswordErrors.oldPassword}</p>
                )}
              </div>
              
              <div className={styles['form-group']}>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="newPassword">New Password</label>
                {resetPasswordErrors.newPassword && (
                  <p className={styles['error-message']}>{resetPasswordErrors.newPassword}</p>
                )}
                {newPassword && (
                  <div className={styles['password-strength']}>
                    <div className={styles['strength-meter']}>
                      <div 
                        className={`${styles['strength-bar']} ${styles[`strength-${passwordStrength.score}`]}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={styles['strength-text']}>{passwordStrength.message}</span>
                  </div>
                )}
              </div>
              
              <div className={styles['form-group']}>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="confirmPassword">Confirm New Password</label>
                {resetPasswordErrors.confirmPassword && (
                  <p className={styles['error-message']}>{resetPasswordErrors.confirmPassword}</p>
                )}
              </div>
              
              <div className={styles['password-requirements']}>
                <p>Password Must Have :</p>
                <ul>
                  <li className={newPassword.length >= 8 ? styles.met : ''}>Be at least 8 characters long</li>
                  <li className={/[A-Z]/.test(newPassword) ? styles.met : ''}>Include at least one uppercase letter</li>
                  <li className={/[a-z]/.test(newPassword) ? styles.met : ''}>Include at least one lowercase letter</li>
                  <li className={/\d/.test(newPassword) ? styles.met : ''}>Include at least one number</li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? styles.met : ''}>Include at least one special character</li>
                </ul>
              </div>
              
              <div className={styles['modal-actions']}>
                <button type="button" className={styles['cancel-btn']} onClick={() => setShowResetPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles['confirm-btn']}>
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className={styles['modal-actions']}>
              <button type="button" className={styles['cancel-btn']} onClick={cancelDelete}>
                Cancel
              </button>
              <button type="button" className={styles['delete-confirm-btn']} onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add chat button */}
      {activeTab === 'home' && (
        <button 
          className={styles['chat-button']}
          onClick={toggleChat}
          title="Chat Support"
        >
          <i className="fas fa-comments"></i>
        </button>
      )}

      {/* Add chat support container */}
      <div className={`${styles['chat-support']} ${isChatOpen ? styles.active : ''}`}>
        <div className={styles['chat-header']}>
          <h3>
            <i className="fas fa-headset"></i>
            Help Center
          </h3>
          <button className={styles['close-chat']} onClick={toggleChat}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={styles['chat-messages']}>
          {chatMessages.map((message, index) => (
            <div key={index} className={`${styles.message} ${message.isUser ? styles.user : styles.bot}`}>
              {message.text}
            </div>
          ))}
          {isTyping && (
            <div className={styles['typing-indicator']}>
              Bot is typing<span>.</span><span>.</span><span>.</span>
            </div>
          )}
          {showQuestions && (
            <div className={styles['questions-container']}>
              {predefinedQuestions.map((question, index) => (
                <button
                  key={index}
                  className={styles['question-button']}
                  onClick={() => handleQuestionClick(question)}
                >
                  <i className="fas fa-comment-dots"></i>
                  {question}
                </button>
              ))}
            </div>
          )}
          <div ref={chatMessagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default HomeUser;


