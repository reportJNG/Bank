import React, { useState, useEffect, useRef } from 'react';
import './Reports.css';
import logo from '../Pictures/ASBA.png';
// Import React Icons
import { 
  FaArrowLeft, 
  FaSearch, 
  FaDownload, 
  FaSpinner, 
  FaFilePdf, 
  FaFileExcel, 
  FaFileCsv,
  FaChartPie,
  FaUsers,
  FaExclamationTriangle,
  FaComments,
  FaUserFriends,
  FaExclamationCircle,
  FaBell,
  FaEllipsisV,
  FaFilter
} from 'react-icons/fa';

// Declare Chart type for TypeScript
declare global {
  interface Window {
    Chart: any;
  }
}

interface ReportsProps {
  onNavigate: (page: 'signin' | 'welcome' | 'home' | 'discover' | 'reports') => void;
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
  phoneNumber: string;
  address: string;
  notes: string;
}

interface DashboardData {
  clients: {
    total_clients: number;
    individual: number;
    business: number;
    domiciled: number;
    non_domiciled: number;
  };
  reclamations: {
    total: number;
    processed: number;
    unprocessed: number;
    by_email: number;
    by_phone: number;
    by_social: number;
  };
  rappels: number;
  agencies: number;
}

interface ChartData {
  monthly: { month: string; count: number }[];
  agencyDistribution: { agency: string; count: number }[];
  reclamationTypes: { type: string; count: number }[];
}

const Reports: React.FC<ReportsProps> = ({ onNavigate }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    clients: {
      total_clients: 0,
      individual: 0,
      business: 0,
      domiciled: 0,
      non_domiciled: 0
    },
    reclamations: {
      total: 0,
      processed: 0,
      unprocessed: 0,
      by_email: 0,
      by_phone: 0,
      by_social: 0
    },
    rappels: 0,
    agencies: 0
  });
  
  const [chartData, setChartData] = useState<ChartData>({
    monthly: [],
    agencyDistribution: [],
    reclamationTypes: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'reclamations' | 'communications'>('overview');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  const monthlyChartRef = useRef<any>(null);
  const agencyChartRef = useRef<any>(null);
  const typeChartRef = useRef<any>(null);

  useEffect(() => {
    // Load users from localStorage
    const loadUsers = () => {
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        const users: User[] = JSON.parse(savedUsers);
        
        // Calculate dashboard data
        const totalClients = users.length;
        const individual = users.filter(user => user.type === 'Individual').length;
        const business = users.filter(user => user.type === 'Corporate').length;
        const domiciled = users.filter(user => user.category === 'Personal').length;
        const nonDomiciled = users.filter(user => user.category === 'Business').length;
        
        // Calculate reclamation data
        const totalReclamations = users.filter(user => user.reclamation !== 'None').length;
        const processed = users.filter(user => user.reclamation !== 'None' && user.status === 'Active').length;
        const unprocessed = totalReclamations - processed;
        
        // Simulate communication methods
        const byEmail = Math.floor(totalReclamations * 0.6);
        const byPhone = Math.floor(totalReclamations * 0.3);
        const bySocial = totalReclamations - byEmail - byPhone;
        
        // Simulate rappels (reminders)
        const rappels = Math.floor(totalClients * 0.3);
        
        // Simulate agencies
        const agencies = 5;
        
        // Set dashboard data
        setDashboardData({
          clients: {
            total_clients: totalClients,
            individual,
            business,
            domiciled,
            non_domiciled: nonDomiciled
          },
          reclamations: {
            total: totalReclamations,
            processed,
            unprocessed,
            by_email: byEmail,
            by_phone: byPhone,
            by_social: bySocial
          },
          rappels,
          agencies
        });
        
        // Generate monthly data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const monthlyCounts = months.map((month, index) => {
          // Generate random counts with a trend
          const baseCount = Math.floor(totalReclamations / 12);
          const randomFactor = Math.random() * 0.5 + 0.75; // Random between 0.75 and 1.25
          const seasonalFactor = index === currentMonth ? 1.5 : 1; // Higher for current month
          return {
            month,
            count: Math.floor(baseCount * randomFactor * seasonalFactor)
          };
        });
        
        // Generate agency distribution data
        const agencyNames = ['Central', 'North', 'South', 'East', 'West'];
        const agencyCounts = agencyNames.map(agency => ({
          agency,
          count: Math.floor(Math.random() * totalClients * 0.3) + Math.floor(totalClients * 0.1)
        }));
        
        // Generate reclamation types data
        const reclamationTypes = [
          { type: 'Service Issue', count: Math.floor(totalReclamations * 0.4) },
          { type: 'Technical Problem', count: Math.floor(totalReclamations * 0.25) },
          { type: 'Billing Dispute', count: Math.floor(totalReclamations * 0.2) },
          { type: 'Account Access', count: Math.floor(totalReclamations * 0.15) }
        ];
        
        setChartData({
          monthly: monthlyCounts,
          agencyDistribution: agencyCounts,
          reclamationTypes
        });
      }
      
      setIsLoading(false);
    };
    
    loadUsers();
  }, []);

  useEffect(() => {
    // Initialize Chart.js when component mounts
    const initCharts = () => {
      if (!chartData.monthly.length) return;
      
      // Monthly Chart
      const monthlyCtx = document.getElementById('monthlyChart') as HTMLCanvasElement;
      if (monthlyCtx) {
        const monthlyGradient = monthlyCtx.getContext('2d')?.createLinearGradient(0, 0, 0, 400);
        if (monthlyGradient) {
          monthlyGradient.addColorStop(0, 'rgba(74, 144, 226, 0.2)');
          monthlyGradient.addColorStop(1, 'rgba(74, 144, 226, 0.01)');
        }
        
        monthlyChartRef.current = new window.Chart(monthlyCtx, {
          type: 'line',
          data: {
            labels: chartData.monthly.map(item => item.month),
            datasets: [{
              label: 'Reclamations',
              data: chartData.monthly.map(item => item.count),
              borderColor: '#4a90e2',
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: '#fff',
              tension: 0.4,
              fill: true,
              backgroundColor: monthlyGradient
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: '#fff' } },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#4a90e2',
                borderWidth: 1,
                padding: 10,
                displayColors: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#94a3b8' }
              },
              x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
              }
            }
          }
        });
      }
      
      // Agency Distribution Chart
      const agencyCtx = document.getElementById('agencyChart') as HTMLCanvasElement;
      if (agencyCtx) {
        const agencyColors = ['#4a90e2', '#50e3c2', '#f5a623', '#d0021b', '#9013fe'];
        
        agencyChartRef.current = new window.Chart(agencyCtx, {
          type: 'doughnut',
          data: {
            labels: chartData.agencyDistribution.map(item => item.agency),
            datasets: [{
              data: chartData.agencyDistribution.map(item => item.count),
              backgroundColor: agencyColors,
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                position: 'right',
                labels: { color: '#fff' }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#4a90e2',
                borderWidth: 1,
                padding: 10
              }
            }
          }
        });
      }
      
      // Reclamation Types Chart
      const typeCtx = document.getElementById('typeChart') as HTMLCanvasElement;
      if (typeCtx) {
        const typeColors = ['#4a90e2', '#50e3c2', '#f5a623', '#d0021b'];
        
        typeChartRef.current = new window.Chart(typeCtx, {
          type: 'bar',
          data: {
            labels: chartData.reclamationTypes.map(item => item.type),
            datasets: [{
              label: 'Count',
              data: chartData.reclamationTypes.map(item => item.count),
              backgroundColor: typeColors,
              borderWidth: 0,
              borderRadius: 5
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#4a90e2',
                borderWidth: 1,
                padding: 10
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#94a3b8' }
              },
              x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
              }
            }
          }
        });
      }
    };
    
    if (!isLoading && chartData.monthly.length > 0) {
      // Load Chart.js dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.0.1/chart.umd.min.js';
      script.onload = initCharts;
      document.head.appendChild(script);
      
      return () => {
        if (monthlyChartRef.current) monthlyChartRef.current.destroy();
        if (agencyChartRef.current) agencyChartRef.current.destroy();
        if (typeChartRef.current) typeChartRef.current.destroy();
        document.head.removeChild(script);
      };
    }
  }, [isLoading, chartData]);

  // Function to convert chart to image
  const chartToImage = (chartRef: any): string => {
    if (!chartRef || !chartRef.current) return '';
    return chartRef.current.toBase64Image();
  };

  // Function to create CSV content
  const createCSV = (): string => {
    const headers = ['Category', 'Metric', 'Value'];
    const rows = [
      // Client data
      ['Clients', 'Total Clients', dashboardData.clients.total_clients.toString()],
      ['Clients', 'Individual', dashboardData.clients.individual.toString()],
      ['Clients', 'Business', dashboardData.clients.business.toString()],
      ['Clients', 'Domiciled', dashboardData.clients.domiciled.toString()],
      ['Clients', 'Non-Domiciled', dashboardData.clients.non_domiciled.toString()],
      // Reclamation data
      ['Reclamations', 'Total', dashboardData.reclamations.total.toString()],
      ['Reclamations', 'Processed', dashboardData.reclamations.processed.toString()],
      ['Reclamations', 'Unprocessed', dashboardData.reclamations.unprocessed.toString()],
      ['Reclamations', 'By Email', dashboardData.reclamations.by_email.toString()],
      ['Reclamations', 'By Phone', dashboardData.reclamations.by_phone.toString()],
      ['Reclamations', 'By Social', dashboardData.reclamations.by_social.toString()],
      // Other data
      ['Other', 'Rappels', dashboardData.rappels.toString()],
      ['Other', 'Agencies', dashboardData.agencies.toString()],
      // Monthly data
      ...chartData.monthly.map(item => ['Monthly', item.month, item.count.toString()]),
      // Agency distribution
      ...chartData.agencyDistribution.map(item => ['Agency', item.agency, item.count.toString()]),
      // Reclamation types
      ...chartData.reclamationTypes.map(item => ['Reclamation Type', item.type, item.count.toString()])
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // Function to create Excel content (simplified as CSV)
  const createExcel = (): string => {
    return createCSV();
  };

  // Function to create PDF content
  const createPDF = async (): Promise<Blob> => {
    // In a real implementation, we would use a library like jsPDF
    // For this example, we'll create a simple text representation
    
    // Get chart images
    const monthlyChartImage = chartToImage(monthlyChartRef);
    const agencyChartImage = chartToImage(agencyChartRef);
    const typeChartImage = chartToImage(typeChartRef);
    
    // Create a simple HTML representation
    const htmlContent = `
      <html>
        <head>
          <title>AL-SALAM Bank Reports</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1, h2 { color: #4a90e2; }
            .chart-container { margin: 20px 0; text-align: center; }
            .chart-container img { max-width: 100%; }
          </style>
        </head>
        <body>
          <h1>AL-SALAM Bank Reports</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          
          <h2>Client Statistics</h2>
          <table>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Total Clients</td>
              <td>${dashboardData.clients.total_clients}</td>
            </tr>
            <tr>
              <td>Individual</td>
              <td>${dashboardData.clients.individual}</td>
            </tr>
            <tr>
              <td>Business</td>
              <td>${dashboardData.clients.business}</td>
            </tr>
            <tr>
              <td>Domiciled</td>
              <td>${dashboardData.clients.domiciled}</td>
            </tr>
            <tr>
              <td>Non-Domiciled</td>
              <td>${dashboardData.clients.non_domiciled}</td>
            </tr>
          </table>
          
          <h2>Reclamation Statistics</h2>
          <table>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Total Reclamations</td>
              <td>${dashboardData.reclamations.total}</td>
            </tr>
            <tr>
              <td>Processed</td>
              <td>${dashboardData.reclamations.processed}</td>
            </tr>
            <tr>
              <td>Unprocessed</td>
              <td>${dashboardData.reclamations.unprocessed}</td>
            </tr>
            <tr>
              <td>By Email</td>
              <td>${dashboardData.reclamations.by_email}</td>
            </tr>
            <tr>
              <td>By Phone</td>
              <td>${dashboardData.reclamations.by_phone}</td>
            </tr>
            <tr>
              <td>By Social</td>
              <td>${dashboardData.reclamations.by_social}</td>
            </tr>
          </table>
          
          <h2>Monthly Reclamations</h2>
          <div class="chart-container">
            ${monthlyChartImage ? `<img src="${monthlyChartImage}" alt="Monthly Reclamations Chart" />` : 'Chart not available'}
          </div>
          
          <h2>Agency Distribution</h2>
          <div class="chart-container">
            ${agencyChartImage ? `<img src="${agencyChartImage}" alt="Agency Distribution Chart" />` : 'Chart not available'}
          </div>
          
          <h2>Reclamation Types</h2>
          <div class="chart-container">
            ${typeChartImage ? `<img src="${typeChartImage}" alt="Reclamation Types Chart" />` : 'Chart not available'}
          </div>
        </body>
      </html>
    `;
    
    // In a real implementation, we would use a library like jsPDF to convert HTML to PDF
    // For this example, we'll return a simple text blob
    return new Blob([htmlContent], { type: 'text/html' });
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setExportLoading(true);
    setShowExportMenu(false);
    
    try {
      let blob: Blob;
      let filename: string;
      let mimeType: string;
      
      switch (format) {
        case 'pdf':
          blob = await createPDF();
          filename = `AL-SALAM-Bank-Reports-${new Date().toISOString().split('T')[0]}.html`;
          mimeType = 'text/html';
          break;
        case 'excel':
          blob = new Blob([createExcel()], { type: 'text/csv' });
          filename = `AL-SALAM-Bank-Reports-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
        case 'csv':
          blob = new Blob([createCSV()], { type: 'text/csv' });
          filename = `AL-SALAM-Bank-Reports-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
        default:
          throw new Error('Unsupported format');
      }
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.setAttribute('type', 'hidden');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      showToast(`Data exported as ${format.toUpperCase()} successfully!`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast(`Failed to export data as ${format.toUpperCase()}. Please try again.`, 'error');
    } finally {
      setExportLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 2000);
    }, 100);
  };

  const handleDateRangeChange = (range: 'week' | 'month' | 'quarter' | 'year') => {
    setDateRange(range);
    // In a real app, this would filter the data based on the date range
    console.log(`Date range changed to ${range}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // In a real app, this would filter the data based on the search term
    console.log(`Searching for: ${e.target.value}`);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="header-left">
          <button 
            className="back-button"
            onClick={() => onNavigate('home')}
          >
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
          <h1>AL-SALAM Bank</h1>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchTerm}
              onChange={handleSearch}
            />
            <i className="fas fa-search"></i>
          </div>
          <div className="export-container">
            <button 
              className="export-button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-download"></i>
              )} Export
            </button>
            {showExportMenu && (
              <div className="export-menu">
                <button onClick={() => handleExport('pdf')}>
                  <i className="fas fa-file-pdf"></i> PDF
                </button>
                <button onClick={() => handleExport('excel')}>
                  <i className="fas fa-file-excel"></i> Excel
                </button>
                <button onClick={() => handleExport('csv')}>
                  <i className="fas fa-file-csv"></i> CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="reports-content">
        <div className="reports-sidebar">
          <div className="date-range-selector">
            <h3><i className="fas fa-filter"></i> Date Range</h3>
            <div className="date-buttons">
              <button 
                className={dateRange === 'week' ? 'active' : ''} 
                onClick={() => handleDateRangeChange('week')}
              >
                Week
              </button>
              <button 
                className={dateRange === 'month' ? 'active' : ''} 
                onClick={() => handleDateRangeChange('month')}
              >
                Month
              </button>
              <button 
                className={dateRange === 'quarter' ? 'active' : ''} 
                onClick={() => handleDateRangeChange('quarter')}
              >
                Quarter
              </button>
              <button 
                className={dateRange === 'year' ? 'active' : ''} 
                onClick={() => handleDateRangeChange('year')}
              >
                Year
              </button>
            </div>
          </div>
          
          <div className="reports-nav">
            <h3>Reports</h3>
            <ul>
              <li 
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-chart-pie"></i> Overview
              </li>
              <li 
                className={activeTab === 'clients' ? 'active' : ''}
                onClick={() => setActiveTab('clients')}
              >
                <i className="fas fa-users"></i> Clients
              </li>
              <li 
                className={activeTab === 'reclamations' ? 'active' : ''}
                onClick={() => setActiveTab('reclamations')}
              >
                <i className="fas fa-exclamation-triangle"></i> Reclamations
              </li>
              <li 
                className={activeTab === 'communications' ? 'active' : ''}
                onClick={() => setActiveTab('communications')}
              >
                <i className="fas fa-comments"></i> Communications
              </li>
            </ul>
          </div>
          
          <div className="quick-stats">
            <h3>Quick Stats</h3>
            <div className="quick-stat">
              <div className="quick-stat-icon">
                <i className="fas fa-user-friends"></i>
              </div>
              <div className="quick-stat-info">
                <span className="quick-stat-label">Total Clients</span>
                <span className="quick-stat-value">{dashboardData.clients.total_clients.toLocaleString()}</span>
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="quick-stat-info">
                <span className="quick-stat-label">Total Reclamations</span>
                <span className="quick-stat-value">{dashboardData.reclamations.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon">
                <i className="fas fa-bell"></i>
              </div>
              <div className="quick-stat-info">
                <span className="quick-stat-label">Rappels</span>
                <span className="quick-stat-value">{dashboardData.rappels.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="reports-main">
          {isLoading ? (
            <div className="loader-container">
              <div className="loader"></div>
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="overview-header">
                    <h2><i className="fas fa-chart-pie"></i> Dashboard Overview</h2>
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                  </div>
                  
                  <div className="overview-cards">
                    <div className="overview-card">
                      <div className="overview-card-icon clients">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="overview-card-content">
                        <h3><i className="fas fa-users"></i> Clients</h3>
                        <div className="overview-card-stats">
                          <div className="overview-stat">
                            <span className="overview-stat-label">Total</span>
                            <span className="overview-stat-value">{dashboardData.clients.total_clients.toLocaleString()}</span>
                          </div>
                          <div className="overview-stat">
                            <span className="overview-stat-label">Individual</span>
                            <span className="overview-stat-value">{dashboardData.clients.individual.toLocaleString()}</span>
                          </div>
                          <div className="overview-stat">
                            <span className="overview-stat-label">Business</span>
                            <span className="overview-stat-value">{dashboardData.clients.business.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="overview-card">
                      <div className="overview-card-icon reclamations">
                        <i className="fas fa-exclamation-triangle"></i>
                      </div>
                      <div className="overview-card-content">
                        <h3><i className="fas fa-exclamation-triangle"></i> Reclamations</h3>
                        <div className="overview-card-stats">
                          <div className="overview-stat">
                            <span className="overview-stat-label">Total</span>
                            <span className="overview-stat-value">{dashboardData.reclamations.total.toLocaleString()}</span>
                          </div>
                          <div className="overview-stat">
                            <span className="overview-stat-label">Processed</span>
                            <span className="overview-stat-value">{dashboardData.reclamations.processed.toLocaleString()}</span>
                          </div>
                          <div className="overview-stat">
                            <span className="overview-stat-label">Pending</span>
                            <span className="overview-stat-value">{dashboardData.reclamations.unprocessed.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="overview-card">
                      <div className="overview-card-icon communications">
                        <i className="fas fa-comments"></i>
                      </div>
                      <div className="overview-card-content">
                        <h3><i className="fas fa-comments"></i> Communications</h3>
                        <div className="overview-card-stats">
                          <div className="overview-stat">
                            <span className="overview-stat-label">Rappels</span>
                            <span className="overview-stat-value">{dashboardData.rappels.toLocaleString()}</span>
                          </div>
                          <div className="overview-stat">
                            <span className="overview-stat-label">Email</span>
                            <span className="overview-stat-value">{dashboardData.reclamations.by_email.toLocaleString()}</span>
                          </div>
                          <div className="overview-stat">
                            <span className="overview-stat-label">Phone</span>
                            <span className="overview-stat-value">{dashboardData.reclamations.by_phone.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overview-charts">
                    <div className="chart-card">
                      <div className="chart-header">
                        <h3>Monthly Reclamations</h3>
                        <div className="chart-actions">
                          <button className="chart-action">
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                        </div>
                      </div>
                      <div className="chart-container">
                        <canvas id="monthlyChart"></canvas>
                      </div>
                    </div>
                    
                    <div className="chart-card">
                      <div className="chart-header">
                        <h3>Agency Distribution</h3>
                        <div className="chart-actions">
                          <button className="chart-action">
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                        </div>
                      </div>
                      <div className="chart-container">
                        <canvas id="agencyChart"></canvas>
                      </div>
                    </div>
                  </div>
                  
                  <div className="chart-card full-width">
                    <div className="chart-header">
                      <h3>Reclamation Types</h3>
                      <div className="chart-actions">
                        <button className="chart-action">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                      </div>
                    </div>
                    <div className="chart-container">
                      <canvas id="typeChart"></canvas>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'clients' && (
                <div className="clients-tab">
                  <h2><i className="fas fa-users"></i> Client Analytics</h2>
                  <p>Detailed client statistics and demographics</p>
                  
                  <div className="clients-stats">
                    <div className="stat-card">
                      <div className="stat-card-header">
                        <h3>Client Types</h3>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-row">
                          <div className="stat-label">Individual</div>
                          <div className="stat-bar-container">
                            <div 
                              className="stat-bar" 
                              style={{ 
                                width: `${(dashboardData.clients.individual / dashboardData.clients.total_clients) * 100}%`,
                                backgroundColor: '#4a90e2'
                              }}
                            ></div>
                          </div>
                          <div className="stat-value">{dashboardData.clients.individual.toLocaleString()}</div>
                        </div>
                        <div className="stat-row">
                          <div className="stat-label">Business</div>
                          <div className="stat-bar-container">
                            <div 
                              className="stat-bar" 
                              style={{ 
                                width: `${(dashboardData.clients.business / dashboardData.clients.total_clients) * 100}%`,
                                backgroundColor: '#50e3c2'
                              }}
                            ></div>
                          </div>
                          <div className="stat-value">{dashboardData.clients.business.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-card-header">
                        <h3>Client Categories</h3>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-row">
                          <div className="stat-label">Domiciled</div>
                          <div className="stat-bar-container">
                            <div 
                              className="stat-bar" 
                              style={{ 
                                width: `${(dashboardData.clients.domiciled / dashboardData.clients.total_clients) * 100}%`,
                                backgroundColor: '#f5a623'
                              }}
                            ></div>
                          </div>
                          <div className="stat-value">{dashboardData.clients.domiciled.toLocaleString()}</div>
                        </div>
                        <div className="stat-row">
                          <div className="stat-label">Non-Domiciled</div>
                          <div className="stat-bar-container">
                            <div 
                              className="stat-bar" 
                              style={{ 
                                width: `${(dashboardData.clients.non_domiciled / dashboardData.clients.total_clients) * 100}%`,
                                backgroundColor: '#d0021b'
                              }}
                            ></div>
                          </div>
                          <div className="stat-value">{dashboardData.clients.non_domiciled.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="chart-card full-width">
                    <div className="chart-header">
                      <h3>Agency Distribution</h3>
                    </div>
                    <div className="chart-container">
                      <canvas id="agencyChart"></canvas>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'reclamations' && (
                <div className="reclamations-tab">
                  <h2><i className="fas fa-exclamation-triangle"></i> Reclamation Analytics</h2>
                  <p>Detailed reclamation statistics and trends</p>
                  
                  <div className="reclamations-stats">
                    <div className="stat-card">
                      <div className="stat-card-header">
                        <h3>Reclamation Status</h3>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-row">
                          <div className="stat-label">Processed</div>
                          <div className="stat-bar-container">
                            <div 
                              className="stat-bar" 
                              style={{ 
                                width: `${(dashboardData.reclamations.processed / dashboardData.reclamations.total) * 100}%`,
                                backgroundColor: '#4a90e2'
                              }}
                            ></div>
                          </div>
                          <div className="stat-value">{dashboardData.reclamations.processed.toLocaleString()}</div>
                        </div>
                        <div className="stat-row">
                          <div className="stat-label">Pending</div>
                          <div className="stat-bar-container">
                            <div 
                              className="stat-bar" 
                              style={{ 
                                width: `${(dashboardData.reclamations.unprocessed / dashboardData.reclamations.total) * 100}%`,
                                backgroundColor: '#f5a623'
                              }}
                            ></div>
                          </div>
                          <div className="stat-value">{dashboardData.reclamations.unprocessed.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-card-header">
                        <h3>Communication Methods</h3>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-row">
                          <div className="stat-label">Email</div>
                          <div className="stat-bar-container">
                            <div 
                              className="stat-bar" 
                              style={{ 
                                width: `${(dashboardData.reclamations.by_email / dashboardData.reclamations.total) * 100}%`,
                                backgroundColor: '#50e3c2'
                              }}
                            ></div>
                          </div>
                          <div className="stat-value">{dashboardData.reclamations.by_email.toLocaleString()}</div>
                        </div>
                        <div className="stat-row">
                          <div className="stat-label">Phone</div>
                          <div className="stat-bar-container">
                            <div 
                              className="stat-bar" 
                              style={{ 
                                width: `${(dashboardData.reclamations.by_phone / dashboardData.reclamations.total) * 100}%`,
                                backgroundColor: '#d0021b'
                              }}
                            ></div>
                          </div>
                          <div className="stat-value">{dashboardData.reclamations.by_phone.toLocaleString()}</div>
                        </div>
                        <div className="stat-row">
                          <div className="stat-label">Social Media</div>
                          <div className="stat-bar-container">
                            <div 
                              className="stat-bar" 
                              style={{ 
                                width: `${(dashboardData.reclamations.by_social / dashboardData.reclamations.total) * 100}%`,
                                backgroundColor: '#9013fe'
                              }}
                            ></div>
                          </div>
                          <div className="stat-value">{dashboardData.reclamations.by_social.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="chart-card full-width">
                    <div className="chart-header">
                      <h3>Monthly Reclamations</h3>
                    </div>
                    <div className="chart-container">
                      <canvas id="monthlyChart"></canvas>
                    </div>
                  </div>
                  
                  <div className="chart-card full-width">
                    <div className="chart-header">
                      <h3>Reclamation Types</h3>
                    </div>
                    <div className="chart-container">
                      <canvas id="typeChart"></canvas>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'communications' && (
                <div className="communications-tab">
                  <h2><i className="fas fa-comments"></i> Communication Analytics</h2>
                  <p>Detailed communication statistics and trends</p>
                  
                  <div className="communications-stats">
                    <div className="stat-card">
                      <div className="stat-card-header">
                        <h3>Communication Channels</h3>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-row">
                          <div className="stat-label">Email</div>
                          <div className="stat-bar-container">
                            <div 
                              className="stat-bar" 
                              style={{ 
                                width: `${(dashboardData.reclamations.by_email / dashboardData.reclamations.total) * 100}%`,
                                backgroundColor: '#4a90e2'
                              }}
                            ></div>
                          </div>
                          <div className="stat-value">{dashboardData.reclamations.by_email.toLocaleString()}</div>
                        </div>
                        <div className="stat-row">
                          <div className="stat-label">Phone</div>
                          <div className="stat-bar-container">
                            <div 
                              className="stat-bar" 
                              style={{ 
                                width: `${(dashboardData.reclamations.by_phone / dashboardData.reclamations.total) * 100}%`,
                                backgroundColor: '#50e3c2'
                              }}
                            ></div>
                          </div>
                          <div className="stat-value">{dashboardData.reclamations.by_phone.toLocaleString()}</div>
                        </div>
                        <div className="stat-row">
                          <div className="stat-label">Social Media</div>
                          <div className="stat-bar-container">
                            <div 
                              className="stat-bar" 
                              style={{ 
                                width: `${(dashboardData.reclamations.by_social / dashboardData.reclamations.total) * 100}%`,
                                backgroundColor: '#f5a623'
                              }}
                            ></div>
                          </div>
                          <div className="stat-value">{dashboardData.reclamations.by_social.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-card-header">
                        <h3>Rappels</h3>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-row">
                          <div className="stat-label">Total Rappels</div>
                          <div className="stat-value large">{dashboardData.rappels.toLocaleString()}</div>
                        </div>
                        <div className="stat-row">
                          <div className="stat-label">Rappels per Client</div>
                          <div className="stat-value large">
                            {(dashboardData.rappels / dashboardData.clients.total_clients).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="chart-card full-width">
                    <div className="chart-header">
                      <h3>Monthly Communications</h3>
                    </div>
                    <div className="chart-container">
                      <canvas id="monthlyChart"></canvas>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
