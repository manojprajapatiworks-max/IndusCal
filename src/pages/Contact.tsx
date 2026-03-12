import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Contact() {
  const location = useLocation();
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: 'Calibration',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!settings) return;
    const params = new URLSearchParams(location.search);
    const service = params.get('service');
    if (service) {
      const capitalized = service.charAt(0).toUpperCase() + service.slice(1);
      const categoryNames = settings.categories.map(c => c.name);
      if (categoryNames.includes(capitalized)) {
        setFormData(prev => ({ ...prev, serviceType: capitalized }));
      }
    }
  }, [location, settings]);

  if (!settings) return null;
  const { contact, categories } = settings;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', company: '', serviceType: categories[0]?.name || 'Other', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Request a Quote</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Fill out the form below and our team will get back to you with a detailed quotation within 24 hours.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Info */}
          <div className="lg:w-1/3 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 mr-4">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Our Location</h4>
                    <p className="text-slate-600 mt-1">{contact.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 mr-4">
                    <Phone className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Phone Number</h4>
                    <p className="text-slate-600 mt-1">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 mr-4">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Email Address</h4>
                    <p className="text-slate-600 mt-1">{contact.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:w-2/3">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              {status === 'success' ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted!</h3>
                  <p className="text-slate-600">Thank you for reaching out. We have received your request and will contact you shortly.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                        placeholder="Acme Corp"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-slate-700 mb-2">Service Required *</label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      required
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all bg-white"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message / Instrument Details *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Please provide details about the instruments, part numbers, or specific issues..."
                    ></textarea>
                  </div>

                  {status === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                      There was an error submitting your request. Please try again or contact us directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center justify-center"
                  >
                    {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
