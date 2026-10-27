import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Star, MapPin, Clock, Heart, 
  ArrowRight, Share2, Activity, AlertCircle,
  Building2, Phone, Globe, ChevronRight, MessageSquare,
  Send, CheckCircle2, Navigation
} from "lucide-react";
import { getHospitals } from "../lib/firebase/firestore";
import { toast } from "react-toastify";

// We'll reuse the fallback data here if firestore is empty
const FALLBACK_HOSPITALS = [
  {
    id: "hosp_default_1",
    name: "Apollo Hospitals Greams Road",
    specialty: "Multispeciality",
    rating: 4.8,
    lat: 13.0604,
    lng: 80.2513,
    address: "21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1586773860418-d3b978b0c747?auto=format&fit=crop&q=80&w=600",
    phone: "+91-44-28293333",
    website: "https://www.apollohospitals.com",
    bio: "Apollo Hospitals, Greams Road Chennai, is the flagship hospital of the Apollo Group. It was established in 1983 and has since then emerged as one of the most respected destinations for healthcare in the world.",
    services: ["Cardiology", "Oncology", "Neurology", "Gastroenterology", "Orthopedics"]
  },
  {
    id: "hosp_default_2",
    name: "MIOT International",
    specialty: "Multispeciality",
    rating: 4.7,
    lat: 13.0223,
    lng: 80.1856,
    address: "4/112, Mount Poonamallee Rd, Sathya Nagar, Manapakkam, Chennai",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
    phone: "+91-44-42002288",
    website: "https://www.miotinternational.com",
    bio: "MIOT (Madras Institute of Orthopaedics and Traumatology) International is a multi-speciality hospital in Manapakkam, Chennai, India. It is a dual-diamond certified hospital.",
    services: ["Orthopaedics", "Traumatology", "Cardiothoracic Surgery", "Nephrology"]
  },
  {
    id: "hosp_default_3",
    name: "Fortis Hospital Mulund",
    specialty: "Multispeciality",
    rating: 4.9,
    lat: 19.1726,
    lng: 72.9542,
    address: "Mulund Goregaon Link Rd, Industrial Area, Mulund West, Mumbai",
    image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=600",
    phone: "+91-22-43654365",
    website: "https://www.fortishealthcare.com",
    bio: "Fortis Hospital, Mulund is a five-time JCI accredited, multi-speciality tertiary care hospital in Mumbai. It provides comprehensive care for over 30 specialities.",
    services: ["Pediatrics", "Urology", "Dermatology", "Pulmonology"]
  }
];

const HospitalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        setLoading(true);
        // Try to find in firestore first
        const hospitals = await getHospitals();
        let found = hospitals.find(h => h.id === id);
        
        // If not found, check fallbacks
        if (!found) {
          found = FALLBACK_HOSPITALS.find(h => h.id === id);
        }

        if (found) {
          setHospital(found);
        }
      } catch (error) {
        console.error("Error fetching hospital:", error);
        toast.error("Failed to load hospital details");
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Hospital Profile...</p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="pt-32 text-center h-screen bg-slate-50 dark:bg-slate-900 px-4">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hospital Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`;

  return (
    <div className="pt-20 pb-12 min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-bold transition-all"
          >
            <ArrowRight size={20} className="rotate-180" />
            Back to Search
          </button>
          
          <div className="flex gap-2">
            <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm">
              <Share2 size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
            <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm">
              <Heart size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <img 
              src={hospital.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"} 
              alt={hospital.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                  {hospital.specialty || "Multispeciality"}
                </span>
                <div className="flex items-center gap-1 bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  <Star size={12} fill="currentColor" /> {hospital.rating || "4.7"}
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">{hospital.name}</h1>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Info Column */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Building2 className="text-blue-600" size={24} />
                    About the Hospital
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                    {hospital.bio || "This facility provides world-class healthcare services with state-of-the-art technology and highly experienced medical professionals. Focused on patient-centric care and excellence in clinical outcomes."}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Activity className="text-emerald-600" size={24} />
                    Specialties & Services
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(hospital.services || ["General Medicine", "Emergency Care", "Diagnostic Services"]).map((service, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-600"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30">
                    <p className="text-2xl font-black text-blue-600">24/7</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Emergency Care</p>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30">
                    <p className="text-2xl font-black text-blue-600">500+</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Beds Available</p>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30">
                    <p className="text-2xl font-black text-blue-600">100%</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Patient Satisfaction</p>
                  </div>
                </div>
              </div>

              {/* Sidebar / Quick Actions */}
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Contact Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-red-500 shrink-0 mt-1" size={18} />
                      <p className="text-sm text-slate-600 dark:text-slate-400">{hospital.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-emerald-500 shrink-0" size={18} />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{hospital.phone || "+91-44-2345-6789"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="text-blue-500 shrink-0" size={18} />
                      <a 
                        href={hospital.website || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-blue-600 hover:underline truncate"
                      >
                        {hospital.website ? hospital.website.replace("https://", "").replace("www.", "") : "hospitalwebsite.com"}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <a 
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all scale-100 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Navigation size={20} />
                    Get Directions
                  </a>
                  <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-blue-600 text-blue-600 dark:text-blue-400 py-4 rounded-2xl font-bold hover:bg-blue-50 dark:hover:bg-slate-700 transition-all">
                    <Phone size={20} />
                    Call Hospital
                  </button>
                </div>
                
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-600 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">NABH Accredited</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500">Certified for quality healthcare standards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-baseline gap-4 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Patient Reviews</h2>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
              <Star className="text-yellow-400" size={16} fill="currentColor" />
              <span className="font-bold text-slate-900 dark:text-white">{hospital.rating} out of 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hardcoded Sample Reviews for Demo */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-slate-900 dark:text-white text-sm">Ramesh Kumar</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < 5 ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />)}
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">"Excellent facilities and very professional staff. The doctors take time to explain everything clearly."</p>
              <p className="text-[10px] text-slate-400">2 days ago</p>
            </div>
            <div className="p-5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-slate-900 dark:text-white text-sm">Priya Sharma</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />)}
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">"Very clean environment and well-organized emergency care. Waiting time was minimal."</p>
              <p className="text-[10px] text-slate-400">1 week ago</p>
            </div>
          </div>
          
          <button className="w-full mt-6 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl transition-all border border-dashed border-blue-200 dark:border-slate-600">
            Show more reviews
          </button>
        </div>

      </div>
    </div>
  );
};

export default HospitalProfile;
