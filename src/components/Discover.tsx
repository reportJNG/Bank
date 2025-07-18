import React, { useState, useEffect } from 'react';
import styles from './Discover.module.css';
import logo from '../Pictures/ASBA.png';

interface DiscoverProps {
  onNavigate: (page: 'signin' | 'welcome' | 'home' | 'discover') => void;
}

interface User {
  id: string;
  name: string;
  status: string;
  category: string;
  type: string;
  email: string;
  reclamation: string;
  dateReclamation: string;
  // New fields for a more complete user profile
  phoneNumber: string;
  address: string;
  
  notes: string;
}

interface Comment {
  id: string;
  text: string;
  date: string;
  isReply?: boolean;
  parentId?: string;
  replies?: Comment[];
  isExpanded?: boolean;
}

interface Toast {
  id: number;
  type: 'success' | 'error';
  title: string;
  message: string;
}

const Discover: React.FC<DiscoverProps> = ({ onNavigate }) => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [userComment, setUserComment] = useState('');
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [replyingToComment, setReplyingToComment] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(1);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({
    id: '',
    name: '',
    status: 'Active',
    category: 'Personal',
    type: 'Individual',
    email: '',
    reclamation: '',
    dateReclamation: '',
    phoneNumber: '',
    address: '',
    notes: ''
  });

  // Filter options
  const statusOptions = ['All Status', 'Active', 'Pending', 'Inactive'];
  const categoryOptions = ['All Categories', 'Personal', 'Business'];
  const typeOptions = ['All Client Types', 'Individual', 'Corporate'];

  // Effects
  useEffect(() => {
    try {
      // Note: 'users' key is used for client records, while 'authUsers' is used for authentication
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        // Initialize with empty array if no users exist
        setUsers([]);
        localStorage.setItem('users', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    // Apply filters whenever search term or filters change
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'All Status') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== 'All Categories') {
      result = result.filter(user => user.category === categoryFilter);
    }
    
    // Apply type filter
    if (typeFilter && typeFilter !== 'All Client Types') {
      result = result.filter(user => user.type === typeFilter);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, statusFilter, categoryFilter, typeFilter, users]);

  // Handlers
  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCategoryFilter('');
    setTypeFilter('');
  };

  // Add functions to handle localStorage
  const loadComments = (userId: string): Comment[] => {
    const savedComments = localStorage.getItem(`userComments_${userId}`);
    return savedComments ? JSON.parse(savedComments) : [];
  };

  const saveComments = (userId: string, comments: Comment[]) => {
    localStorage.setItem(`userComments_${userId}`, JSON.stringify(comments));
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    // Create a copy of the user for editing
    setEditedUser({...user});
    setShowEditModal(true);
    setUserComment('');
    // Load existing comments for this user
    setUserComments(loadComments(user.id));
    // Add modal-open class to body to prevent scrolling
    document.body.classList.add('modal-open');
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setEditedUser(null);
    // Remove modal-open class from body
    document.body.classList.remove('modal-open');
  };

  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    const id = nextToastId;
    setNextToastId(nextToastId + 1);
    
    setToasts(prev => [...prev, { id, type, title, message }]);
    
    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleInputChange = (field: keyof User, value: string) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value
      });
    }
  };

  const handleSaveEdit = () => {
    if (editedUser) {
      // Update the user in the users array
      const updatedUsers = users.map(user => 
        user.id === editedUser.id ? editedUser : user
      );
      
      // Update state
      setUsers(updatedUsers);
      
      // Save to localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Close modal and show success message
      setShowEditModal(false);
      setPopupMessage('User updated successfully!');
      setIsSuccess(true);
      setShowPopup(true);
    }
  };

  // Add this function to handle adding a new user
  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  // Add this function to handle saving a new user
  const handleSaveNewUser = () => {
    // Validate required fields
    if (!newUser.name || !newUser.phoneNumber || !newUser.email) {
      setPopupMessage('Please fill in all required fields');
      setIsSuccess(false);
      setShowPopup(true);
      return;
    }

    // Generate a unique ID for the new user
    const newUserId = `user-${Date.now()}`;
    
    // Create the new user object
    const userToAdd = {
      ...newUser,
      id: newUserId,
      createdAt: new Date().toISOString()
    };
    
    // Add the new user to the users array
    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Reset form and show success message
    setNewUser({
      id: '',
      name: '',
      phoneNumber: '',
      status: 'Active',
      category: 'Personal',
      type: 'Individual',
      email: '',
      address: '',
      notes: '',
      reclamation: '',
      dateReclamation: ''
    });
    
    setPopupMessage('User added successfully!');
    setIsSuccess(true);
    setShowPopup(true);
  };

  // Add this function to handle input changes for the new user form
  const handleNewUserInputChange = (field: keyof User, value: string) => {
    setNewUser({
      ...newUser,
      [field]: value
    });
  };

  // Add this function to handle deleting a user
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirmation(true);
  };

  // Add this function to confirm user deletion
  const confirmDeleteUser = () => {
    if (userToDelete) {
      // Remove the user from the users array
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      
      // Update state
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      
      // Save to localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Close confirmation modal
      setShowDeleteConfirmation(false);
      setUserToDelete(null);
      
      // Show success toast
      showToast('success', 'Success', 'Client deleted successfully!');
    }
  };

  // Add this function to cancel user deletion
  const cancelDeleteUser = () => {
    setShowDeleteConfirmation(false);
    setUserToDelete(null);
  };

  // Add this function to handle deleting a comment
  const handleDeleteComment = (commentId: string) => {
    // First update the state to remove the comment
    setUserComments(prevComments => {
      // First, try to find and delete the comment directly
      const filteredComments = prevComments.filter(comment => comment.id !== commentId);
      
      // If the comment wasn't found at the top level, it might be a reply
      if (filteredComments.length === prevComments.length) {
        // Search through replies of each comment
        return prevComments.map(comment => ({
          ...comment,
          replies: comment.replies?.filter(reply => reply.id !== commentId)
        }));
      }
      
      return filteredComments;
    });

    // Then update localStorage to persist the deletion
    if (selectedUser) {
      // Get current comments from localStorage
      const savedComments = localStorage.getItem(`userComments_${selectedUser.id}`);
      if (savedComments) {
        const parsedComments = JSON.parse(savedComments);
        
        // Filter out the deleted comment
        const updatedComments = parsedComments.filter((comment: Comment) => {
          // Check if this is the comment to delete
          if (comment.id === commentId) {
            return false;
          }
          
          // Check if this comment has replies
          if (comment.replies && comment.replies.length > 0) {
            // Filter out the deleted reply
            comment.replies = comment.replies.filter((reply: Comment) => reply.id !== commentId);
          }
          
          return true;
        });
        
        // Save the updated comments back to localStorage
        localStorage.setItem(`userComments_${selectedUser.id}`, JSON.stringify(updatedComments));
        
        // Show success toast
        showToast('success', 'Comment Deleted', 'The comment has been permanently deleted.');
      }
    }
  };

  // Add this function to handle replying to a comment
  const handleReplyToComment = (index: string) => {
    setReplyingToComment(index);
    setReplyText('');
  };

  // Add this function to submit a reply
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingToComment) return;

    const newReply: Comment = {
      id: Date.now().toString(),
      text: replyText,
      date: new Date().toLocaleDateString(),
      isReply: true,
      parentId: replyingToComment
    };

    setUserComments(prevComments =>
      prevComments.map(comment =>
        comment.id === replyingToComment
          ? {
              ...comment,
              replies: [...(comment.replies || []), newReply],
              isExpanded: true // Automatically expand to show the new reply
            }
          : comment
      )
    );

    setReplyText('');
    setReplyingToComment(null);
  };

  // Add this function to cancel replying
  const handleCancelReply = () => {
    setReplyingToComment(null);
    setReplyText('');
  };

  const handleToggleReplies = (commentId: string) => {
    setUserComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, isExpanded: !comment.isExpanded }
          : comment
      )
    );
  };

  // Add this function to handle CSV export
  const handleExportCSV = () => {
    if (filteredUsers.length === 0) {
      showToast('error', 'Export Failed', 'No data available to export');
      return;
    }

    // Create CSV header
    const headers = [
      'ID', 'Name', 'Status', 'Category', 'Type', 'Email', 
      'Phone Number', 'Address', 'Reclamation', 'Date Reclamation', 'Notes'
    ];
    
    // Create CSV rows
    const csvRows = filteredUsers.map(user => [
      user.id,
      user.name,
      user.status,
      user.category,
      user.type,
      user.email,
      user.phoneNumber,
      user.address,
      user.reclamation,
      user.dateReclamation,
      user.notes
    ]);
    
    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Export Successful', 'Data exported to CSV successfully');
  };

  return (
    <div className={styles['discover-container']}>
      {/* Toast Container - Moved to the top level */}
      <div className={styles['toast-container']}>
        {toasts.map(toast => (
          <div key={toast.id} className={`${styles.toast} ${styles[`toast-${toast.type}`]} ${styles.show}`}>
            <div className={styles['toast-icon']}>
              {toast.type === 'success' ? (
                <i className="bi bi-check-circle-fill"></i>
              ) : (
                <i className="bi bi-exclamation-circle-fill"></i>
              )}
            </div>
            <div className={styles['toast-content']}>
              <div className={styles['toast-title']}>{toast.title}</div>
              <div className={styles['toast-message']}>{toast.message}</div>
            </div>
            <button className={styles['toast-close']} onClick={() => removeToast(toast.id)}>
              <i className="bi bi-x"></i>
            </button>
            <div className={styles['toast-progress']}></div>
          </div>
        ))}
      </div>

      <div className={styles['discover-header']}>
        <button 
          className={styles['back-button']}
          onClick={() => onNavigate('home')}
        >
          <i className="bi bi-arrow-left"></i> Back to Home
        </button>
        <h1>Discover Users</h1>
        <div className={styles['header-actions']}>
          <button 
            className={styles['export-csv-button']}
            onClick={handleExportCSV}
            title="Export to CSV"
          >
            Export 
          </button>
          <img src={logo} alt="Al Salam Bank Logo" className={styles['header-logo']} />
        </div>
      </div>

      <div className={styles['search-section']}>
        <div className={styles.filters}>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles['filter-select']}
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles['filter-select']}
          >
            {categoryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles['filter-select']}
          >
            {typeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          
          <input 
            type="text" 
            placeholder="Search by phone number..." 
            className={styles['search-input']}
            value={searchTerm}
            maxLength={10}
            minLength={10}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <button 
            className={styles['reset-button']}
            onClick={handleReset}
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
          
        </div>
      </div>

      <div className={styles['results-section']}>
        <table className={styles['user-table']}>
          <thead>
            <tr>
              <th>Phone number</th>
              <th>Full Name</th>
              <th>Status</th>
              <th>Category</th>
              <th>Type</th>
              <th>Email</th>
              <th>Reclamation</th>
              <th>Date Reclamation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.phoneNumber}>
                <td>{user.phoneNumber}</td>
                <td>{user.name}</td>
                <td>{user.status}</td>
                <td>{user.category}</td>
                <td>{user.type}</td>
                <td>{user.email}</td>
                <td>{user.reclamation}</td>
                <td>{user.dateReclamation}</td>
                <td>
                  <div className={styles['action-buttons']}>
                    <button 
                      className={styles['edit-button']}
                      onClick={() => handleEditUser(user)}
                      title="Edit Client"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button 
                      className={styles['delete-button']}
                      onClick={() => handleDeleteUser(user)}
                      title="Delete Client"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Client Button - Sticky */}
      <button 
        className={styles['add-client-button']}
        onClick={handleAddUser}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <span>Add New Client</span>
      </button>

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <div className={styles['modal-header']}>
              <h2>Add New Client</h2>
              <button 
                className={styles['modal-close']}
                onClick={() => setShowAddUserModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className={styles['modal-body']}>
              
              <div className={styles['form-group']}>
                <label htmlFor="newUserPhone">Phone Number  (Unique)</label>
                <input 
                  type="tel" 
                  id="newUserPhone" 
                  value={newUser.phoneNumber}
                  onChange={(e) => handleNewUserInputChange('phoneNumber', e.target.value)}
                  placeholder="10 digits (e.g., 1234567890)"
                  pattern="\d{10}"
                  maxLength={10}
                  minLength={10}
                  title="Phone number must be exactly 10 digits and unique for each client"
                  required
                />
                
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="newUserName">Full Name </label>
                <input 
                  type="text" 
                  id="newUserName" 
                  maxLength={30}
                  minLength={5}
                  value={newUser.name}
                  onChange={(e) => handleNewUserInputChange('name', e.target.value)}
                  placeholder="User name"
                  required
                  pattern="[a-zA-Z\s]+"
                  title="Name must contain only letters"
                />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="newUserStatus">Status</label>
                <select 
                  id="newUserStatus" 
                  value={newUser.status}
                  onChange={(e) => handleNewUserInputChange('status', e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="newUserCategory">Category</label>
                <select 
                  id="newUserCategory" 
                  value={newUser.category}
                  onChange={(e) => handleNewUserInputChange('category', e.target.value)}
                >
                  <option value="Personal">Personal</option>
                  <option value="Business">Business</option>
                </select>
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="newUserType">Type</label>
                <select 
                  id="newUserType" 
                  value={newUser.type}
                  onChange={(e) => handleNewUserInputChange('type', e.target.value)}
                >
                  <option value="Individual">Individual</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="newUserEmail">Email</label>
                <input 
                  type="email" 
                  id="newUserEmail" 
                  value={newUser.email}
                  onChange={(e) => handleNewUserInputChange('email', e.target.value)}
                  placeholder="example@domain.com"
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="newUserAddress">Address</label>
                <textarea 
                  id="newUserAddress" 
                  value={newUser.address}
                  maxLength={50}
                  minLength={5}
                  onChange={(e) => handleNewUserInputChange('address', e.target.value)}
                  placeholder="Client address"
                ></textarea>
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="newUserReclamation">Reclamation</label>
                <textarea 
                  id="newUserReclamation" 
                  value={newUser.reclamation}
                  maxLength={150}
                  minLength={5}
                  onChange={(e) => handleNewUserInputChange('reclamation', e.target.value)}
                  placeholder="Any reclamation details"
                ></textarea>
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="newUserDateReclamation">Date Reclamation</label>
                <input 
                  type="date" 
                  id="newUserDateReclamation" 
                  required
                  value={newUser.dateReclamation}
                  onChange={(e) => handleNewUserInputChange('dateReclamation', e.target.value)}
                />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="newUserNotes">Notes</label>
                <textarea 
                  id="newUserNotes" 
                  value={newUser.notes}
                  maxLength={350}
                  minLength={5}
                  onChange={(e) => handleNewUserInputChange('notes', e.target.value)}
                  placeholder="Additional notes"
                ></textarea>
              </div>
            </div>
            <div className={styles['modal-footer']}>
              <button 
                className={styles['modal-cancel']}
                onClick={() => setShowAddUserModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles['modal-save']}
                onClick={handleSaveNewUser}
              >
                <i className="bi bi-check-lg"></i> Save Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && editedUser && (
        <div className={styles['edit-user-modal']}>
          <div className={styles['edit-user-content']}>
            <div className={styles['edit-user-header']}>
              <h2>Edit User</h2>
              <nav className={styles['edit-user-nav']}>
                <a 
                  href="#details" 
                  className={`${styles['edit-user-nav-item']} ${activeTab === 'details' ? styles.active : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('details');
                  }}
                >
                  <i className="bi bi-person"></i> Details
                </a>
                <a 
                  href="#comments" 
                  className={`${styles['edit-user-nav-item']} ${activeTab === 'comments' ? styles.active : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('comments');
                  }}
                >
                  <i className="bi bi-chat-dots"></i> Comments
                </a>
              </nav>
              <button className={styles['edit-user-close']} onClick={handleCloseModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className={styles['edit-user-form']}>
              {activeTab === 'details' && (
                <>
                  <div className={styles['edit-user-field']}>
                    <label className={styles['edit-user-label']} htmlFor="userPhone">Phone Number:</label>
                    <input 
                      className={styles['edit-user-input']} 
                      type="tel" 
                      id="userPhone" 
                      value={editedUser.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  </div>
                  
                  <div className={styles['edit-user-field']}>
                    <label className={styles['edit-user-label']} htmlFor="userName">Name:</label>
                    <input 
                      className={styles['edit-user-input']} 
                      type="text" 
                      id="userName" 
                      value={editedUser.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className={styles['edit-user-field']}>
                    <label className={styles['edit-user-label']} htmlFor="userName">Last Name:</label>
                    <input 
                      className={styles['edit-user-input']} 
                      type="text" 
                      id="userName" 
                      value={editedUser.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className={styles['edit-user-field']}>
                    <label className={styles['edit-user-label']} htmlFor="userStatus">Status:</label>
                    <select 
                      className={styles['edit-user-select']} 
                      id="userStatus" 
                      value={editedUser.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className={styles['edit-user-field']}>
                    <label className={styles['edit-user-label']} htmlFor="userCategory">Category:</label>
                    <select 
                      className={styles['edit-user-select']} 
                      id="userCategory" 
                      value={editedUser.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      <option value="Personal">Personal</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  
                  <div className={styles['edit-user-field']}>
                    <label className={styles['edit-user-label']} htmlFor="userType">Type:</label>
                    <select 
                      className={styles['edit-user-select']} 
                      id="userType" 
                      value={editedUser.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                      <option value="Individual">Individual</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                  
                  <div className={styles['edit-user-field']}>
                    <label className={styles['edit-user-label']} htmlFor="userEmail">Email:</label>
                    <input 
                      className={styles['edit-user-input']} 
                      type="email" 
                      id="userEmail" 
                      value={editedUser.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  
                  
                  
                  <div className={styles['edit-user-field']}>
                    <label className={styles['edit-user-label']} htmlFor="userAddress">Address:</label>
                    <textarea 
                      className={styles['edit-user-input']} 
                      id="userAddress" 
                      value={editedUser.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    ></textarea>
                  </div>
                  
                  
                  
                  <div className={styles['edit-user-field']}>
                   
                  </div>
                  
                  <div className={styles['edit-user-field']}>
                   
                  </div>
                  
                  <div className={styles['edit-user-field']}>
                    <label className={styles['edit-user-label']} htmlFor="userReclamation">Reclamation:</label>
                    <textarea 
                      className={styles['edit-user-input']} 
                      id="userReclamation" 
                      value={editedUser.reclamation}
                      onChange={(e) => handleInputChange('reclamation', e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className={styles['edit-user-field']}>
                    <label className={styles['edit-user-label']} htmlFor="userDateReclamation">Date Reclamation:</label>
                    <input 
                      className={styles['edit-user-input']} 
                      type="date" 
                      id="userDateReclamation" 
                      value={editedUser.dateReclamation}
                      onChange={(e) => handleInputChange('dateReclamation', e.target.value)}
                    />
                  </div>
                  
                  <div className={styles['edit-user-field']}>
                    <label className={styles['edit-user-label']} htmlFor="userNotes">Notes:</label>
                    <textarea 
                      className={styles['edit-user-input']} 
                      id="userNotes" 
                      value={editedUser.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                    ></textarea>
                  </div>
                </>
              )}
              
              {activeTab === 'comments' && (
                <div className={styles['edit-user-field']}>
                  <label className={styles['edit-user-label']} htmlFor="userComment">Add Comment:</label>
                  <textarea 
                    className={styles['edit-user-input']} 
                    id="userComment" 
                    rows={5}
                    placeholder="Enter your comment about this user..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                  ></textarea>
                  <div className={styles['edit-user-comment-actions']}>
                    <button 
                      className={styles['edit-user-comment-submit']}
                      onClick={(e) => {
                        if (userComment.trim() && selectedUser) {
                          // Create new comment with userId
                          const newComment = {
                            id: Date.now().toString(),
                            text: userComment.trim(),
                            date: new Date().toLocaleString(),
                            userId: selectedUser.id
                          };
                          
                          // Add the new comment to the list
                          const updatedComments = [...userComments, newComment];
                          setUserComments(updatedComments);
                          
                          // Save to localStorage
                          saveComments(selectedUser.id, updatedComments);
                          
                          // Show toast instead of popup
                          showToast('success', 'Comment Added', 'Your comment has been saved successfully!');
                          setUserComment('');
                        }
                      }}
                    >
                      <i className="bi bi-send"></i> Submit Comment
                    </button>
                  </div>

                  {/* Display submitted comments */}
                  <div className={styles['edit-user-comments-list']}>
                    {userComments.map((comment) => (
                      <div key={comment.id} className={styles.comment}>
                        <div className={styles['comment-content']}>
                          <p>{comment.text}</p>
                          <span className={styles['comment-date']}>
                            <i className="bi bi-clock"></i>
                            {comment.date}
                          </span>
                          <div className={styles['comment-actions']}>
                            <button onClick={() => handleReplyToComment(comment.id)}>
                              <i className="bi bi-reply"></i>
                              Reply
                            </button>
                            <button onClick={() => handleDeleteComment(comment.id)}>
                              <i className="bi bi-trash"></i>
                              Delete
                            </button>
                            {comment.replies && comment.replies.length > 0 && (
                              <button 
                                onClick={() => handleToggleReplies(comment.id)}
                                className={styles['toggle-replies-btn']}
                              >
                                <i className={`bi bi-chevron-${comment.isExpanded ? 'up' : 'down'}`}></i>
                                {comment.isExpanded ? 'Hide replies' : `See ${comment.replies.length} replies`}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {replyingToComment === comment.id && (
                          <form onSubmit={handleSubmitReply} className={styles['reply-form']}>
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                            />
                            <div className={styles['button-group']}>
                              <button type="button" onClick={handleCancelReply}>
                                <i className="bi bi-x"></i>
                                Cancel
                              </button>
                              <button type="submit">
                                <i className="bi bi-send"></i>
                                Reply
                              </button>
                            </div>
                          </form>
                        )}

                        {comment.isExpanded && comment.replies && (
                          <div className={styles['replies-container']}>
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className={styles.reply}>
                                <p>{reply.text}</p>
                                <span className={styles['comment-date']}>
                                  <i className="bi bi-clock"></i>
                                  {reply.date}
                                </span>
                                <div className={styles['comment-actions']}>
                                  <button onClick={() => handleDeleteComment(reply.id)}>
                                    <i className="bi bi-trash"></i>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Show actions only in details tab */}
              {activeTab === 'details' && (
                <div className={styles['edit-user-actions']}>
                  <button className={styles['edit-user-cancel']} onClick={handleCloseModal}>Cancel</button>
                  <button className={styles['edit-user-save']} onClick={handleSaveEdit}>
                    <i className="bi bi-check-lg"></i> Save Changes
                  </button>
                </div>
              )}
            </div>
            <div className={styles['edit-user-footer']}>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && userToDelete && (
        <div className={styles['modal-overlay']}>
          <div className={`${styles['modal-content']} ${styles['delete-confirmation-modal']}`}>
            <div className={styles['modal-header']}>
              <h2>Confirm Delete</h2>
              <button 
                className={styles['modal-close']}
                onClick={cancelDeleteUser}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className={styles['modal-body']}>
              <div className={styles['delete-confirmation-message']}>
                <i className={`bi bi-exclamation-triangle-fill ${styles['warning-icon']}`}></i>
                <p>Are you sure you want to delete this client?</p>
                <div className={styles['client-details']}>
                  <p><strong>Name:</strong> {userToDelete.name}</p>
                  <p><strong>Phone:</strong> {userToDelete.phoneNumber}</p>
                  <p><strong>Email:</strong> {userToDelete.email || 'N/A'}</p>
                </div>
                <p className={styles['warning-text']}>This action is unsafe and can lead to data loss</p>
              </div>
            </div>
            <div className={styles['modal-footer']}>
              <button 
                className={styles['modal-canceldiff']}
                onClick={cancelDeleteUser}
              >
                Cancel
              </button>
              <button 
                className={styles['modal-delete']}
                onClick={confirmDeleteUser}
              >
                <i className="bi bi-trash"></i> Delete Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay - Only show for non-delete operations */}
      {isLoading && !showDeleteConfirmation && (
        <div className={styles['popup-overlay']}>
          <div className={styles['loader-container']}>
            <div className={styles.loader}></div>
            <p>Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
