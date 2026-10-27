import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  MapPin,
  Star,
  Navigation,
  Search,
  Building2,
  FlaskConical,
  ChevronRight,
  CheckCircle2,
  Clock,
  Phone,
  Globe,
  FileText,
  X
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NearbyCard from "../components/NearbyCard";
import { useNearbyFacilities } from "../hooks/api/useNearbyFacilities";
import { toast } from "react-toastify";
import Skeleton from "../components/ui/Skeleton";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_LOCATION = { lat: 13.0827, lng: 80.2707, address: "Chennai, Tamil Nadu" };

const FALLBACK_HOSPITALS = [
  {
    id: "hosp_default_1",
    name: "Apollo Hospitals Greams Road",
    specialty: "Multispeciality",
    rating: 4.8,
    lat: 13.0604,
    lng: 80.2513,
    address: "21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1586773860418-d3b978b0c747?auto=format&fit=crop&q=80&w=400",
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
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400",
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
    image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=400",
    phone: "+91-22-43654365",
    website: "https://www.fortishealthcare.com",
    bio: "Fortis Hospital, Mulund is a five-time JCI accredited, multi-speciality tertiary care hospital in Mumbai. It provides comprehensive care for over 30 specialities.",
    services: ["Pediatrics", "Urology", "Dermatology", "Pulmonology"]
  }
];

const FALLBACK_LABS = [
  {
    id: "lab_default_1",
    name: "Dr. Lal PathLabs Chennai",
    specialty: "Pathology",
    rating: 4.6,
    lat: 13.0827,
    lng: 80.2707,
    address: "Poonamallee High Rd, Chennai",
    image: "https://images.unsplash.com/photo-1579154235602-3c2c299ed307?auto=format&fit=crop&q=80&w=400",
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
    image: "https://images.unsplash.com/photo-1583912267550-d44d7a125a6e?auto=format&fit=crop&q=80&w=400",
    phone: "+91-22-33993939",
    website: "https://www.metropolisindia.com",
    bio: "Metropolis Healthcare is a leading diagnostics company in India. We offer over 4,000 tests and have a network of 125+ labs.",
    services: ["Diabetes Screening", "Thyroid Profile", "Full Body Checkup", "Genomics"]
  }
];

const hospitalIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063176.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const labIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4320/4320337.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const selectedLocationIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const calculateTravelTime = (distanceKm) => {
  if (distanceKm == null) return null;
  // Assume avg city speed of 25km/h including traffic
  const timeHours = distanceKm / 25;
  const timeMinutes = Math.round(timeHours * 60);
  
  if (timeMinutes < 60) return `${timeMinutes} mins`;
  const h = Math.floor(timeMinutes / 60);
  const m = timeMinutes % 60;
  return `${h}h ${m}m`;
};



const MapClickMarker = ({ setUserLocation, setMapCenter, fetchAddress }) => {
  useMapEvents({
    click: async (event) => {
      const { lat, lng } = event.latlng;
      setUserLocation({ lat, lng });
      setMapCenter([lat, lng]);
      toast.success(`Location marked at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      await fetchAddress(lat, lng);
    },
  });
  return null;
};

const MapCenterUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, 15, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
};

const PopupController = ({ selectedId }) => {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer.options.alt === String(selectedId)) {
        layer.openPopup();
      }
    });
  }, [selectedId, map]);
  return null;
};

const FindNearby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationTab = location.pathname.includes("/find-nearby/labs") ? "labs" : location.pathname.includes("/find-nearby/hospitals") ? "hospitals" : "all";

  const [activeTab, setActiveTab] = useState(locationTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("All");
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [activeLocation, setActiveLocation] = useState(DEFAULT_LOCATION.address);
  const [radiusKm, setRadiusKm] = useState(40);
  const [showOnlySameCity, setShowOnlySameCity] = useState(false);
  const [mapCenter, setMapCenter] = useState([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [map, setMap] = useState(null);
  const [hasSetInitialTarget, setHasSetInitialTarget] = useState(false);

  const { hospitals, labs, dataLoading, error } = useNearbyFacilities(FALLBACK_HOSPITALS, FALLBACK_LABS);

  const locationAvailable = !!(userLocation && userLocation.lat && userLocation.lng);

  useEffect(() => {
    if (error) toast.error("Failed to load nearby locations");
  }, [error]);

  useEffect(() => {
    if (!locationAvailable) {
      setActiveTab('all');
    } else {
      setActiveTab(location.pathname.includes("/find-nearby/labs") ? "labs" : location.pathname.includes("/find-nearby/hospitals") ? "hospitals" : "all");
    }
  }, [location.pathname]);

  const currentItems = useMemo(() => {
    if (!locationAvailable) {
      return [...hospitals, ...labs];
    }
    if (activeTab === "all") return [...hospitals, ...labs];
    return activeTab === "hospitals" ? hospitals : labs;
  }, [activeTab, hospitals, labs, locationAvailable]);

  const itemsWithGeo = React.useMemo(() => {
    return currentItems.map((item) => {
      let lat = item.lat;
      let lng = item.lng;

      if (item.location && typeof item.location === "object" && item.location._lat !== undefined) {
        lat = item.location._lat;
        lng = item.location._long;
      } else if (item.coordinates && typeof item.coordinates === "object") {
        lat = item.coordinates._lat || item.coordinates.lat;
        lng = item.coordinates._long || item.coordinates.lng;
      }

      lat = Number(lat ?? (DEFAULT_LOCATION.lat + (Math.random() * 0.1 - 0.05)));
      lng = Number(lng ?? (DEFAULT_LOCATION.lng + (Math.random() * 0.1 - 0.05)));
      const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, lat, lng) : null;

      return { ...item, lat, lng, distance };
    });
  }, [currentItems, userLocation]);

  const filteredByLocationAndSearch = React.useMemo(() => {
    return itemsWithGeo.filter((item) => {
      const combinedText = `${item.name || ""} ${item.hospital || item.address || item.location || ""} ${item.specialty || ""}`
        .toLowerCase();
      const searchMatch = combinedText.includes(searchQuery.toLowerCase());

      if (searchQuery && !searchMatch) return false;

      if (specializationFilter !== "All") {
        const matchesSpecialty = (item.specialty || "").toLowerCase().includes(specializationFilter.toLowerCase());
        if (!matchesSpecialty) return false;
      }

      if (userLocation) {
        const withinNearby = item.distance != null && item.distance <= radiusKm;
        const locationText = item.location ? String(item.location).toLowerCase() : "";
        const sameCity = activeLocation
          ? locationText.includes(String(activeLocation).toLowerCase())
          : false;

        let locationMatch = true;
        if (showOnlySameCity) {
          locationMatch = sameCity;
        } else {
          locationMatch = withinNearby || sameCity;
        }

        if (searchQuery && searchMatch && !locationMatch) {
          return true;
        }

        return locationMatch;
      }

      return true;
    });
  }, [itemsWithGeo, userLocation, radiusKm, activeLocation, showOnlySameCity, searchQuery, specializationFilter]);

  const displayedDoctors = React.useMemo(() => {
    return filteredByLocationAndSearch
      .slice()
      .sort((a, b) => {
        if (a.distance == null && b.distance == null) return 0;
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      });
  }, [filteredByLocationAndSearch]);

  const specializations = React.useMemo(() => {
    const specs = new Set(["All"]);
    currentItems.forEach(item => {
      if (item.specialty) specs.add(item.specialty);
    });
    return Array.from(specs).sort();
  }, [currentItems]);
  
  const mapMarkers = React.useMemo(() => displayedDoctors.map((item) => {
    const routeUrl = userLocation
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${item.lat},${item.lng}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`;

    return (
      <Marker
        key={item.id || `${item.lat}-${item.lng}`}
        position={[item.lat, item.lng]}
        alt={String(item.id)}
        icon={item.id && item.id.startsWith('hosp') ? hospitalIcon : labIcon}
        eventHandlers={{
          click: () => setSelectedDoctorId(item.id)
        }}
      >
        <Popup className="custom-popup" eventHandlers={{ remove: () => setSelectedDoctorId(null) }}>
          <div className="p-0 overflow-hidden rounded-xl min-w-[220px] shadow-sm">
            <div className="relative">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-24 object-cover" />
              ) : (
                <div className="w-full h-24 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <Building2 className="text-slate-300 dark:text-slate-500" size={32} />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                  <Star size={10} fill="currentColor" /> {item.rating || '4.7'}
                </span>
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800">
              <p className="font-bold text-slate-900 dark:text-white leading-tight mb-0.5 text-sm">{item.name}</p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">
                {item.specialty || "Facility"}
              </p>

              <div className="space-y-1.5 mb-3">
                <div className="flex items-start gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                  <MapPin size={12} className="shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{item.address || item.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                  <Navigation size={12} className="shrink-0" />
                  <span>{item.distance?.toFixed(1)} km away</span>
                  {item.distance != null && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter ml-2">
                      <Clock size={10} /> ~{calculateTravelTime(item.distance)}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end">
                <a href={routeUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition no-underline flex items-center gap-1">
                  <Navigation size={10} /> Directions
                </a>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }), [displayedDoctors, activeTab, userLocation]);

  useEffect(() => {
    if (hasSetInitialTarget) return;

    if (userLocation && userLocation.lat && userLocation.lng) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setHasSetInitialTarget(true);
    } else if (displayedDoctors.length > 0) {
      setMapCenter([displayedDoctors[0].lat, displayedDoctors[0].lng]);
      setHasSetInitialTarget(true);
    }
  }, [userLocation, displayedDoctors, hasSetInitialTarget]);

  const handleShowOnMap = (item) => {
    setMapCenter([item.lat, item.lng]);
    setSelectedDoctorId(item.id);
    if (map) {
      map.flyTo([item.lat, item.lng], 15, { duration: 1.5 });
    }
    if (window.innerWidth < 1024) {
      document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (selectedDoctorId) {
      const element = document.getElementById(`doctor-card-${selectedDoctorId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedDoctorId]);

  const isLatLngString = (value) => {
    if (!value) return false;
    const match = value.match(/^(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)$/);
    return !!match;
  };

  const searchLocation = async (queryText) => {
    const query = String(queryText || "").trim();
    if (!query) {
      toast.info("Type a city name or coordinates (lat,lng) to search");
      return;
    }

    if (isLatLngString(query)) {
      const [lat, lng] = query.split(",").map((p) => Number(p.trim()));
      setUserLocation({ lat, lng });
      setMapCenter([lat, lng]);
      setHasSetInitialTarget(false);
      await fetchAddress(lat, lng);
      toast.success("Location set from coordinates");
      return;
    }

    setIsSearchingLocation(true);
    try {
      const geoResp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1`
      );
      if (!geoResp.ok) throw new Error("Geocode search failed");
      const geoData = await geoResp.json();
      if (!geoData || geoData.length === 0) {
        toast.warning("No location found for this query");
        return;
      }

      const first = geoData[0];
      const lat = Number(first.lat);
      const lng = Number(first.lon);
      setUserLocation({ lat, lng });
      setMapCenter([lat, lng]);
      setHasSetInitialTarget(false);

      const name = first.address?.city || first.address?.town || first.address?.village || first.display_name.split(',')[0];
      setActiveLocation(name || query);
      toast.success(`Centering map on ${name || query}`);
    } catch (e) {
      console.error("Error searching location:", e);
      toast.error("Failed to find location");
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const fetchAddress = useCallback(async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) throw new Error("Failed reverse geocoding");
      const data = await response.json();
      const locationName =
        data.address.city || data.address.town || data.address.village || data.address.county || data.address.state;
      setActiveLocation(locationName || "");
    } catch {
      setActiveLocation("");
    }
  }, []);

  const requestCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapCenter([latitude, longitude]);
        setHasSetInitialTarget(false);

        toast.success("Current location detected");

        await fetchAddress(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to retrieve current location");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [fetchAddress]);

  useEffect(() => {
    requestCurrentLocation();
  }, [requestCurrentLocation]);

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 py-24 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Find nearby care</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
            {activeTab === 'labs' ? 'Labs near you' : activeTab === 'hospitals' ? 'Hospitals near you' : 'Find nearby facilities'}
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            Search by city, coordinates, or your current location to find the best nearby {activeTab === 'all' ? 'facilities' : activeTab}.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-[2rem] shadow-xl overflow-hidden backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-700">

            <div className="w-full lg:w-1/2 p-5 md:p-6 lg:p-8 bg-white dark:bg-slate-800">
                <div className="grid grid-cols-3 gap-2 mb-4 w-full">
                  {['hospitals', 'labs', 'all'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        if (tab === 'all') {
                          setActiveTab('all');
                          navigate('/find-nearby');
                        } else {
                          setActiveTab(tab);
                          navigate(`/find-nearby/${tab}`);
                        }
                      }}
                      className={`py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                        (activeTab === tab && tab !== 'all') || (activeTab === 'all' && tab === 'all')
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                          : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tab === 'hospitals' ? 'Hospitals' : tab === 'labs' ? 'Labs' : 'All'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Directory</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">{displayedDoctors.length} results</span>
                </div>

              <div className="relative mb-4">
                <Search className="absolute left-4 top-3 text-slate-400 dark:text-slate-500" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 py-3 pl-12 pr-10 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 bg-white dark:bg-slate-700"
                />
                <button
                  onClick={() => searchLocation(searchQuery)}
                  disabled={isSearchingLocation}
                  className="absolute right-20 top-2.5 text-xs rounded-lg px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 hover:bg-blue-100 disabled:opacity-50"
                  title="Search as location"
                >
                  {isSearchingLocation ? '...' : 'Location'}
                </button>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                    <X size={16} />
                  </button>
                )}
              </div>

              <details className="mb-4 group">
                <summary className="flex items-center justify-between cursor-pointer list-none text-xs text-blue-600 dark:text-blue-400 font-semibold py-2">
                  <span>Advanced Filters (Specialization / Radius)</span>
                  <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                </summary>
                <div className="pt-2 space-y-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">Filter by specialization</label>
                    <select
                      value={specializationFilter}
                      onChange={(e) => setSpecializationFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-600 py-3 px-4 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-2">Proximity radius: {radiusKm} km</p>
                    <input
                      type="range"
                      min="5"
                      max="500"
                      step="5"
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      id="sameCityToggle"
                      checked={showOnlySameCity}
                      onChange={(e) => setShowOnlySameCity(e.target.checked)}
                      className="accent-blue-600"
                    />
                    <label htmlFor="sameCityToggle" className="text-slate-600 dark:text-slate-300">Show only same-city results</label>
                  </div>
                </div>
              </details>

              <div className="mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                  <MapPin size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Your Current Area</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeLocation || "Detecting location..."}
                </p>
              </div>

              <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={requestCurrentLocation}
                  disabled={isSearchingLocation}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 transition shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <Navigation size={18} className={isSearchingLocation ? "animate-spin" : ""} />
                  current location
                </button>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Map currently focused on</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : "Not detected"}
                  </p>
                </div>
              </div>

              <div className="mb-2 text-xs text-slate-600 dark:text-slate-400">
                {searchQuery ? (
                  <span>
                    Showing {displayedDoctors.length} {activeTab} results for "{searchQuery}".
                  </span>
                ) : (
                  <span>Showing {displayedDoctors.length} nearby {activeTab} results.</span>
                )}
              </div>
              <div className="space-y-4">
                {activeTab === 'all' ? (
                  <>
                    <h2 className="text-lg font-semibold mb-2">Hospitals</h2>
                    {hospitals.map((item) => (
                      <NearbyCard
                        key={item.id}
                        item={item}
                        type="hospitals"
                        isSelected={selectedDoctorId === item.id}
                        onShowOnMap={handleShowOnMap}
                        userLocation={userLocation}
                      />
                    ))}
                    <h2 className="text-lg font-semibold mt-6 mb-2">Labs</h2>
                    {labs.map((item) => (
                      <NearbyCard
                        key={item.id}
                        item={item}
                        type="labs"
                        isSelected={selectedDoctorId === item.id}
                        onShowOnMap={handleShowOnMap}
                        userLocation={userLocation}
                      />
                    ))}
                  </>
                ) : (
                  displayedDoctors.map((item) => (
                    <NearbyCard
                      key={item.id}
                      item={item}
                      type={activeTab}
                      isSelected={selectedDoctorId === item.id}
                      onShowOnMap={handleShowOnMap}
                      userLocation={userLocation}
                    />
                  ))
                )}

              </div>
              {userLocation && displayedDoctors.length > 0 && (
                <div className="mt-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 p-4 shadow-sm">
                  <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">
                    <Navigation size={14} /> Closest results to you
                  </h4>
                  <ul className="space-y-2">
                    {displayedDoctors.slice(0, 3).map((item) => (
                      <li key={item.id || item.name} className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 gap-2">
                        <span className="font-semibold truncate min-w-0 flex-1">{item.name}</span>
                        <span className="whitespace-nowrap shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 font-bold">
                          {item.distance?.toFixed(1) ?? "—"} km
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right panel: map */}
            <div id="map-section" className="w-full lg:w-1/2 p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700">
              <div className="lg:sticky lg:top-24">
                <div className="w-full h-[400px] lg:h-[600px] rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    scrollWheelZoom
                    style={{ width: "100%", height: "100%" }}
                    ref={setMap}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapCenterUpdater center={mapCenter} />
                    <PopupController selectedId={selectedDoctorId} />
                    {mapMarkers}
                    {userLocation && (
                      <Marker position={[userLocation.lat, userLocation.lng]} icon={selectedLocationIcon}>
                        <Popup>
                          <div className="text-center p-1">
                            <strong className="text-blue-600">You Are Here</strong>
                            <p className="text-xs mt-1 text-slate-500">{activeLocation || "Current location"}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                    <MapClickMarker 
                      setUserLocation={setUserLocation}
                      setMapCenter={setMapCenter}
                      fetchAddress={fetchAddress}
                    />
                  </MapContainer>
                </div>
                <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Quick Navigation</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Click on any result in the list to fly to its location on the map. You can also click anywhere on the map to set a new search center.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FindNearby;