import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Activity, LogOut, User, Bell, Settings, PhoneCall } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { logoutUser } from "../lib/firebase/auth";
import { getUserAppointments } from "../lib/firebase/firestore";
import { toast } from "react-toastify";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Find Doctors", path: "/doctors" },
  { name: "Hospitals", path: "/find-nearby/hospitals" },
  { name: "Labs", path: "/find-nearby/labs" },
  { name: "About Us", path: "/about" },
];

const Navbar = ({ onEmergencyClick }) => {
  const { currentUser, userProfile, isDoctor, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const dropdownRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Fetch appointments safely
  useEffect(() => {
    let mounted = true;

    const fetchReminders = async () => {
      if (currentUser && !isDoctor && !isAdmin) {
        try {
          const data = await getUserAppointments(currentUser.uid);

          if (mounted) {
            const upcoming = data.filter(
              (a) => a.status === "pending" || a.status === "confirmed"
            );
            setAppointments(upcoming);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchReminders();

    return () => {
      mounted = false;
    };
  }, [currentUser, isDoctor, isAdmin]);

  // ✅ Scroll effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ✅ Close mobile menu on route change
  useEffect(() => {
    if (open) {
      setTimeout(() => setOpen(false), 0);
    }
  }, [location.pathname, open]);

  // ✅ Close notification on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const dashboardPath = isAdmin
    ? "/admin"
    : isDoctor
      ? "/doctor-dashboard"
      : "/dashboard";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-md"
          : "bg-white/70 dark:bg-slate-900/70 backdrop-blur-md"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: 'var(--color-accent)' }}>
              <Activity size={18} />
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
              Doc<span style={{ color: 'var(--color-accent)' }}>Book</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${location.pathname === link.path
                    ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onEmergencyClick}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-black transition-all shadow-lg animate-pulse active-scale"
              style={{ background: '#EF4444' }}
              aria-label="Call Emergency"
            >
              <PhoneCall size={16} />
              EMERGENCY
            </button>
            {currentUser ? (
              <>
                {/* Notifications */}
                {!isDoctor && !isAdmin && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() =>
                        setShowNotifications((prev) => !prev)
                      }
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 relative flex items-center justify-center min-w-[44px] min-h-[44px] active-scale"
                      aria-label="Notifications"
                    >
                      <Bell size={20} />
                      {appointments.length > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border z-50">
                        <div className="p-4 border-b font-semibold">
                          Appointments ({appointments.length})
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                          {appointments.length === 0 ? (
                            <p className="p-4 text-sm text-gray-400">
                              No upcoming appointments
                            </p>
                          ) : (
                            appointments.map((apt) => (
                              <div
                                key={apt.id}
                                className="p-3 border-b text-sm"
                              >
                                <p className="font-semibold">
                                  Dr. {apt.doctorName}
                                </p>
                                <p className="text-gray-500">
                                  {apt.date} • {apt.time}
                                </p>
                              </div>
                            ))
                          )}
                        </div>

                        <Link
                          to="/dashboard"
                          className="block text-center py-3 text-blue-600 text-sm"
                        >
                          View All
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Profile */}
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg card hover-lift"
                  style={{ background: 'var(--color-soft)', color: 'var(--color-text)' }}
                >
                  <User size={16} />
                  {userProfile?.name?.split(" ")[0] || "Dashboard"}
                </Link>

                {/* Settings */}
                <Link
                  to="/settings"
                  className="p-2 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center justify-center min-w-[44px] min-h-[44px] active-scale"
                  title="Settings"
                  aria-label="Settings"
                >
                  <Settings size={18} />
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 dark:text-slate-400 hover:text-red-500 transition flex items-center justify-center min-w-[44px] min-h-[44px] active-scale"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-slate-900 dark:text-white">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Theme switch - Available for all users */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white flex items-center justify-center min-w-[44px] min-h-[44px] active-scale"
              title="Toggle theme"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 flex items-center justify-center min-w-[44px] min-h-[44px] active-scale"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-600 p-4 space-y-3 animate-in">
          <button
            onClick={() => {
              setOpen(false);
              onEmergencyClick();
            }}
            className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black text-sm shadow-lg shadow-red-200 dark:shadow-none mb-4"
          >
            <PhoneCall size={18} />
            EMERGENCY HELP
          </button>
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  location.pathname === link.path
                    ? "hover-lift"
                    : ""
                }`}
                style={location.pathname === link.path ? { color: 'var(--color-accent)', borderBottom: '2px solid var(--color-accent)' } : { color: 'var(--color-muted)' }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-600 pt-3 space-y-2">
            {currentUser ? (
              <>
                <Link
                  to={dashboardPath}
                  className="block px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <Settings size={16} />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 rounded-lg text-center"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Theme switch - Available for all users */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;