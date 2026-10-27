import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertTriangle, Phone, Navigation, Landmark, 
  MapPin, Clock, ArrowRight, X, ShieldAlert,
  ChevronRight, PhoneCall, ExternalLink
} from "lucide-react";
import { getHospitals } from "../lib/firebase/firestore";

// Reusing fallback hospitals for emergency lookup
const FALLBACK_HOSPITALS = [
  {
    id: "hosp_default_1",
    name: "Apollo Hospitals Greams Road",
    rating: 4.8,
    lat: 13.0604,
    lng: 80.2513,
    address: "21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu",
    phone: "+91-44-28293333"
  },
  {
    id: "hosp_default_2",
    name: "MIOT International",
    rating: 4.7,
    lat: 13.0223,
    lng: 80.1856,
    address: "4/112, Mount Poonamallee Rd, Sathya Nagar, Manapakkam, Chennai",
    phone: "+91-44-42002288"
  },
  {
    id: "hosp_default_3",
    name: "Fortis Hospital Mulund",
    rating: 4.9,
    lat: 19.1726,
    lng: 72.9542,
    address: "Mulund Goregaon Link Rd, Industrial Area, Mulund West, Mumbai",
    phone: "+91-22-43654365"
  }
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const EmergencyMode = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [nearest, setNearest] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const findNearest = useCallback(async (lat, lng) => {
    try {
      const hospitalsData = await getHospitals();
      const allHospitals = [...(hospitalsData || []), ...FALLBACK_HOSPITALS];
      
      let closest = null;
      let minDistance = Infinity;

      allHospitals.forEach(h => {
        const hLat = h.lat || h.coordinates?.latitude || h.coordinates?._lat;
        const hLng = h.lng || h.coordinates?.longitude || h.coordinates?._long;
        
        if (hLat && hLng) {
          const dist = calculateDistance(lat, lng, hLat, hLng);
          if (dist < minDistance) {
            minDistance = dist;
            closest = { ...h, distance: dist, hLat, hLng };
          }
        }
      });

      setNearest(closest);
    } catch (err) {
      console.error("Error finding nearest hospital:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          findNearest(latitude, longitude);
        },
        () => {
          setError("Location access denied. Using default center.");
          const defaultLat = 13.0827; // Chennai
          const defaultLng = 80.2707;
          setUserLocation({ lat: defaultLat, lng: defaultLng });
          findNearest(defaultLat, defaultLng);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  }, [isOpen, findNearest]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-600/20 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-red-500/20 border-4 border-red-500 overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-600 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl animate-pulse">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Emergency Mode</h2>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Immediate Critical Assistance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-bold text-sm">Searching for Nearest Hospital...</p>
            </div>
          ) : nearest ? (
            <div className="space-y-6">
              {error && (
                <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 p-4 rounded-3xl border border-amber-200/50 dark:border-amber-900/30 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {/* Nearest Hospital Card */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-red-600 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full uppercase mb-2 inline-block">Nearest facility</span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{nearest.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-red-600">{nearest.distance.toFixed(1)}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">KM AWAY</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                    <MapPin size={18} className="shrink-0 text-red-500" />
                    <p className="text-sm font-medium leading-relaxed">{nearest.address}</p>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Clock size={18} className="shrink-0 text-blue-500" />
                    <p className="text-sm font-bold">Open 24/7 • Emergency Ready</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-4">
                <a
                  href={`tel:${nearest.phone || "+91-44-28293333"}`}
                  className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-200 dark:shadow-none transition-all scale-100 hover:scale-[1.02] active:scale-95"
                >
                  <PhoneCall size={24} className="animate-bounce" />
                  CALL HOSPITAL NOW
                </a>
                
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${nearest.hLat},${nearest.hLng}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold text-sm hover:opacity-90 transition-all"
                  >
                    <Navigation size={18} />
                    NAVIGATE
                  </a>
                  <button
                    onClick={() => {
                        onClose();
                        navigate(`/hospital/${nearest.id}`);
                    }}
                    className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    DETAILS
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-center text-slate-400 font-medium">
                Emergency services are prioritized. Please call only if immediate medical care is required.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
              <p className="text-slate-900 dark:text-white font-bold">No Hospitals Found Nearby</p>
              <p className="text-sm text-slate-500">{error || "Please try to enable location or search manually."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyMode;
