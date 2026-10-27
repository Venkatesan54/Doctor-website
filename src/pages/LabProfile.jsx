import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Star, MapPin, Clock, Heart, 
  ArrowRight, Share2, Activity, 
  FlaskConical, Phone, Globe, ChevronRight, MessageSquare,
  Send, AlertCircle, CheckCircle2, Navigation, ClipboardList
} from "lucide-react";
import { getLabs } from "../lib/firebase/firestore";
import { toast } from "react-toastify";

const FALLBACK_LABS = [
  {
    id: "lab_default_1",
    name: "Dr. Lal PathLabs Chennai",
    specialty: "Pathology",
    rating: 4.6,
    lat: 13.0827,
    lng: 80.2707,
    address: "Poonamallee High Rd, Chennai",
    image: "https://images.unsplash.com/photo-1579154235602-3c2c299ed307?auto=format&fit=crop&q=80&w=600",
    phone: "+91-44-30103010",
    website: "https://www.lalpathlabs.com",
    bio: "Dr. Lal PathLabs is one of India's leading consumer healthcare brands in diagnostic services. We provide a wide range of tests and services.",
    services: ["Blood Test", "MRI Scan", "CT Scan", "X-Ray", "Pathology"]
  },
  {
    id: "lab_default_2",
    name: "Metropolis Healthcare Mumbai",
    specialty: "Diagnostics",
    rating: 4.5,
    lat: 19.0760,
    lng: 72.8777,
    address: "Kohinoor City Mall, Mumbai",
    image: "https://images.unsplash.com/photo-1583912267550-d44d7a125a6e?auto=format&fit=crop&q=80&w=600",
    phone: "+91-22-33993939",
    website: "https://www.metropolisindia.com",
    bio: "Metropolis Healthcare is a leading diagnostics company in India. We offer over 4,000 tests and have a network of 125+ labs.",
    services: ["Diabetes Screening", "Thyroid Profile", "Full Body Checkup", "Genomics"]
  }
];

const LabProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLab = async () => {
      try {
        setLoading(true);
        const labs = await getLabs();
        let found = labs.find(l => l.id === id);
        
        if (!found) {
          found = FALLBACK_LABS.find(l => l.id === id);
        }

        if (found) {
          setLab(found);
        }
      } catch (error) {
        console.error("Error fetching lab:", error);
        toast.error("Failed to load lab details");
      } finally {
        setLoading(false);
      }
    };

    fetchLab();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Lab Profile...</p>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="pt-32 text-center h-screen bg-slate-50 dark:bg-slate-900 px-4">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Lab Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lab.lat},${lab.lng}`;

  return (
    <div className="pt-20 pb-12 min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold transition-all"
          >
            <ArrowRight size={20} className="rotate-180" />
            Back to Search
          </button>
          
          <div className="flex gap-2">
            <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm">
              <Share2 size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Lab Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="relative h-56 sm:h-72 w-full">
            <img 
              src={lab.image || "https://images.unsplash.com/photo-1579154235602-3c2c299ed307?auto=format&fit=crop&q=80&w=1200"} 
              alt={lab.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-indigo-600 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                  Diagnostic Center
                </span>
                <span className="bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> {lab.rating || "4.5"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black">{lab.name}</h1>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
              
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <FlaskConical className="text-indigo-600" size={24} />
                    Lab Overview
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lab.bio || "Leading diagnostic center providing accurate and timely reports. Equipped with modern laboratory technology and certified pathologists."}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <ClipboardList className="text-emerald-600" size={24} />
                    Available Tests
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(lab.services || ["Pathology", "Radiology", "Biochemistry", "Hematology"]).map((service, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2 text-sm italic">
                    <Clock size={16} /> Home Collection Available
                  </h3>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400">
                    Get your samples collected from the comfort of your home. Call us to schedule a visit or book through our partner app.
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-left">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Location & Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-red-500 mt-1 shrink-0" size={18} />
                      <p className="text-sm text-slate-600 dark:text-slate-400">{lab.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-emerald-500" size={18} />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{lab.phone || "+91-44-30103010"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="text-blue-500" size={18} />
                      <a href={lab.website || "#"} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline truncate">
                        {lab.website ? lab.website.replace("https://", "").replace("www.", "") : "labwebsite.com"}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <a 
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                  >
                    <Navigation size={20} />
                    Find on Map
                  </a>
                  <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 py-4 rounded-2xl font-bold hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all">
                    Book Test Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-left">Customer Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700 text-left">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-slate-900 dark:text-white text-sm">Anish Jacob</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < 5 ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />)}
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">"Reports were delivered very fast. The staff for home collection was very punctual and careful."</p>
              <p className="text-[10px] text-slate-400 uppercase font-black">Verified Customer</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LabProfile;
