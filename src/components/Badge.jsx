import React from "react";
import PropTypes from "prop-types";

/**
 * Badge – a small pill‑style label used for specialties, services, etc.
 * Props:
 *   children: string – text to display
 *   className: optional additional classes
 */
const Badge = ({ children, className = "" }) => {
  return (
    <span
      className={`px-3 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-600 ${className}`}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Badge;
