import React, { useState, useEffect } from "react";
import { User, Lock, Bell, Shield, LogOut, Mail, Phone, Edit2, Save, X, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Settings = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: currentUser?.email || "",
    phone: userProfile?.phone || "",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    newsletter: false,
    twoFactor: false,
  });

  // Theme persistence
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // In a real app, update Firestore here
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Manage your account and preferences</p>
        </div>

        {/* PROFILE SECTION */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 mb-6 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Information</h2>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:hover:text-blue-400 font-medium"
              >
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>

          <div className="p-6 space-y-6">

            {/* NAME */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                />
              ) : (
                <p className="text-slate-900 dark:text-white">{userProfile?.name || "Not set"}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="flex text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <p className="text-slate-900 dark:text-white">{currentUser?.email}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Email cannot be changed</p>
            </div>

            {/* PHONE */}
            <div>
              <label className="flex text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 items-center gap-2">
                <Phone size={16} />
                Phone Number
              </label>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                />
              ) : (
                <p className="text-slate-900 dark:text-white">{userProfile?.phone || "Not set"}</p>
              )}
            </div>

            {/* ROLE */}
            <div>
              <label className="flex text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 items-center gap-2">
                <Shield size={16} />
                Account Type
              </label>
              <p className="text-slate-900 dark:text-white capitalize">{userProfile?.role || "User"}</p>
            </div>

            {/* EDIT ACTIONS */}
            {editMode && (
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-600">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Save size={18} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* NOTIFICATIONS SECTION */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 mb-6 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-600 flex items-center gap-3">
            <Bell className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
          </div>

          <div className="p-6 space-y-4">

            {/* EMAIL NOTIFICATIONS */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Receive updates via email</p>
              </div>
              <button
                onClick={() => handleToggleSetting("emailNotifications")}
                className={`relative w-12 h-7 rounded-full transition ${
                  settings.emailNotifications ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.emailNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* APPOINTMENT REMINDERS */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Appointment Reminders</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Get notified before appointments</p>
              </div>
              <button
                onClick={() => handleToggleSetting("appointmentReminders")}
                className={`relative w-12 h-7 rounded-full transition ${
                  settings.appointmentReminders ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.appointmentReminders ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* NEWSLETTER */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Newsletter</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Health tips and latest news</p>
              </div>
              <button
                onClick={() => handleToggleSetting("newsletter")}
                className={`relative w-12 h-7 rounded-full transition ${
                  settings.newsletter ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.newsletter ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* APPEARANCE SECTION */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 mb-6 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-600 flex items-center gap-3">
            <Palette className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Appearance</h2>
          </div>

          <div className="p-6 space-y-4">

            {/* THEME TOGGLE */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Theme</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Choose your preferred theme</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${theme === "light" ? "text-blue-600 font-semibold" : "text-slate-500 dark:text-slate-400"}`}>
                  Light
                </span>
                <button
                  onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
                  className={`relative w-12 h-7 rounded-full transition ${
                    theme === "dark" ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      theme === "dark" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`text-sm ${theme === "dark" ? "text-blue-600 font-semibold" : "text-slate-500 dark:text-slate-400"}`}>
                  Dark
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECURITY SECTION */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 mb-6 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-600 flex items-center gap-3">
            <Lock className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security</h2>
          </div>

          <div className="p-6 space-y-4">

            {/* CHANGE PASSWORD */}
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition">
              <div className="text-left">
                <p className="font-medium text-slate-900 dark:text-white">Change Password</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Update your password regularly</p>
              </div>
              <Lock className="text-slate-400 dark:text-slate-500" size={20} />
            </button>

            {/* TWO-FACTOR AUTHENTICATION */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Enhanced account security</p>
              </div>
              <button
                onClick={() => handleToggleSetting("twoFactor")}
                className={`relative w-12 h-7 rounded-full transition ${
                  settings.twoFactor ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.twoFactor ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 overflow-hidden">
          <div className="p-6 border-b border-red-200 dark:border-red-800 flex items-center gap-3">
            <LogOut className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Danger Zone</h2>
          </div>

          <div className="p-6">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 dark:hover:bg-red-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              <LogOut size={20} />
              Logout from this device
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
