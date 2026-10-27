import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, UserCheck, Shield, BookOpen, 
  Activity, TrendingUp, Search, MoreVertical,
  CheckCircle2, XCircle, AlertCircle, Building2,
  Settings, Save, Globe, Info, Headphones,
  ChevronRight, ArrowRight, Mail, Trash2, Eye, Calendar, X,
  LayoutDashboard, Server, ShieldPlus, BarChart3, RefreshCw, FlaskConical,
  ExternalLink, FileText, MapPin, Phone, CreditCard, Award
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { 
  deleteDoctor, 
  deleteHospital, 
  deleteLab, 
  deleteUserProfile, 
  deleteAppointment,
  updateDoctorStatus
} from "../lib/firebase/firestore";
import { seedDoctors } from "../utils/seedData";
import AdminRegistrationModal from "../components/AdminRegistrationModal";
import { toast } from "react-toastify";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("doctors");
  const [data, setData] = useState({ doctors: [], users: [], appointments: [], hospitals: [], labs: [] });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Site Management State
  const [siteSettings, setSiteSettings] = useState({
    siteName: "DocBook Pro",
    contactEmail: "admin@docbook.com",
    maintenanceMode: false,
    featuredSpecialty: "Cardiology",
    apiVersion: "v2.4.0",
    serverStatus: "Online"
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [docSnap, userSnap, aptSnap, hospSnap, labSnap] = await Promise.all([
          getDocs(collection(db, "doctors")),
          getDocs(collection(db, "users")),
          getDocs(collection(db, "appointments")),
          getDocs(collection(db, "hospitals")),
          getDocs(collection(db, "labs"))
        ]);
        
        setData({ 
          doctors: docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          users: userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          appointments: aptSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          hospitals: hospSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          labs: labSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Database synchronization failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you absolutely sure you want to purge this ${type}? This action is irreversible.`)) return;
    try {
      if (type === 'doctor') await deleteDoctor(id);
      else if (type === 'hospital') await deleteHospital(id);
      else if (type === 'lab') await deleteLab(id);
      else if (type === 'user') await deleteUserProfile(id);
      else if (type === 'appointment') await deleteAppointment(id);
      
      toast.success(`${type} purged from registry.`);
      handleRefresh();
    } catch (error) {
      toast.error("Cleanup failed: " + error.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateDoctorStatus(id, 'approved');
      toast.success("Medical Expert Authorized & Approved");
      handleRefresh();
    } catch (error) {
      toast.error("Approval sequence failed: " + error.message);
    }
  };

  const handleVisit = (type, item) => {
    setSelectedEntity({ type, ...item });
  };

  const handleSeed = async () => {
    try {
      toast.info("Initializing massive seeding... Please wait.");
      const count = await seedDoctors();
      toast.success(`Successfully injected ${count} medical experts into core database!`);
      handleRefresh();
    } catch (error) {
      toast.error("Seeding failed: " + error.message);
    }
  };

  const totalRevenue = data.appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => sum + (Number(a.fee) || 0), 0);

  const stats = [
    { label: "Total Patients", val: data.users.length, sub: "Registered users", icon: <Users size={22} />, color: "bg-blue-600", trend: "+12%" },
    { label: "Total Bookings", val: data.appointments.length, sub: "All time records", icon: <Activity size={22} />, color: "bg-emerald-500", trend: "+8%" },
    { label: "Revenue", val: `$${totalRevenue.toLocaleString()}`, sub: "Confirmed earnings", icon: <TrendingUp size={22} />, color: "bg-amber-500", trend: "+15.2%" },
    { label: "Active Doctors", val: data.doctors.length, sub: "Verified experts", icon: <UserCheck size={22} />, color: "bg-purple-600", trend: "+5.4%" },
  ];

  return (
    <div className="pt-24 pb-16 bg-slate-100 dark:bg-slate-900 min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Manage doctors, users, appointments, and facilities</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
             <button onClick={handleSeed} className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                <RefreshCw size={16} /> Seed Data
             </button>
             <button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <ArrowRight size={16} /> Add Entity
             </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg text-white flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">{stat.trend}</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.val}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          
          {/* Clean Tab Navigation */}
          <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-6">
            {[
              { id: "doctors", label: "Doctors", icon: <UserCheck size={16} /> },
              { id: "users", label: "Users", icon: <Users size={16} /> },
              { id: "appointments", label: "Appointments", icon: <Calendar size={16} /> },
              { id: "hospitals", label: "Hospitals", icon: <Building2 size={16} /> },
              { id: "labs", label: "Labs", icon: <FlaskConical size={16} /> },
              { id: "settings", label: "Settings", icon: <Settings size={16} /> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
                   activeTab === tab.id
                  ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400" 
                  : "text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            
            {/* Search and Controls */}
            {activeTab !== "settings" && (
               <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
                  <div className="relative flex-1 sm:max-w-xs">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
                     <input 
                       type="text" 
                       placeholder={`Search ${activeTab}...`}
                       className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                     />
                  </div>
                  {(activeTab === "hospitals" || activeTab === "labs") && (
                     <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 gap-1">
                        <button onClick={() => setActiveTab("hospitals")} className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${activeTab === 'hospitals' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>Hospitals</button>
                        <button onClick={() => setActiveTab("labs")} className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${activeTab === 'labs' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>Labs</button>
                     </div>
                  )}
               </div>
            )}

            {/* Content Area */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="animate-spin w-8 h-8 border-3 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading...</p>
                 </div>
              ) : activeTab === 'settings' ? (
                 <div className="max-w-4xl animate-fade-up">
                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                       <div className="space-y-6">
                          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-4">Site Name</label>
                            <input value={siteSettings.siteName} onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})} className="w-full pb-2 border-b border-slate-200 dark:border-slate-600 focus:border-blue-500 outline-none text-lg font-semibold text-slate-900 dark:text-white bg-transparent transition-colors" />
                          </div>
                          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-4">Contact Email</label>
                            <input value={siteSettings.contactEmail} onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})} className="w-full pb-2 border-b border-slate-200 dark:border-slate-600 focus:border-blue-500 outline-none text-lg font-semibold text-slate-900 dark:text-white bg-transparent transition-colors" />
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-4">Featured Specialty</label>
                            <input value={siteSettings.featuredSpecialty} onChange={(e) => setSiteSettings({...siteSettings, featuredSpecialty: e.target.value})} className="w-full pb-2 border-b border-slate-200 dark:border-slate-600 focus:border-blue-500 outline-none text-lg font-semibold text-slate-900 dark:text-white bg-transparent transition-colors" />
                          </div>
                          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                               <div>
                                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Maintenance Mode</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{siteSettings.maintenanceMode ? 'System Offline' : 'System Online'}</p>
                               </div>
                               <button 
                                 onClick={() => setSiteSettings({...siteSettings, maintenanceMode: !siteSettings.maintenanceMode})}
                                 className={`w-12 h-7 rounded-full relative transition-colors ${siteSettings.maintenanceMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                               >
                                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${siteSettings.maintenanceMode ? 'left-6' : 'left-1'}`} />
                               </button>
                            </div>
                          </div>
                       </div>
                    </div>
                    <button onClick={() => toast.success("Settings saved successfully!")} className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg text-sm font-semibold shadow-sm transition-colors">
                       Save Settings
                    </button>
                    
                    <div className="mt-8 grid grid-cols-3 gap-4">
                       <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">API Version</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{siteSettings.apiVersion}</p>
                       </div>
                       <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Server Status</p>
                          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{siteSettings.serverStatus}</p>
                       </div>
                       <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Last Updated</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Today</p>
                       </div>
                    </div>
                 </div>
              ) : (
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Details</th>
                        <th className="px-6 py-4">Info</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {(activeTab === 'doctors' ? data.doctors : 
                        activeTab === 'users' ? data.users : 
                        activeTab === 'appointments' ? data.appointments : 
                        activeTab === 'hospitals' ? data.hospitals : data.labs).map((item) => {
                        
                        const displayType = activeTab === 'doctors' ? 'doctor' : 
                                           activeTab === 'users' ? 'user' : 
                                           activeTab === 'appointments' ? 'appointment' :
                                           activeTab === 'hospitals' ? 'hospital' : 'lab';
                        
                        return (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                                activeTab === 'doctors' ? 'bg-blue-600' : 
                                activeTab === 'users' ? 'bg-purple-600' :
                                activeTab === 'appointments' ? 'bg-amber-600' :
                                activeTab === 'hospitals' ? 'bg-emerald-600' : 'bg-indigo-600'
                              }`}>
                                {item.name?.charAt(0) || item.userName?.charAt(0) || item.doctorName?.charAt(0) || "M"}
                              </div>
                              <div>
                                 <p className="font-semibold text-slate-900 dark:text-white">
                                   {activeTab === 'doctors' ? `Dr. ${item.name}` : 
                                    activeTab === 'appointments' ? `${item.userName || 'User'}` :
                                    item.name || item.userName || 'Unknown'}
                                 </p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">#{item.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                             <p className="font-medium text-slate-900 dark:text-slate-100">
                              {activeTab === 'doctors' ? item.specialty : 
                               activeTab === 'users' ? (item.role || 'Patient') :
                               activeTab === 'appointments' ? `Dr. ${item.doctorName}` :
                               (item.beds ? `${item.beds} Beds` : 'Facility')}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                             {activeTab === 'doctors' ? `${item.experience} years` : 
                              activeTab === 'appointments' ? `${item.date} at ${item.time}` :
                              activeTab === 'hospitals' || activeTab === 'labs' ? item.address?.slice(0, 30) || 'N/A' :
                              'Active'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                               (item.status === 'approved' || item.status === 'confirmed' || activeTab === 'users') ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 
                               item.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                               'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${(item.status === 'approved' || item.status === 'confirmed' || activeTab === 'users') ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                                {item.status || (activeTab === 'users' ? "Active" : "Normal")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                               {item.status === 'pending' && activeTab === 'doctors' && (
                                  <button onClick={() => handleApprove(item.id)} className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors" title="Approve">
                                    <CheckCircle2 size={18} />
                                  </button>
                               )}
                               <button onClick={() => handleVisit(displayType, item)} className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors" title="View">
                                 <Eye size={18} />
                               </button>
                               <button onClick={() => handleDelete(displayType, item.id)} className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white transition-colors" title="Delete">
                                 <Trash2 size={18} />
                               </button>
                            </div>
                          </td>
                        </tr>
                      )})}
                      {(activeTab === 'doctors' ? data.doctors : 
                         activeTab === 'users' ? data.users : 
                         activeTab === 'appointments' ? data.appointments :
                         activeTab === 'hospitals' ? data.hospitals : data.labs).length === 0 && (
                        <tr>
                           <td colSpan="5" className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center">
                                 <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4">
                                    <AlertCircle size={32} />
                                 </div>
                                 <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No records found</h4>
                                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No {activeTab} available at the moment</p>
                              </div>
                           </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AdminRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={handleRefresh}
      />

      <DetailModal 
        entity={selectedEntity} 
        onClose={() => setSelectedEntity(null)} 
      />
    </div>
  );
};

const DetailModal = ({ entity, onClose }) => {
  const navigate = useNavigate();
  if (!entity) return null;

  const renderField = (icon, label, value) => (
    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white overflow-wrap">{value || "N/A"}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-up">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-start">
          <div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
               {entity.name || entity.doctorName || "Entity Details"}
               <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-semibold">{entity.type}</span>
             </h3>
             <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">ID: <span className="text-blue-600 dark:text-blue-400 font-mono">{entity.id}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors flex items-center justify-center shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
           {entity.type === 'doctor' && (
             <>
               {renderField(<UserCheck size={16} />, "Specialty", entity.specialty)}
               {renderField(<Building2 size={16} />, "Hospital", entity.hospital)}
               {renderField(<Award size={16} />, "Experience", `${entity.experience} Years`)}
               {renderField(<CreditCard size={16} />, "Fee", `$${entity.fee}`)}
               {renderField(<Activity size={16} />, "Status", entity.status)}
               {renderField(<Mail size={16} />, "Email", entity.email || "N/A")}
             </>
           )}
           {entity.type === 'user' && (
             <>
               {renderField(<Mail size={16} />, "Email", entity.email)}
               {renderField(<Shield size={16} />, "Role", entity.role)}
               {renderField(<Calendar size={16} />, "Joined", entity.createdAt ? (typeof entity.createdAt === 'string' ? entity.createdAt : "Recently") : "N/A")}
               {renderField(<Activity size={16} />, "Status", "Active")}
             </>
           )}
            {entity.type === 'appointment' && (
              <>
                {renderField(<UserCheck size={16} />, "Doctor", entity.doctorName)}
                {renderField(<Calendar size={16} />, "Date & Time", `${entity.date} @ ${entity.time}`)}
                {renderField(<CreditCard size={16} />, "Consultation Fee", `$${entity.fee || 0}`)}
                {renderField(<Activity size={16} />, "Status", entity.status)}
                {renderField(<CreditCard size={16} />, "Payment Method", entity.paymentMethod || "Pending")}
                {renderField(<Shield size={16} />, "Transaction ID", entity.transactionId || "N/A")}
                {renderField(<FileText size={16} />, "Notes", entity.notes)}
                {renderField(<MapPin size={16} />, "Location", entity.location)}
              </>
            )}
           {(entity.type === 'hospital' || entity.type === 'lab') && (
             <>
               {renderField(<MapPin size={16} />, "Address", entity.address)}
               {renderField(<Phone size={16} />, "Phone", entity.phone)}
               {renderField(<Award size={16} />, "Services", entity.services?.join(", "))}
               {renderField(<CreditCard size={16} />, "Capacity", entity.beds ? `${entity.beds} Beds` : "Diagnostic")}
             </>
           )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
           <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
             Close
           </button>
           {entity.type === 'doctor' && (
             <button onClick={() => { navigate(`/doctor/${entity.id}`); onClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
               View Profile <ExternalLink size={14} />
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;


