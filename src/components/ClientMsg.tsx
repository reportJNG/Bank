import React, { useState, useEffect, useRef } from 'react';
import styles from './ClientMsg.module.css';

// SVG Icons Component
const Icons = {
  Back: () => (
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
  ),
  Search: () => (
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
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Filter: () => (
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  ),
  Close: () => (
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
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Reply: () => (
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
      <polyline points="9 17 4 12 9 7"></polyline>
      <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
    </svg>
  ),
  Reject: () => (
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
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  ),
  Send: () => (
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
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  ),
  Cancel: () => (
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
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  User: () => (
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Email: () => (
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
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  Calendar: () => (
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  StatusNew: () => (
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
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  ),
  StatusReplied: () => (
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
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  StatusRejected: () => (
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
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  PriorityHigh: () => (
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
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  ),
  PriorityMedium: () => (
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
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  ),
  PriorityLow: () => (
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
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  ),
  Message: () => (
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  Loading: () => (
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
      <line x1="12" y1="2" x2="12" y2="6"></line>
      <line x1="12" y1="18" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="6" y2="12"></line>
      <line x1="18" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
  ),
  NoResults: () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="48" 
      height="48" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      <line x1="11" y1="8" x2="11" y2="14"></line>
      <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
  )
};

interface HomeUserProps {
  onNavigate?: (page: 'signin' | 'welcome' | 'home' | 'discover' | 'reports' | 'services' | 'clientmsg') => void;
  currentUser?: {
    username: string;
    password: string;
    email: string;
    createdAt: string;
  } | null;
}
// Define TypeScript interfaces for our data structures
interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'new' | 'replied' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  contactInfo: {
    phone?: string;
    company?: string;
  };
  response?: {
    text: string;
    timestamp: string;
    adminName: string;
  };
  rejectionReason?: string;
}

interface RejectionReason {
  id: string;
  label: string;
}

// Rejection reasons
const rejectionReasons: RejectionReason[] = [
  { id: '1', label: 'Spam' },
  { id: '2', label: 'Not a fit for our services' },
  { id: '3', label: 'Invalid request' },
  { id: '4', label: 'Budget constraints' },
  { id: '5', label: 'Other' }
];

const ClientMsg: React.FC<HomeUserProps> = ({ onNavigate, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserState, setCurrentUser] = useState<{ username: string; email: string } | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [replyText, setReplyText] = useState<string>('');
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [selectedRejectionReason, setSelectedRejectionReason] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'replied' | 'rejected'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<{ action: () => void; message: string } | null>(null);
  
  // Refs for animations
  const messagesListRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Apply dark theme by default
  useEffect(() => {
    document.body.classList.add('dark-theme');
    return () => {
      document.body.classList.remove('dark-theme');
    };
  }, []);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Show confirm dialog
  const showConfirm = (action: () => void, message: string) => {
    setConfirmAction({ action, message });
    setShowConfirmDialog(true);
  };

  // Handle confirm action
  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction.action();
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }
  };

  // Load current user and messages from localStorage
  useEffect(() => {
    // Get current user from auth users
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      console.log('Current user loaded:', user);
    } else {
      console.log('No current user found in localStorage');
      // Redirect to signin if no user is found
      if (onNavigate) {
        onNavigate('signin');
      }
    }

    // Get all auth users from localStorage to find their messages
    try {
      // Note: We use 'authUsers' key for authentication users (admins/staff)
      // This is different from 'users' key which stores client records
      const authUsersStr = localStorage.getItem('authUsers');
      if (authUsersStr) {
        const authUsers = JSON.parse(authUsersStr);
        console.log('All auth users loaded:', authUsers);
        
        // Collect all messages from all users
        let allMessages: Message[] = [];
        
        authUsers.forEach((user: any) => {
          const userMessagesStr = localStorage.getItem(`messages_${user.username}`);
          if (userMessagesStr) {
            try {
              const userMessages = JSON.parse(userMessagesStr);
              console.log(`Messages for user ${user.username}:`, userMessages);
              
              // Transform each message to match our Message interface
              const transformedMessages = userMessages.map((msg: any) => ({
                id: msg.id,
                senderName: user.username,
                senderEmail: user.email,
                subject: msg.problem || 'No Subject',
                content: msg.description || 'No Content',
                timestamp: msg.date || new Date().toISOString(),
                status: msg.status === 'pending' ? 'new' : msg.status === 'resolved' ? 'replied' : 'rejected',
                priority: 'medium', // Default priority
                contactInfo: {
                  email: user.email
                }
              }));
              
              allMessages = [...allMessages, ...transformedMessages];
            } catch (error) {
              console.error(`Error parsing messages for user ${user.username}:`, error);
            }
          }
        });
        
        console.log('All transformed messages:', allMessages);
        setMessages(allMessages);
        setIsLoading(false);
      } else {
        console.log('No auth users found in localStorage');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading auth users:', error);
      setIsLoading(false);
    }
  }, [onNavigate]);

  // Filter messages based on search and filters
  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchTerm === '' || 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.senderName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort messages by timestamp (newest first)
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    // First sort by status: new messages first, then replied, then rejected
    if (a.status === 'new' && b.status !== 'new') return -1;
    if (a.status !== 'new' && b.status === 'new') return 1;
    
    // For messages with the same status, sort by timestamp
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Handle message selection
  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsReplying(false);
    setIsRejecting(false);
    setReplyText('');
    setSelectedRejectionReason('');
  };

  // Function to update message status
  const updateMessageStatus = (messageId: string, newStatus: 'new' | 'replied' | 'rejected') => {
    if (!currentUserState) return;

    // Update in messages state
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, status: newStatus } : msg
    );
    setMessages(updatedMessages);

    // Update in localStorage
    const userMessages = localStorage.getItem(`messages_${currentUserState.username}`);
    if (userMessages) {
      const parsedMessages = JSON.parse(userMessages);
      const updatedLocalMessages = parsedMessages.map((msg: any) => 
        msg.id === messageId ? { 
          ...msg, 
          status: newStatus === 'new' ? 'pending' : newStatus === 'replied' ? 'resolved' : 'rejected' 
        } : msg
      );
      localStorage.setItem(`messages_${currentUserState.username}`, JSON.stringify(updatedLocalMessages));
    }
    
    // Show notification
    showNotification(`Message marked as ${newStatus}`, 'success');
  };

  // Function to handle message reply
  const handleReply = (messageId: string) => {
    if (!currentUserState || !replyText.trim()) return;

    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          status: 'replied' as const,
          response: {
            text: replyText,
            timestamp: new Date().toISOString(),
            adminName: currentUserState.username
          }
        };
      }
      return msg;
    });
    setMessages(updatedMessages);

    // Update in localStorage for the original sender
    const message = messages.find(m => m.id === messageId);
    if (message) {
      const userMessages = localStorage.getItem(`messages_${message.senderName}`);
      if (userMessages) {
        const parsedMessages = JSON.parse(userMessages);
        const updatedLocalMessages = parsedMessages.map((msg: any) => {
          if (msg.id === messageId) {
            return {
              ...msg,
              status: 'resolved' as const,
              response: {
                text: replyText,
                timestamp: new Date().toISOString(),
                adminName: currentUserState.username
              }
            };
          }
          return msg;
        });
        localStorage.setItem(`messages_${message.senderName}`, JSON.stringify(updatedLocalMessages));
      }
    }

    setSelectedMessage(null);
    setIsReplying(false);
    setReplyText('');
    showNotification('Reply sent successfully', 'success');
  };

  // Function to handle message rejection
  const handleReject = (messageId: string, reason: string) => {
    if (!currentUserState) return;

    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          status: 'rejected' as const,
          rejectionReason: reason
        };
      }
      return msg;
    });
    setMessages(updatedMessages);

    // Update in localStorage for the original sender
    const message = messages.find(m => m.id === messageId);
    if (message) {
      const userMessages = localStorage.getItem(`messages_${message.senderName}`);
      if (userMessages) {
        const parsedMessages = JSON.parse(userMessages);
        const updatedLocalMessages = parsedMessages.map((msg: any) => {
          if (msg.id === messageId) {
            return {
              ...msg,
              status: 'rejected' as const,
              rejectionReason: reason
            };
          }
          return msg;
        });
        localStorage.setItem(`messages_${message.senderName}`, JSON.stringify(updatedLocalMessages));
      }
    }

    setSelectedMessage(null);
    setIsRejecting(false);
    setSelectedRejectionReason('');
    showNotification('Message rejected successfully', 'success');
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'status-new';
      case 'replied': return 'status-replied';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Icons.StatusNew />;
      case 'replied': return <Icons.StatusReplied />;
      case 'rejected': return <Icons.StatusRejected />;
      default: return null;
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Icons.PriorityHigh />;
      case 'medium': return <Icons.PriorityMedium />;
      case 'low': return <Icons.PriorityLow />;
      default: return null;
    }
  };

  // Loading skeleton component
  const MessageSkeleton = () => (
    <div className={styles['message-skeleton']}>
      <div className={styles['skeleton-avatar']}></div>
      <div className={styles['skeleton-content']}>
        <div className={styles['skeleton-line']}></div>
        <div className={styles['skeleton-line']}></div>
      </div>
    </div>
  );

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (selectedMessage) {
          setSelectedMessage(null);
        }
        if (isReplying) {
          setIsReplying(false);
        }
        if (isRejecting) {
          setIsRejecting(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedMessage, isReplying, isRejecting]);

  return (
    <div 
      className={styles['client-messages']}
      style={{
        backgroundImage: `url('../Pictures/darkj.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div className={styles['back-header']}>
        <button className={styles['back-button']} onClick={() => onNavigate && onNavigate('home')}>
          <Icons.Back />
          Back to Home
        </button>
      </div>

      <div className={styles['messages-header']}>
        <h1>Client Messages</h1>
        <div className={styles['search-bar']}>
          <Icons.Search />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles['filters']}>
          <div className={styles['filter-group']}>
            <Icons.Filter />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'new' | 'replied' | 'rejected')}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className={styles['filter-group']}>
            <Icons.Filter />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as 'all' | 'low' | 'medium' | 'high')}
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles['messages-list']} ref={messagesListRef}>
        {isLoading ? (
          <div className={styles['loading']}>
            <Icons.Loading />
            <p>Loading messages...</p>
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className={styles['no-messages']}>
            <Icons.NoResults />
            <p>No messages found</p>
          </div>
        ) : (
          sortedMessages.map((message, index) => (
            <div
              key={message.id}
              className={`${styles['message-card']} ${styles[message.status]}`}
              onClick={() => handleSelectMessage(message)}
              style={{ 
                animationDelay: `${index * 0.05}s`,
                animation: 'fadeSlideUp 0.5s ease forwards'
              }}
            >
              <div className={styles['message-header']}>
                <h3>{message.subject}</h3>
                <span className={`${styles['status-badge']} ${styles[message.status]}`}>
                  {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                </span>
              </div>
              <div className={styles['message-info']}>
                <p className={styles['sender']}>
                  <Icons.User/>  {message.senderName}
                </p>
                <p className={styles['email']}>
                  <Icons.Email />
                  {message.senderEmail}
                </p>
                <p className={styles['timestamp']}>
                  <Icons.Calendar />
                  {new Date(message.timestamp).toLocaleString()}
                </p>
                <p className={styles['priority']}>
                  {getPriorityIcon(message.priority)}
                  Priority: {message.priority}
                </p>
              </div>
              <p className={styles['message-preview']}>
                <Icons.Message />
                <span>
                  {message.content.length > 150
                    ? `${message.content.substring(0, 150)}...`
                    : message.content}
                </span>
              </p>
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']} ref={modalRef}>
            <div className={styles['modal-header']}>
              <h2>{selectedMessage.subject}</h2>
              <button className={styles['close-button']} onClick={() => setSelectedMessage(null)}>
                <Icons.Close />
              </button>
            </div>
            <div className={styles['modal-body']}>
              <div className={styles['message-details']}>
                <div className={styles['detail-item']}>
                  <Icons.User />
                  <div className={styles['detail-content']}>
                    <b>:</b> <b>{selectedMessage.senderName}</b>
                  </div>
                </div>
                <div className={styles['detail-item']}>
                  <Icons.Email />
                  <div className={styles['detail-content']}>
                    <b>:</b> <b>{selectedMessage.senderEmail}</b>
                  </div>
                </div>
                <div className={styles['detail-item']}>
                  <Icons.Calendar />
                  <div className={styles['detail-content']}>
                    <b>:</b> <b>{new Date(selectedMessage.timestamp).toLocaleString()}</b>
                  </div>
                </div>
                <div className={styles['detail-item']}>
                  {getStatusIcon(selectedMessage.status)}
                  <div className={styles['detail-content']}>
                    <b>:</b> <b>{selectedMessage.status}</b>
                  </div>
                </div>
                <div className={styles['detail-item']}>
                  {getPriorityIcon(selectedMessage.priority)}
                  <div className={styles['detail-content']}>
                    <b>:</b> <b>{selectedMessage.priority}</b>
                  </div>
                </div>
              </div>
              <div className={styles['message-content']}>
                <h3>
                  <Icons.Message />
                  <strong> Message </strong>
                </h3>
                <p>{selectedMessage.content}</p>
              </div>
              {selectedMessage.status === 'new' && (
                <div className={styles['message-actions']}>
                  <button
                    className={styles['reply-button']}
                    onClick={() => setIsReplying(true)}
                  >
                    <Icons.Reply />
                    Reply
                  </button>
                  <button
                    className={styles['reject-button']}
                    onClick={() => setIsRejecting(true)}
                  >
                    <Icons.Reject />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {isReplying && selectedMessage && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']} ref={modalRef}>
            <div className={styles['modal-header']}>
              <h2>Reply to Message</h2>
              <button className={styles['close-button']} onClick={() => setIsReplying(false)}>
                <Icons.Close />
              </button>
            </div>
            <div className={styles['modal-body']}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={5}
                className={styles['form-control']}
                autoFocus
              />
              <div className={styles['modal-actions']}>
                <button
                  className={styles['cancel-button']}
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText('');
                  }}
                >
                  <Icons.Cancel />
                  Cancel
                </button>
                <button
                  className={styles['send-button']}
                  onClick={() => {
                    if (replyText.trim()) {
                      handleReply(selectedMessage.id);
                    } else {
                      showNotification('Please enter a reply message', 'error');
                    }
                  }}
                  disabled={!replyText.trim() || isLoading}
                >
                  <Icons.Send />
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejecting && selectedMessage && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']} ref={modalRef}>
            <div className={styles['modal-header']}>
              <h2>Reject Message</h2>
              <button className={styles['close-button']} onClick={() => setIsRejecting(false)}>
                <Icons.Close />
              </button>
            </div>
            <div className={styles['modal-body']}>
              <p>Please select a reason for rejection:</p>
              <select
                value={selectedRejectionReason}
                onChange={(e) => setSelectedRejectionReason(e.target.value)}
                className={`${styles['reject-reason-select']} ${styles['form-control']}`}
              >
                <option value="">Select a reason</option>
                {rejectionReasons.map(reason => (
                  <option key={reason.id} value={reason.id}>
                    {reason.label}
                  </option>
                ))}
              </select>
              <div className={styles['modal-actions']}>
                <button
                  className={styles['cancel-button']}
                  onClick={() => {
                    setIsRejecting(false);
                    setSelectedRejectionReason('');
                  }}
                >
                  <Icons.Cancel />
                  Cancel
                </button>
                <button
                  className={styles['confirm-reject-button']}
                  onClick={() => {
                    if (selectedRejectionReason) {
                      handleReject(selectedMessage.id, selectedRejectionReason);
                    } else {
                      showNotification('Please select a rejection reason', 'error');
                    }
                  }}
                  disabled={!selectedRejectionReason || isLoading}
                >
                  <Icons.Reject />
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`${styles['notification']} ${styles[notification.type]}`}>
          <div className={styles['notification-icon']}>
            {notification.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            ) : notification.type === 'error' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            )}
          </div>
          <div className={styles['notification-message']}>{notification.message}</div>
          <button className={styles['notification-close']} onClick={() => setNotification(null)}>
            <Icons.Close />
          </button>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && confirmAction && (
        <div className={`${styles['confirm-dialog']} ${styles['show']}`}>
          <div className={styles['confirm-content']}>
            <h3 className={styles['confirm-title']}>Confirm Action</h3>
            <p className={styles['confirm-text']}>{confirmAction.message}</p>
            <div className={styles['confirm-actions']}>
              <button className={styles['cancel-button']} onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </button>
              <button className={styles['confirm-reject-button']} onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientMsg;