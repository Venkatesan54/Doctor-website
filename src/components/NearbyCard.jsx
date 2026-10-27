import React from "react";
import { Star, Clock, MapPin, Navigation, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const calculateTravelTime = (distanceKm) => {
  if (distanceKm == null) return null;
  
  let speedKmH = 25; // Default urban speed
  if (distanceKm < 2) speedKmH = 15; // Slower for very short trips (traffic lights, parking)
  else if (distanceKm > 20) speedKmH = 40; // Faster for longer trips (highways)
  
  // Add 5 mins base delay for finding parking/walking to entrance
  const baseDelayMins = distanceKm < 1 ? 0 : 5;
  
  const timeHours = distanceKm / speedKmH;
  const timeMinutes = Math.round(timeHours * 60) + baseDelayMins;

  if (timeMinutes < 60) return `${timeMinutes} mins`;
  const h = Math.floor(timeMinutes / 60);
  const m = timeMinutes % 60;
  return `${h}h ${m}m`;
};

const NearbyCard = ({ item, type = "hospitals", isSelected, onShowOnMap, userLocation }) => {
  const entityType = type === "labs" ? "lab" : "hospital";
  const routeUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${item.lat},${item.lng}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`;

  return (
    <div
      id={`doctor-card-${item.id}`}
      className={`p-4 border rounded-xl transition-all duration-300 bg-white dark:bg-slate-700 ${
        isSelected
          ? "border-blue-500 shadow-lg ring-2 ring-blue-100 dark:ring-blue-900 scale-[1.02]"
          : "border-slate-200 dark:border-slate-600 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={item.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=150&h=150"}
            alt={item.name}
            className="w-20 h-20 rounded-2xl object-cover shadow-sm"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=150&h=150";
            }}
          />
          {item.rating >= 4.8 && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-white p-1 rounded-full shadow-xs">
              <Star size={10} fill="white" />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{item.name || "Unknown Location"}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
            {item.address || (typeof item.location === "string" ? item.location : "Nearby Location")}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span 
              className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full cursor-help"
              title="Linear distance from your location"
            >
              {item.distance?.toFixed(1) || "?.?"} km
            </span>
            {item.distance != null && (
              <span 
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter cursor-help"
                title="Estimated driving time including average traffic and parking"
              >
                <Clock size={10} /> ~{calculateTravelTime(item.distance)}
              </span>
            )}
            <div className="flex items-center gap-1 text-amber-500 ml-auto">
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-bold">{item.rating || "4.5"}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold mt-2">
            <button
              onClick={() => onShowOnMap(item)}
              aria-label={`Show ${item.name} on map`}
              className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-800 transition border border-blue-100 dark:border-blue-800"
            >
              <MapPin size={12} /> Show on Map
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
            >
              <Navigation size={12} /> Get Directions
            </a>
            <Link
              to={`/${entityType}/${item.id}`}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 ml-auto"
            >
              <FileText size={12} /> View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyCard;
