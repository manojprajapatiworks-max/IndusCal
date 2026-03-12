import { ArrowRight, CheckCircle2, ShieldCheck, Wrench, PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const iconMap: Record<string, any> = {
  ShieldCheck,
  Wrench,
  PackageSearch
};

export default function Home() {
  const { settings } = useSettings();
  if (!settings) return null;

  const { hero, categories } = settings;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={hero.imageUrl} 
            alt="Industrial background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              {hero.title.split('&').map((part, i, arr) => (
                <span key={i}>
                  {i === 0 ? part : <span className="text-indigo-400">&{part}</span>}
                </span>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              {hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/contact" className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center">
                Request a Quote <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/services" className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20 flex items-center justify-center">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Industrial Solutions</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Delivering accuracy, reliability, and speed to keep your operations running smoothly without downtime.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map(category => {
              const Icon = iconMap[category.icon] || ShieldCheck;
              return (
                <div key={category.id} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{category.name}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  <Link to={`/services#${category.name.toLowerCase()}`} className="text-indigo-600 font-semibold flex items-center hover:text-indigo-700">
                    Learn more <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src="https://picsum.photos/seed/engineering/800/600" 
                alt="Engineering team" 
                className="rounded-2xl shadow-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:w-1/2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Industry Leaders Trust Us</h2>
                <p className="text-slate-600 text-lg">With over 20 years of experience, we provide unmatched technical expertise and customer service.</p>
              </div>
              
              <ul className="space-y-4">
                {[
                  'ISO/IEC 17025 Accredited Laboratory',
                  'Fast Turnaround Times (Standard 3-5 Days)',
                  'Emergency 24/7 Expedited Services Available',
                  'Detailed Calibration Certificates & Reports',
                  '90-Day Warranty on All Repairs'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3 shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div>
                <Link to="/contact" className="inline-flex bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                  Contact Our Experts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
