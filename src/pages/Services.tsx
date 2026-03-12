import { ShieldCheck, Wrench, PackageSearch, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const iconMap: Record<string, any> = {
  ShieldCheck,
  Wrench,
  PackageSearch
};

export default function Services() {
  const { settings } = useSettings();
  if (!settings) return null;

  const { services, categories } = settings;

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-slate-900 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Our Services</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">Comprehensive industrial solutions designed to keep your operations running smoothly.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
        
        {services.map((service, index) => {
          const category = categories.find(c => c.id === service.categoryId);
          const Icon = category ? (iconMap[category.icon] || ShieldCheck) : ShieldCheck;
          const isReversed = index % 2 !== 0;

          return (
            <section key={service.id} id={category?.name.toLowerCase()} className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
              <div className="md:w-1/2">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{service.title}</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-slate-700 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3" /> {feature}
                    </li>
                  ))}
                </ul>
                <Link to={`/contact?service=${category?.name.toLowerCase()}`} className="inline-flex bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  Request {category?.name} Quote
                </Link>
              </div>
              <div className="md:w-1/2">
                <img src={service.imageUrl} alt={service.title} className="rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
              </div>
            </section>
          );
        })}

      </div>
    </div>
  );
}
