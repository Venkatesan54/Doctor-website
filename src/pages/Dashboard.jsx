import React, { useState, useEffect } from "react";
import {
  Calendar, Clock, User, LogOut,
  Search, Shield, Activity, ArrowRight,
  CheckCircle2, XCircle, Clock4,
  ChevronRight, Heart, Bell,
  MapPin, Star, Plus, Download, Video,
  RefreshCcw, Zap, Brain, ShieldCheck, MessageSquare
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserAppointments, getFavorites } from "../lib/firebase/firestore";
import { toast } from "react-toastify";
import StatCard from "../components/dashboard/StatCard";
import AppointmentRow from "../components/dashboard/AppointmentRow";
import Skeleton from "../components/ui/Skeleton";

const Dashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [favDoctors, setFavDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        setFavLoading(false);
        return;
      }

      try {
        const [apts, favs] = await Promise.all([
          getUserAppointments(currentUser.uid),
          getFavorites(currentUser.uid)
        ]);

        if (isMounted) {
          setAppointments(apts || []);
          setFavDoctors(favs || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data");
      } finally {
        if (isMounted) {
          setLoading(false);
          setFavLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const today = new Date().toLocaleDateString("en-CA");

  const todayApt = appointments?.find(
    (apt) => apt?.date === today && apt?.status !== "cancelled"
  );

  const stats = [
    {
      label: "Active Visits",
      val: appointments?.length || 0,
      icon: <Activity size={20} />,
    },
    {
      label: "Confirmed",
      val: appointments?.filter(a => a?.status === "confirmed")?.length || 0,
      icon: <CheckCircle2 size={20} />,
    },
    {
      label: "Pending",
      val: appointments?.filter(a => a?.status === "pending")?.length || 0,
      icon: <Clock4 size={20} />,
    },
    {
      label: "Health Score",
      val: "94%",
      icon: <Zap size={20} />,
    },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* TODAY ALERT */}
        {todayApt && (
          <div className="mb-8 p-6 bg-blue-600 dark:bg-blue-600/20 border border-blue-500/30 text-white rounded-3xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shadow-xl shadow-blue-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Happening Today</p>
              </div>
              <h3 className="font-bold text-xl">
                Consultation with Dr. {todayApt.doctorName}
              </h3>
              <p className="text-sm opacity-90 font-medium">
                Starts at {todayApt.time}
              </p>
            </div>

            <button
              onClick={() => navigate(`/chat/${todayApt.doctorId}`)}
              className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto shrink-0"
            >
              <Video size={18} />
              JOIN CALL
            </button>
          </div>
        )}

        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-8 mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-transform">
                  <User size={48} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-full border-4 border-white dark:border-slate-800">
                   <Shield className="text-white" size={12} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">{userProfile?.name || "User"}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                    {userProfile?.role === "user" ? "Elite Patient" : "Verified User"}
                  </p>
                  <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                    <Clock size={14} /> Last visit: 2 days ago
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto self-stretch md:self-center">
              <Link to="/settings" className="flex-1 text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:opacity-90 transition shadow-xl">
                ACCOUNT SETTINGS
              </Link>
              <button onClick={handleLogout} className="flex-none p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl hover:bg-red-100 transition">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mb-12">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-1">Elite Health Services</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/doctors" className="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all text-center">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Search size={28} />
                </div>
                <p className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">Consult Online</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Verified Experts</p>
              </Link>
              
              <Link to="/symptom-checker" className="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all text-center">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Brain size={28} />
                </div>
                <p className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">AI Checker</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Smart Diagnostics</p>
              </Link>

              <Link to="/my-records" className="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all text-center">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={28} />
                </div>
                <p className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">Records Vault</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Secure Storage</p>
              </Link>

              <button onClick={() => navigate("/find-nearby")} className="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10 transition-all text-center w-full">
                <div className="w-14 h-14 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MapPin size={28} />
                </div>
                <p className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">ER Locator</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Emergency Mode</p>
              </button>
            </div>
        </div>

        {/* STATISTICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <StatCard key={i} icon={s.icon} label={s.label} val={s.val} trend="+12%" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* APPOINTMENTS LIST */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Calendar size={28} className="text-blue-600" />
                Active Timeline
              </h2>
              <Link to="/doctors" className="text-blue-600 dark:text-blue-400 hover:underline font-black text-xs uppercase tracking-widest">
                Browse More
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 flex gap-6">
                    <Skeleton className="w-14 h-14 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                       <Skeleton className="w-1/4 h-3" variant="text" />
                       <Skeleton className="w-1/2 h-5" variant="text" />
                    </div>
                  </div>
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                  <Calendar size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Appointments Scheduled</h3>
                <p className="text-sm text-slate-500 mt-2 mb-6">Take control of your health. Book a consultation with top specialists.</p>
                <Link to="/doctors" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black text-sm transition shadow-lg shadow-blue-200">
                  FIND A DOCTOR
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 5).map((apt) => (
                  <AppointmentRow key={apt.id} apt={apt} />
                ))}
              </div>
            )}
          </div>

          {/* FAVORITES SIDEBAR */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Heart size={28} className="text-red-600" />
              Elite Circle
            </h2>

            {favLoading ? (
               <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                    <Skeleton className="w-14 h-14 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-full h-4" variant="text" />
                      <Skeleton className="w-2/3 h-2" variant="text" />
                    </div>
                  </div>
                ))}
              </div>
            ) : favDoctors.length === 0 ? (
               <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">No Favorites Yet</p>
                  <Link to="/doctors" className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Explore Experts</Link>
               </div>
            ) : (
              <div className="space-y-4">
                {favDoctors.map((doc) => (
                  <div key={doc.id} className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all flex items-center gap-4 group">
                    <img
                      src={doc.image || `https://ui-avatars.com/api/?name=${doc.name || "Doctor"}&background=random`}
                      alt={doc.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-blue-500 transition-all"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-slate-900 dark:text-white text-sm truncate uppercase tracking-tight">Dr. {doc.name}</h3>
                      <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest">{doc.specialty}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/chat/${doc.id}`)}
                      className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:bg-blue-500 hover:text-white transition-all"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 sm:group-hover:scale-150 transition-transform duration-700" />
                <h4 className="text-xl font-black mb-3 relative z-10 flex items-center gap-2">
                  <ShieldCheck className="text-blue-400" size={24} />
                  Health Tip
                </h4>
                <p className="text-sm opacity-80 font-medium mb-0 relative z-10 leading-relaxed italic">
                  "Small consistent changes in your daily routine can lead to significant long-term health benefits. Stay hydrated and aim for 7-8 hours of sleep today."
                </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                <Zap className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
                <h4 className="text-xl font-black mb-2 relative z-10 font-outfit uppercase tracking-tighter">Premium Coverage?</h4>
                <p className="text-xs opacity-80 font-medium mb-6 relative z-10 leading-relaxed">Unlock cashless treatments and priority access to top labs.</p>
                <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all relative z-10 shadow-lg">
                   CHECK COVERAGE
                </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;