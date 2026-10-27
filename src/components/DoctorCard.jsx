import React, { useState, useEffect } from "react";
import { Heart, Users, MessageSquare, ShieldCheck, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toggleFavorite } from "../lib/firebase/firestore";
import { toast } from "react-toastify";
import Badge from "../components/Badge";
import RatingStars from "../components/RatingStars";

const DoctorCard = ({ doctor }) => {
  const { currentUser, userProfile } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Sync favorites safely
  useEffect(() => {
    if (userProfile?.favorites && doctor?.id) {
      setIsFavorite(userProfile.favorites.includes(doctor.id));
    } else {
      setIsFavorite(false);
    }
  }, [userProfile, doctor?.id]);

  // ✅ Move return null after all hooks are called to comply with Rules of Hooks
  if (!doctor) return null;

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (!currentUser) {
      toast.info("Please login to save favorites!");
      return;
    }

    setLoading(true);

    try {
      await toggleFavorite(currentUser.uid, doctor.id, isFavorite);

      // ✅ Functional update (safe state update)
      setIsFavorite(prev => !prev);

      toast.success(
        isFavorite ? "Removed from favorites" : "Added to favorites"
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update favorites");
    } finally {
      setLoading(false);
    }
  };

  const imageId = (doctor.id || doctor.name || "doctor")
    .split("")
    .reduce((hash, character) => hash + character.charCodeAt(0), 0);

  return (
    <div className="glass group p-6 sm:p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-blue-900/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden flex flex-col sm:flex-row gap-8 bg-white dark:bg-slate-800">

      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/20 dark:bg-blue-500/10 rounded-full blur-3xl" />

      {/* Image */}
      <div className="relative w-full sm:w-48 h-48 rounded-4xl overflow-hidden bg-gray-100 dark:bg-slate-700 shrink-0">
        <img
          src={doctor.image || `https://i.pravatar.cc/480?img=${(imageId % 70) + 1}`}
          alt={`Dr. ${doctor.name || "Doctor"}`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=480&auto=format&fit=crop&q=80";
          }}
          className="h-full w-full object-cover"
        />

        {/* Rating */}
        <div className="absolute top-3 left-3 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg flex items-center gap-1 shadow dark:shadow-lg">
          <RatingStars rating={doctor.rating || 4.5} />
        </div>

        {/* Favorite */}
        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          className={`absolute top-3 right-3 p-2 rounded-full transition ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-white dark:bg-slate-700 text-gray-400 dark:text-slate-300"
          } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <Heart
            size={16}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>

        {/* Experience */}
        <div className="absolute bottom-0 w-full bg-black/40 text-white text-xs text-center py-1">
          {(doctor.experience || 5)}+ yrs exp
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          <div className="flex gap-2 mb-2 flex-wrap">
            <Badge>{doctor.specialty || "General"}</Badge>
            {doctor.verified && (
              <Badge className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center gap-1">
                <ShieldCheck size={12} /> Verified
              </Badge>
            )}
          </div>

          {/* Name */}
          <h3 className="text-xl font-bold mb-2 dark:text-white">
            Dr. {doctor.name || "Unknown"}
          </h3>

          {/* Info */}
          <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-slate-400 mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              {doctor.hospital || "Clinic"}
            </div>

            <div className="flex items-center gap-2">
              <Users size={14} />
              98% success rate
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 dark:text-slate-500">Fee</p>
            <p className="font-bold text-lg dark:text-white">
              ₹{doctor.fee || 500}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/chat/${doctor.id}`}
              className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
              title="Chat with Doctor"
            >
              <MessageSquare size={18} />
            </Link>
            <Link
              to={`/doctor/${doctor.id}`}
              className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Details <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;