import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.css';
import logo from '../Pictures/ASBA.png';
import UserLog from './UserLog';

// Types
interface HomeProps {
  onNavigate: (page: 'signin' | 'welcome' | 'home' | 'discover' | 'reports' | 'services' | 'clientmsg') => void;
  isAdmin?: boolean;
}

interface Message {
  text: string;
  isUser: boolean;
}

// Constants
const ABOUT_TEXT = "Welcome to Al-Salam Bank, your trusted partner in financial excellence. We are committed to providing innovative banking solutions and exceptional service to our customers.";

const predefinedQuestions = [
  "How can I add a user?",
  "How can I search for a user?",
  "What our  banking services are?",
  "How to access reports?",
  "How to reply to a client message?",
  "How i can talk to another company representative?"
];

const botResponses: { [key: string]: string } = {
  "How can I add a user?": "To add a user, go to the Banking Services section and click on 'Add User'. You'll need to fill in the user's details including name, contact information, and required documents.",
  "How can I search for a user?": "You can search for a user by going to the Discover section. Use the search bar to enter the user's name, ID, or account number. The system will show you matching results.",
  "What our  banking services are?": "Our banking services include account management, money transfers, bill payments, loan applications, and investment options. You can access these through the Banking Services section.",
  "How to access reports?": "Reports can be accessed through the Reports Hub. You'll find various types of reports including transaction history, account statements, and financial summaries.",
  "How to reply to a client message?": "To reply to a client message, go to the Client Messages section by clicking on the chat icon. You'll see all client conversations there. Click on the message you want to respond to and use the reply interface to send your response.",
  "How i can talk to another company representative?": "You can connect with other company representatives through our internal messaging system. Click on the Client Messages section, then use the 'Connect with Team' option to find and message other representatives directly."
};

// Components
const Home: React.FC<HomeProps> = ({ onNavigate, isAdmin = false }) => {
  // State
  const [displayedText, setDisplayedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! How can we help you today?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [showUserLog, setShowUserLog] = useState(false);
  
  // Derived state
  const words = ABOUT_TEXT.split(' ');

  // Effects
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isTypingComplete) {
      timeout = setTimeout(() => {
        if (currentWordIndex < words.length) {
          setDisplayedText(prev => prev + (prev ? ' ' : '') + words[currentWordIndex]);
          setCurrentWordIndex(prev => prev + 1);
        } else {
          setIsTypingComplete(true);
        }
      }, 100);
    } else {
      timeout = setTimeout(() => {
        setDisplayedText('');
        setCurrentWordIndex(0);
        setIsTypingComplete(false);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [currentWordIndex, isTypingComplete, words]);

  // Theme toggle effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Chat functions
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = { text: inputMessage, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        text: "Thank you for your message. Our support team will get back to you shortly.",
        isUser: false
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleQuestionClick = (question: string) => {
    // Hide questions when user selects one
    setShowQuestions(false);
    
    // Add user's question
    setMessages(prev => [...prev, { text: question, isUser: true }]);
    setIsTyping(true);

    // Add bot's response after a short delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { text: botResponses[question], isUser: false }]);
      
      // Show questions again after 10 seconds
      setTimeout(() => {
        setShowQuestions(true);
      }, 10000);
    }, 1500);
  };

  const handleBackClick = () => {
    setShowQuestions(true);
  };

  // Render methods
  const renderServices = () => (
    <div className={styles['service-icons']}>
      {isAdmin && (
        <a href="#" className={styles.service} onClick={(e) => {
          e.preventDefault();
          setShowUserLog(true);
        }}>
          <i className="bi bi-people-fill"></i>
          <span className={styles.xe}>User Log</span>
        </a>
      )}
      
      <a href="#" className={styles.service} onClick={(e) => {
        e.preventDefault();
        onNavigate('discover');
      }}>
        <i className="bi bi-search-heart-fill"></i>
        <span className={styles.xe}>Discover</span>
      </a>
      <a href="#" className={styles.service} onClick={(e) => {
        e.preventDefault();
        onNavigate('clientmsg');
      }}>
        <i className="bi bi-chat-dots"></i>
        <span className={styles.xe}>Client Messages</span>
      </a>
      <a href="#" className={styles.service} onClick={(e) => {
        e.preventDefault();
        onNavigate('reports');
      }}>
        <i className="bi bi-pie-chart-fill"></i>
        <span className={styles.xe}>Reports Hub</span>
      </a>
    </div>
  );

  return (
    <div className={styles['home-container']}>
      <header className={`${styles.header} ${isDarkMode ? styles['dark-header'] : ''}`}>
        <h3>Al-Salam Bank</h3>
        <img src={logo} alt="Al Salam Bank Logo" className={styles['header-logo']} />
        <nav>
          <ul>
            <li><a href="#work"><i className="fas fa-cogs"></i> Services</a></li>
            <li><a href="#about"><i className="fas fa-info-circle"></i> About</a></li>
            <li><a href="#" onClick={() => onNavigate('signin')}><i className="fas fa-sign-out-alt"></i> Logout</a></li>
          </ul>
        </nav>
      </header>

      <button 
        className={styles['theme-toggle']}
        onClick={() => setIsDarkMode(!isDarkMode)}
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
      </button>

      <button 
        className={styles['chat-button']}
        onClick={toggleChat}
        title="Chat Support"
      >
        <i className="fas fa-comments"></i>
      </button>

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
          {messages.map((message, index) => (
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
          <div ref={messagesEndRef} />
        </div>
      </div>

      {showUserLog && (
        <UserLog onClose={() => setShowUserLog(false)} />
      )}

      <main>
        <section id="work" className={styles['services-section']}>
          <h2> Services</h2>
          {renderServices()}
        </section>

        <section id="about" className={styles['about-section']}>
          <h2>About Us</h2>
          <div className={styles.service2}>
            <p className={styles['typing-text']}>
              {displayedText}
            </p>
            <div className={styles['about-image']}>
              <img src={logo} alt="About Us" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 