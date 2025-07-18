import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, 
  faSearch, 
  faXmark, 
  faUserPlus, 
  faFileAlt,
  faSpinner,
  faCheck,
  faExclamationTriangle,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faUserTag,
  faFolder,
  faBuilding,
  faClipboardList,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import styles from './Services.module.css';

interface ServicesProps {
  onNavigate: (page: 'signin' | 'welcome' | 'home' | 'discover' | 'reports' | 'services') => void;
}

interface Client {
  codeCL: string;
  nom: string;
  prenom: string;
  residence?: string;
  adresse?: string;
  date_naiss?: string;
}

interface TypeClient {
  codeTC: string;
  designationTC: string;
}

interface Categorie {
  codeC: string;
  designation: string;
}

interface Agence {
  nomAG: string;
}

interface Reclamation {
  designation: string;
}

interface EtatReclamation {
  code_ER: string;
  designation: string;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }): JSX.Element => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showSearchForm, setShowSearchForm] = useState<boolean>(false);
  const [showReclamationForm, setShowReclamationForm] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [clientData, setClientData] = useState<Client | null>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [typeClientOptions, setTypeClientOptions] = useState<TypeClient[]>([]);
  const [categorieOptions, setCategorieOptions] = useState<Categorie[]>([]);
  const [agenceOptions, setAgenceOptions] = useState<Agence[]>([]);
  const [reclamationOptions, setReclamationOptions] = useState<Reclamation[]>([]);
  const [etatOptions, setEtatOptions] = useState<EtatReclamation[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [typeClientRes, categorieRes, agenceRes, reclamationRes, etatRes] = await Promise.all([
          axios.get('/api/type-clients'),
          axios.get('/api/categories'),
          axios.get('/api/agences'),
          axios.get('/api/reclamations'),
          axios.get('/api/etat-reclamations')
        ]);

        setTypeClientOptions(typeClientRes.data);
        setCategorieOptions(categorieRes.data);
        setAgenceOptions(agenceRes.data);
        setReclamationOptions(reclamationRes.data);
        setEtatOptions(etatRes.data);
      } catch (error) {
        console.error('Error fetching options:', error);
        showTimedPopup('Error loading form options', false);
      }
    };

    fetchOptions();
  }, []);

  const handleNavigation = (page: 'signin' | 'welcome' | 'home' | 'discover' | 'reports' | 'services') => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const showTimedPopup = (msg: string, success: boolean) => {
    setMessage(msg);
    setIsSuccess(success);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const handleSearch = async () => {
    if (!phoneNumber.match(/^\d{10}$/)) {
      showTimedPopup('Please enter a valid 10-digit phone number', false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/search-client', { phoneNumber });
      setClientData(response.data);
      showTimedPopup('Client found successfully!', true);
    } catch (error) {
      showTimedPopup('Client not found!', false);
      setClientData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const clientData = Object.fromEntries(formData.entries());
    
    try {
      await axios.post('/api/add-client', clientData);
      showTimedPopup('Client added successfully!', true);
      setShowAddForm(false);
    } catch (error) {
      showTimedPopup('Error adding client!', false);
    }
  };

  const handleReclamationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reclamationData = Object.fromEntries(formData.entries());
    
    try {
      await axios.post('/api/add-reclamation', reclamationData);
      showTimedPopup('Reclamation added successfully!', true);
      setShowReclamationForm(false);
    } catch (error) {
      showTimedPopup('Error adding reclamation!', false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.homeButton}
          onClick={() => handleNavigation('home')}
          aria-label="Go to home"
        >
          <FontAwesomeIcon icon={faHouse} />
        </button>
        <button 
          className={styles.searchButton}
          onClick={() => setShowSearchForm(true)}
          aria-label="Search client"
        >
          <FontAwesomeIcon icon={faSearch} />
          Search Client
        </button>
      </div>

      <div className={styles.mainActions}>
        <div 
          className={styles.actionCard}
          onClick={() => setShowAddForm(true)}
        >
          <FontAwesomeIcon icon={faUserPlus} />
          <h3>Add New Client</h3>
        </div>

        <div 
          className={styles.actionCard}
          onClick={() => setShowReclamationForm(true)}
        >
          <FontAwesomeIcon icon={faFileAlt} />
          <h3>Submit Complaint</h3>
        </div>
      </div>

      {showAddForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Add New Client</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowAddForm(false)}
                aria-label="Close form"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <form onSubmit={handleAddClient} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="codeCL"
                  placeholder="Enter 10-digit phone number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="nom"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="prenom"
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="residence">Residence</label>
                <input
                  type="text"
                  id="residence"
                  name="residence"
                  placeholder="Enter residence"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="adresse"
                  placeholder="Enter email address"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="birthDate">Birth Date</label>
                <input
                  type="date"
                  id="birthDate"
                  name="date_naiss"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="clientType">Client Type</label>
                <select id="clientType" name="codeTC" required>
                  <option value="">Select client type</option>
                  {typeClientOptions.map(option => (
                    <option key={option.codeTC} value={option.codeTC}>
                      {option.designationTC}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="category">Category</label>
                <select id="category" name="codeC" required>
                  <option value="">Select category</option>
                  {categorieOptions.map(option => (
                    <option key={option.codeC} value={option.codeC}>
                      {option.designation}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSearchForm && (
        <div className={styles.searchModal}>
          <div className={styles.searchHeader}>
            <h2>Search Client</h2>
            <button 
              className={styles.closeButton}
              onClick={() => setShowSearchForm(false)}
              aria-label="Close search"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div className={styles.searchInput}>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              pattern="[0-9]{10}"
              required
            />
          </div>
          <button 
            className={styles.submitButton}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <>
                <FontAwesomeIcon icon={faSearch} />
                Search
              </>
            )}
          </button>
          {clientData && (
            <div className={styles.searchResults}>
              <div className={styles.clientCard}>
                <div className={styles.clientInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Name:</span>
                    <span className={styles.infoValue}>{clientData.nom} {clientData.prenom}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Phone:</span>
                    <span className={styles.infoValue}>{clientData.codeCL}</span>
                  </div>
                  {clientData.residence && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Residence:</span>
                      <span className={styles.infoValue}>{clientData.residence}</span>
                    </div>
                  )}
                  {clientData.adresse && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Email:</span>
                      <span className={styles.infoValue}>{clientData.adresse}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showReclamationForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Submit Complaint</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowReclamationForm(false)}
                aria-label="Close form"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <form onSubmit={handleReclamationSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="clientName">Client Name</label>
                <input
                  type="text"
                  id="clientName"
                  value={clientData ? `${clientData.nom} ${clientData.prenom}` : ''}
                  readOnly
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="complaintType">Complaint Type</label>
                <select id="complaintType" name="designation" required>
                  <option value="">Select complaint type</option>
                  {reclamationOptions.map(option => (
                    <option key={option.designation} value={option.designation}>
                      {option.designation}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="agency">Agency</label>
                <select id="agency" name="nomAG" required>
                  <option value="">Select agency</option>
                  {agenceOptions.map(option => (
                    <option key={option.nomAG} value={option.nomAG}>
                      {option.nomAG}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="status">Status</label>
                <select id="status" name="code_ER" required>
                  <option value="">Select status</option>
                  {etatOptions.map(option => (
                    <option key={option.code_ER} value={option.code_ER}>
                      {option.designation}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter complaint description"
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowReclamationForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMessage && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <FontAwesomeIcon 
                icon={isSuccess ? faCheck : faExclamationTriangle} 
                style={{ color: isSuccess ? '#48bb78' : '#e53e3e' }}
              />
              <h2>{message}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
