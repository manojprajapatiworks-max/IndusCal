import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, LogOut, Search, Filter, ChevronDown, CheckCircle, Clock, XCircle, LayoutDashboard, Image, Phone, List, Wrench } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface Request {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  service_type: string;
  message: string;
  status: string;
  created_at: string;
}

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('requests');
  
  const { settings, refreshSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRequests(requests.map(req => 
          req.id === id ? { ...req, status: newStatus } : req
        ));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localSettings),
      });
      if (response.ok) {
        await refreshSettings();
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save settings', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'All' || req.status === filter;
    const matchesSearch = 
      req.name.toLowerCase().includes(search.toLowerCase()) ||
      req.company.toLowerCase().includes(search.toLowerCase()) ||
      req.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
      case 'In Progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Settings className="w-3 h-3 mr-1" /> In Progress</span>;
      case 'Completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3 mr-1" /> Completed</span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  if (!localSettings) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold">IndusCal Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm text-slate-300 hover:text-white transition-colors">View Site</Link>
            <button 
              onClick={handleLogout}
              className="flex items-center text-sm text-slate-300 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'requests' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" /> Quotations
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'hero' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <Image className="w-5 h-5 mr-3" /> Hero Section
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'contact' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <Phone className="w-5 h-5 mr-3" /> Contact Info
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'categories' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <List className="w-5 h-5 mr-3" /> Categories
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'services' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <Wrench className="w-5 h-5 mr-3" /> Services
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'requests' && (
            <div>
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Quotations & Requests</h1>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full sm:w-64"
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none bg-white"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client Info</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            Loading requests...
                          </td>
                        </tr>
                      ) : filteredRequests.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            No requests found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {new Date(req.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-slate-900">{req.name}</div>
                              <div className="text-sm text-slate-500">{req.company || 'No Company'}</div>
                              <div className="text-xs text-slate-400 mt-1">{req.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-slate-900 font-medium">{req.service_type}</div>
                              <div className="text-sm text-slate-500 truncate max-w-xs mt-1" title={req.message}>
                                {req.message}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(req.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <select
                                value={req.status}
                                onChange={(e) => updateStatus(req.id, e.target.value)}
                                className="border border-slate-300 rounded text-sm py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Hero Section Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={localSettings.hero.title}
                    onChange={(e) => setLocalSettings({...localSettings, hero: {...localSettings.hero, title: e.target.value}})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                  <textarea 
                    value={localSettings.hero.subtitle}
                    onChange={(e) => setLocalSettings({...localSettings, hero: {...localSettings.hero, subtitle: e.target.value}})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Background Image URL</label>
                  <input 
                    type="text" 
                    value={localSettings.hero.imageUrl}
                    onChange={(e) => setLocalSettings({...localSettings, hero: {...localSettings.hero, imageUrl: e.target.value}})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>
                <button onClick={handleSaveSettings} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={localSettings.contact.phone}
                    onChange={(e) => setLocalSettings({...localSettings, contact: {...localSettings.contact, phone: e.target.value}})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="text" 
                    value={localSettings.contact.email}
                    onChange={(e) => setLocalSettings({...localSettings, contact: {...localSettings.contact, email: e.target.value}})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Physical Address</label>
                  <textarea 
                    value={localSettings.contact.address}
                    onChange={(e) => setLocalSettings({...localSettings, contact: {...localSettings.contact, address: e.target.value}})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    rows={2}
                  />
                </div>
                <button onClick={handleSaveSettings} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Categories</h2>
              <div className="space-y-6">
                {localSettings.categories.map((cat: any, index: number) => (
                  <div key={cat.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Category {index + 1}</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        value={cat.name}
                        onChange={(e) => {
                          const newCats = [...localSettings.categories];
                          newCats[index].name = e.target.value;
                          setLocalSettings({...localSettings, categories: newCats});
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Icon (Lucide React name)</label>
                      <input 
                        type="text" 
                        value={cat.icon}
                        onChange={(e) => {
                          const newCats = [...localSettings.categories];
                          newCats[index].icon = e.target.value;
                          setLocalSettings({...localSettings, categories: newCats});
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea 
                        value={cat.description}
                        onChange={(e) => {
                          const newCats = [...localSettings.categories];
                          newCats[index].description = e.target.value;
                          setLocalSettings({...localSettings, categories: newCats});
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                <button onClick={handleSaveSettings} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Services</h2>
              <div className="space-y-6">
                {localSettings.services.map((service: any, index: number) => (
                  <div key={service.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                    <h3 className="font-semibold">Service {index + 1}</h3>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                      <input 
                        type="text" 
                        value={service.title}
                        onChange={(e) => {
                          const newServices = [...localSettings.services];
                          newServices[index].title = e.target.value;
                          setLocalSettings({...localSettings, services: newServices});
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea 
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...localSettings.services];
                          newServices[index].description = e.target.value;
                          setLocalSettings({...localSettings, services: newServices});
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                      <input 
                        type="text" 
                        value={service.imageUrl}
                        onChange={(e) => {
                          const newServices = [...localSettings.services];
                          newServices[index].imageUrl = e.target.value;
                          setLocalSettings({...localSettings, services: newServices});
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Features (comma separated)</label>
                      <input 
                        type="text" 
                        value={service.features.join(', ')}
                        onChange={(e) => {
                          const newServices = [...localSettings.services];
                          newServices[index].features = e.target.value.split(',').map((f: string) => f.trim());
                          setLocalSettings({...localSettings, services: newServices});
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      />
                    </div>
                  </div>
                ))}
                <button onClick={handleSaveSettings} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
