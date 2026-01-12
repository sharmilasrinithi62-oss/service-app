
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { WORKSHOP, SERVICES } from './constants';
import { Booking, CarService } from './types';
import { analyzeCarIssue } from './services/geminiService';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [aiAnalysis, setAiAnalysis] = useState<{ analysis: string; suggestedServiceIds: string[] } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [carProblem, setCarProblem] = useState('');
  const diagnosticRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleBookingSubmit = (data: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      createdAt: Date.now()
    };
    setBookings([newBooking, ...bookings]);
    setIsBookingModalOpen(false);
    setSelectedServices([]);
    setCarProblem('');
    setAiAnalysis(null);
    alert(`Booking Successful! We've received your request for ${data.customerName}.`);
  };

  const handleAiDiagnostic = async () => {
    if (!carProblem.trim()) return;
    setAiLoading(true);
    try {
      const result = await analyzeCarIssue(carProblem);
      setAiAnalysis(result);
      if (result.suggestedServiceIds) {
        // Filter out any IDs that might not exist in our constants
        const validIds = result.suggestedServiceIds.filter(id => SERVICES.some(s => s.id === id));
        setSelectedServices(validIds.length > 0 ? validIds : ['general']);
      }
      diagnosticRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const deleteBooking = (id: string) => {
    if (window.confirm('Are you sure you want to remove this booking?')) {
      setBookings(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200 transition-transform group-hover:scale-110">
              <i className="fa-solid fa-car-side text-white text-2xl"></i>
            </div>
            <div className="leading-tight">
              <span className="block font-black text-xl text-blue-900 uppercase tracking-tighter">Annai Varahi</span>
              <span className="block text-xs font-bold text-blue-500 uppercase tracking-[0.2em]">Car Care</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Services</a>
            <a href="#about" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Why Us</a>
            <Link to="/admin" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">Admin Portal</Link>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href={`tel:${WORKSHOP.phone}`} 
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-all"
            >
              <i className="fa-solid fa-phone"></i>
              {WORKSHOP.phone}
            </a>
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-black shadow-lg shadow-orange-100 transition-all active:scale-95"
            >
              Book Now
            </button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <main>
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-30"></div>
              </div>

              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-left">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest mb-6">
                    Thanjavur's Premier Workshop
                  </span>
                  <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-8">
                    Your Car Deserves <br />
                    <span className="text-blue-600">Expert Care.</span>
                  </h1>
                  <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    From quick oil changes to complex engine repairs, we use cutting-edge technology to keep you safely on the road.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button 
                      onClick={() => document.getElementById('ai-doctor')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-blue-900 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3"
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      AI Diagnostic
                    </button>
                    <button 
                      onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-white border-2 border-gray-100 text-gray-900 px-10 py-5 rounded-2xl font-black text-lg hover:border-blue-200 transition-all"
                    >
                      Browse Services
                    </button>
                  </div>
                  
                  <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-2 font-bold"><i className="fa-solid fa-star text-orange-400"></i> 4.9/5 Rating</div>
                    <div className="flex items-center gap-2 font-bold"><i className="fa-solid fa-award text-blue-600"></i> Certified Mechanics</div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-4 bg-blue-600/5 rounded-[40px] blur-2xl group-hover:bg-blue-600/10 transition-colors"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800" 
                    alt="Workshop Service" 
                    className="relative rounded-[32px] shadow-2xl w-full object-cover aspect-[4/3]"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-50 animate-bounce-slow">
                    <div className="text-blue-600 font-black text-3xl">10+</div>
                    <div className="text-xs font-bold text-gray-400 uppercase">Years Experience</div>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Section */}
            <section id="ai-doctor" className="py-24 bg-gray-50 relative overflow-hidden">
               <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 p-8 md:p-12 border border-blue-100">
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-10 text-center md:text-left">
                    <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200">
                      <i className="fa-solid fa-robot text-white text-4xl"></i>
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">AI Virtual Mechanic</h2>
                      <p className="text-gray-500 font-medium">Describe your car's problem in plain English. Our AI will tell you what's wrong.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="relative">
                      <textarea 
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl p-6 text-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 resize-none"
                        placeholder="e.g., I hear a clicking sound when turning left, and my engine light is blinking..."
                        rows={4}
                        value={carProblem}
                        onChange={(e) => setCarProblem(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <button 
                      onClick={handleAiDiagnostic}
                      disabled={aiLoading || !carProblem.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-5 rounded-2xl text-xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-4"
                    >
                      {aiLoading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          Analyzing Your Issue...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-bolt-lightning"></i>
                          Diagnose Now
                        </>
                      )}
                    </button>

                    {aiAnalysis && (
                      <div ref={diagnosticRef} className="mt-10 p-8 bg-blue-50 rounded-[32px] border border-blue-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-4 text-blue-900">
                          <i className="fa-solid fa-comment-medical text-2xl"></i>
                          <h4 className="font-black text-xl">Mechanic's Analysis</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-6 text-lg">{aiAnalysis.analysis}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-black text-blue-600 uppercase tracking-widest">Recommended:</span>
                          {aiAnalysis.suggestedServiceIds.map(sid => (
                            <span key={sid} className="bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm border border-blue-100 text-blue-800">
                              {SERVICES.find(s => s.id === sid)?.name || sid}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Why Choose Us */}
            <section id="about" className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { icon: 'fa-user-check', title: 'Expert Mechanics', desc: 'Our team is factory-trained with decades of combined experience.' },
                    { icon: 'fa-shield-heart', title: 'Genuine Parts', desc: 'We only use OEM and high-quality parts to ensure your safety.' },
                    { icon: 'fa-clock-rotate-left', title: 'Fast Turnaround', desc: 'Get back on the road faster with our streamlined service process.' }
                  ].map((item, i) => (
                    <div key={i} className="text-center group">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 transition-transform group-hover:scale-110">
                        <i className={`fa-solid ${item.icon} text-2xl`}></i>
                      </div>
                      <h3 className="text-xl font-black mb-4">{item.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Services */}
            <section id="services" className="py-24 bg-white border-t border-gray-50">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Our Services</h2>
                <p className="text-gray-500 max-w-2xl mx-auto mb-16 text-lg">Pick a specific service or let our AI guide you above.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {SERVICES.map((service) => (
                    <div 
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`relative p-8 rounded-[32px] border-2 transition-all cursor-pointer group text-left ${
                        selectedServices.includes(service.id) 
                        ? 'border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-900/5' 
                        : 'border-gray-50 hover:border-blue-100 hover:shadow-lg'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                        selectedServices.includes(service.id) ? 'bg-blue-600 text-white' : 'bg-gray-50 text-blue-600 group-hover:bg-blue-100'
                      }`}>
                        <i className={`fa-solid ${service.icon} text-2xl`}></i>
                      </div>
                      <h3 className="text-xl font-black mb-3 text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500 mb-8 leading-relaxed">{service.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          selectedServices.includes(service.id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'
                        }`}>
                          {selectedServices.includes(service.id) && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest ${
                          selectedServices.includes(service.id) ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          {selectedServices.includes(service.id) ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-20">
                   <button 
                      onClick={() => setIsBookingModalOpen(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-16 py-6 rounded-3xl font-black text-xl shadow-2xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-4 mx-auto"
                    >
                      Schedule My Visit
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                    {selectedServices.length > 0 && (
                      <p className="mt-6 text-blue-600 font-bold">You've selected {selectedServices.length} services.</p>
                    )}
                </div>
              </div>
            </section>

            {/* Map & Contact */}
            <section className="py-24 bg-gray-900 text-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div>
                    <h2 className="text-4xl font-black mb-10 leading-tight">Drop By Our <br /><span className="text-blue-500">Service Center</span></h2>
                    <div className="space-y-8">
                      <div className="flex gap-6">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-1">Our Location</h4>
                          <p className="text-lg leading-relaxed">{WORKSHOP.address}</p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                          <i className="fa-solid fa-calendar-clock"></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-1">Business Hours</h4>
                          <p className="text-lg leading-relaxed">Mon - Sat: 09:00 AM - 07:00 PM <br /> Sunday: By Appointment</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                      <a href={`tel:${WORKSHOP.phone}`} className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-50 transition-colors">
                        <i className="fa-solid fa-phone"></i>
                        Call Now
                      </a>
                      <a href={`https://wa.me/${WORKSHOP.whatsapp}`} target="_blank" className="bg-green-500 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-green-600 transition-colors">
                        <i className="fa-brands fa-whatsapp text-2xl"></i>
                        Chat with Owner
                      </a>
                    </div>
                  </div>

                  <div className="rounded-[40px] overflow-hidden border-[12px] border-white/5 shadow-3xl h-[450px]">
                    <iframe 
                      src={WORKSHOP.googleMapsEmbed} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, filter: 'invert(90%)' }} 
                      allowFullScreen 
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>
            </section>
          </main>
        } />

        <Route path="/admin" element={
          <AdminDashboard 
            bookings={bookings} 
            allServices={SERVICES} 
            onUpdateStatus={updateBookingStatus} 
            onDelete={deleteBooking} 
          />
        } />
      </Routes>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-xl">
              <i className="fa-solid fa-car-side text-white text-xl"></i>
            </div>
            <span className="font-black text-2xl tracking-tighter text-blue-900 uppercase">Annai Varahi</span>
          </div>
          
          <div className="flex gap-10 text-sm font-bold text-gray-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Refund Policy</a>
          </div>

          <p className="text-gray-400 text-sm font-medium">© {new Date().getFullYear()} Annai Varahi Car Care. Built for Excellence.</p>
        </div>
      </footer>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedServiceIds={selectedServices}
        allServices={SERVICES}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
};

export default App;
