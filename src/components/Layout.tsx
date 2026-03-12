import { Link, Outlet } from 'react-router-dom';
import { Settings, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Layout() {
  const { settings, loading } = useSettings();

  if (loading || !settings) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const { contact } = settings;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-300 py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><Phone className="w-4 h-4 mr-2" /> {contact.phone}</span>
            <span className="flex items-center hidden sm:flex"><Mail className="w-4 h-4 mr-2" /> {contact.email}</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Settings className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold tracking-tight text-slate-900">Indus<span className="text-indigo-600">Cal</span></span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
              <Link to="/services" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Services</Link>
              <Link to="/contact" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Request Quote</Link>
            </nav>
            <div className="hidden md:flex">
              <Link to="/contact" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Settings className="w-6 h-6 text-indigo-400" />
              <span className="text-xl font-bold tracking-tight text-white">Indus<span className="text-indigo-400">Cal</span></span>
            </Link>
            <p className="text-sm leading-relaxed">
              Leading provider of industrial instrument calibration, repair, and procurement services. Ensuring precision and reliability for your operations.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors">Services</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Request Quote</Link></li>
              <li><Link to="/admin" className="hover:text-indigo-400 transition-colors">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services#calibration" className="hover:text-indigo-400 transition-colors">Instrument Calibration</Link></li>
              <li><Link to="/services#repair" className="hover:text-indigo-400 transition-colors">Equipment Repair</Link></li>
              <li><Link to="/services#procurement" className="hover:text-indigo-400 transition-colors">Parts Procurement</Link></li>
              <li><Link to="/services#certification" className="hover:text-indigo-400 transition-colors">ISO Certification</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-indigo-400 shrink-0" /> {contact.address}</li>
              <li className="flex items-center"><Phone className="w-5 h-5 mr-3 text-indigo-400 shrink-0" /> {contact.phone}</li>
              <li className="flex items-center"><Mail className="w-5 h-5 mr-3 text-indigo-400 shrink-0" /> {contact.email}</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} IndusCal Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
