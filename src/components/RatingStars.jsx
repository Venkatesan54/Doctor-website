import React from "react";
import { Star } from "lucide-react";

/**
 * RatingStars component displays a star rating.
 * @param {Object} props
 * @param {number} props.rating - rating value (e.g., 4.5). Supports half stars via rounding.
 * @param {string} [props.className] - optional extra class names.
 */
const RatingStars = ({ rating = 0, className = "" }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < fullStars) {
      return (
        <Star
          key={i}
          size={18}
          fill="currentColor"
          className="text-yellow-400"
        />
      );
    }
    if (i === fullStars && hasHalf) {
      // Using half star effect via CSS gradient
      return (
        <Star
          key={i}
          size={18}
          fill="url(#half)"
          className="text-yellow-400"
        />
      );
    }
    return (
      <Star key={i} size={18} className="text-slate-300" />
    );
  });

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Define half-star gradient */}
      <svg width="0" height="0" className="hidden">
        <defs>
          <linearGradient id="half" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
      {stars}
    </div>
  );
};

export default RatingStars;
