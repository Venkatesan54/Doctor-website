import React, { useState, useEffect } from "react";
import { 
  Users, Calendar, Clock, CheckCircle2, 
  XCircle, Activity, ArrowRight, UserCheck, 
  Clock4, Award, ShieldCheck, Star,
  TrendingUp, Search, MessageSquare, 
  FileText, MoreVertical, Zap, ChevronRight,
  Stethoscope
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getDoctorAppointments, updateAppointmentStatus } from "../lib/firebase/firestore";
import { toast } from "react-toastify";

const DoctorDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get today's date dynamically
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser) return;

      try {
        const data = await getDoctorAppointments(currentUser.uid);

        if (!data || data.length === 0) {
          // fallback demo data
          setAppointments([
            { id: "1", userName: "Sarah Smith", date: today, time: "10:00 AM", status: "pending" },
            { id: "2", userName: "Michael Brown", date: today, time: "11:30 AM", status: "confirmed" },
            { id: "3", userName: "Emily Wilson", date: "2026-03-26", time: "02:00 PM", status: "pending" },
          ]);
        } else {
          setAppointments(data);
        }
      } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser, today]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(prev =>
        prev.map(a => (a.id === id ? { ...a, status } : a))
      );
      toast.success(`Session ${status} successfully!`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleQuickAction = (action) => {
    toast.info(`${action} triggered`);
  };

  // ✅ Stats with safe fallback
  const stats = [
    { 
      label: "Daily Cohort", 
      val: appointments?.filter(a => a.date === today).length || 0, 
      icon: <Users size={22} />, 
      color: "bg-medical-blue", 
      trend: "+12%" 
    },
    { 
      label: "Active Requests", 
      val: appointments?.filter(a => a.status === "pending").length || 0, 
      icon: <Clock4 size={22} />, 
      color: "bg-amber-500", 
      trend: "High" 
    },
    { 
      label: "Clinical Success", 
      val: "98%", 
      icon: <CheckCircle2 size={22} />, 
      color: "bg-emerald-500", 
      trend: "+2.4%" 
    },
    { 
      label: "Revenue Grid", 
      val: "₹42.8k", 
      icon: <TrendingUp size={22} />, 
      color: "bg-indigo-600", 
      trend: "Target" 
    },
  ];

  return (
    <div className="pt-32 pb-24 bg-medical-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold">
            Welcome, Dr. {userProfile?.name?.split(" ")[0] || "Specialist"}
          </h1>
          <p className="text-gray-500 mt-2">
            Pending Requests: {appointments?.filter(a => a.status === "pending").length || 0}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow">
              <div className={`${stat.color} w-10 h-10 flex items-center justify-center text-white rounded`}>
                {stat.icon}
              </div>
              <p className="text-sm text-gray-500 mt-3">{stat.label}</p>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{stat.val}</p>
                <span className="text-green-500 text-xs">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="p-4">Patient</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-400">
                    No appointments found
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="border-t">
                    <td className="p-4 font-medium">{apt.userName}</td>

                    <td className="p-4">
                      {apt.date} <br />
                      <span className="text-xs text-gray-400">{apt.time}</span>
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded text-xs ${
                        apt.status === "confirmed"
                          ? "bg-green-100 text-green-600"
                          : apt.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {apt.status}
                      </span>
                    </td>

                    <td className="p-4 space-x-2">
                      {apt.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(apt.id, "confirmed")}
                            className="px-3 py-1 bg-green-500 text-white rounded"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(apt.id, "rejected")}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleQuickAction("View")}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;