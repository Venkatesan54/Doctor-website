import React from "react";
import PropTypes from "prop-types";

// Simple reusable card component with optional image header and hover lift
export default function SimpleCard({ image, title, subtitle, children, className }) {
  return (
    <div className={`card hover-lift ${className || ""}`}>
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg mb-4"
        />
      )}
      {title && (
        <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      )}
      {subtitle && (
        <p className="text-sm text-slate-600 mb-4">{subtitle}</p>
      )}
      <div>{children}</div>
    </div>
  );
}

SimpleCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};
