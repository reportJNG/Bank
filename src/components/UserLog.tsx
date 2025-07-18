import React, { useState, useEffect } from 'react';
import './UserLog.css';

interface User {
  username: string;
  password: string;
  email: string;
  createdAt: string;
  banned: boolean;
}

interface UserLogProps {
  onClose: () => void;
}

const UserLog: React.FC<UserLogProps> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'ban' | 'unban'>('ban');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load users from localStorage on component mount
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('authUsers');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers);
        setFilteredUsers(parsedUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserAction = (user: User, action: 'ban' | 'unban') => {
    setSelectedUser(user);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map(user => {
      if (user.username === selectedUser.username) {
        return { ...user, banned: actionType === 'ban' };
      }
      return user;
    });

    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    localStorage.setItem('authUsers', JSON.stringify(updatedUsers));
    
    setNotification({
      message: `User ${selectedUser.username} has been ${actionType}ned successfully`,
      type: 'success'
    });
    
    setShowConfirmModal(false);
    setSelectedUser(null);
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const cancelAction = () => {
    setShowConfirmModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="user-log-container">
      <div className="user-log-header">
        <h2>User Management</h2>
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={index} className={user.banned ? 'banned' : ''}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>
                      <span className={`status-badge ${user.banned ? 'banned' : 'active'}`}>
                        {user.banned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td>
                      {user.banned ? (
                        <button 
                          className="action-button unban"
                          onClick={() => handleUserAction(user, 'unban')}
                        >
                          <i className="fas fa-user-check"></i> Unban
                        </button>
                      ) : (
                        <button 
                          className="action-button ban"
                          onClick={() => handleUserAction(user, 'ban')}
                        >
                          <i className="fas fa-user-slash"></i> Ban
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="no-results">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showConfirmModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to {actionType} user <strong>{selectedUser.username}</strong>?
            </p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={cancelAction}>Cancel</button>
              <button 
                className={`confirm-button ${actionType}`} 
                onClick={confirmAction}
              >
                Confirm {actionType === 'ban' ? 'Ban' : 'Unban'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLog; 