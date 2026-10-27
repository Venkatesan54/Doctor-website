import React from "react";
import { Link } from "react-router-dom";
import {
  Activity, Phone, Mail, MapPin,
  Globe, MessageCircle, Heart, Share2
} from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400">

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md" style={{ background: 'var(--color-accent)' }}>
                <Activity size={18} />
              </div>
              <span className="text-xl font-extrabold" style={{ color: 'var(--color-surface)' }}>
                Doc<span style={{ color: 'var(--color-accent)' }}>Book</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Your trusted partner for seamless healthcare access — book appointments,
              find hospitals, and manage your health journey.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: Globe, href: "#", label: "Website" },
                { icon: MessageCircle, href: "#", label: "Community" },
                { icon: Heart, href: "#", label: "Support" },
                { icon: Share2, href: "#", label: "Share" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {React.createElement(Icon, { size: 15 })}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", path: "/" },
                { label: "Find Doctors", path: "/doctors" },
                { label: "Hospitals", path: "/find-nearby/hospitals" },
                { label: "Labs", path: "/find-nearby/labs" },
                { label: "About Us", path: "/about" },
              ].map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-slate-400 hover:text-blue-400 transition-all hover:translate-x-1 inline-block focus:outline-none focus:text-blue-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
              For You
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Patient Dashboard", path: "/dashboard" },
                { label: "Doctor Dashboard", path: "/doctor-dashboard" },
                { label: "Sign In", path: "/login" },
                { label: "Create Account", path: "/register" },
              ].map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-slate-400 hover:text-blue-400 transition-all hover:translate-x-1 inline-block focus:outline-none focus:text-blue-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
              Contact
            </h3>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-blue-400 mt-1 shrink-0" />
                <span className="text-slate-400">
                  Chennai, Tamil Nadu<br />India
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone size={15} className="text-blue-400" />
                <a
                  href="tel:+918000000000"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  +91 80000 00000
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail size={15} className="text-blue-400" />
                <a
                  href="mailto:support@docbook.in"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  support@docbook.in
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">

          <p>© {year} DocBook. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <Link to="/terms" className="hover:text-blue-400 transition">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-blue-400 transition">
              Privacy
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;