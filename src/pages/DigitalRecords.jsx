import React, { useState, useEffect, useCallback } from "react";
import { 
  FileText, Download, Trash2, 
  Search, Filter, Calendar, 
  UploadCloud, X, CheckCircle2, 
  ShieldCheck, Eye, RefreshCw
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { uploadPrescription, getPrescriptions } from "../lib/firebase/firestore";
import { toast } from "react-toastify";

const DigitalRecords = () => {
  const { currentUser } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Upload form state
  const [file, setFile] = useState(null);
  const [doctorName, setDoctorName] = useState("");

  const fetchRecords = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const data = await getPrescriptions(currentUser.uid);
      setPrescriptions(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !doctorName) {
      toast.error("Please provide both file and doctor name");
      return;
    }

    try {
      setUploading(true);
      await uploadPrescription(currentUser.uid, file, doctorName);
      toast.success("Prescription uploaded securely!");
      setShowUploadModal(false);
      setFile(null);
      setDoctorName("");
      fetchRecords(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={32} />
              Digital Health Records
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Securely store and access your medical prescriptions anytime, anywhere.</p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="w-full md:w-auto px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all scale-100 hover:scale-[1.02] active:scale-95"
          >
            <UploadCloud size={20} />
            UPLOAD NEW RECORD
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Records</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{prescriptions.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Storage Status</p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="text-emerald-500" size={18} />
              <p className="text-sm font-bold text-emerald-600">Encrypted & Secure</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last Upload</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {prescriptions[0]?.uploadedAt?.toDate ? prescriptions[0].uploadedAt.toDate().toLocaleDateString() : "No records"}
            </p>
          </div>
        </div>

        {/* Records List */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
             <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by doctor or date..." 
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                />
             </div>
             <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400">
                  <Filter size={14} /> Filter
                </button>
             </div>
          </div>

          <div className="p-4 sm:p-8">
            {loading ? (
              <div className="py-20 text-center">
                 <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading vault...</p>
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="py-20 text-center">
                 <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                    <FileText size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Prescriptions Yet</h3>
                 <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">Start uploading your medical documents to build your digital health timeline.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prescriptions.map((record) => (
                  <div key={record.id} className="group bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 dark:border-slate-700">
                        <FileText size={24} />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <a href={record.fileURL} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-600 hover:text-blue-600 shadow-sm border border-slate-100 dark:border-slate-700"><Eye size={16} /></a>
                         <button className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-600 hover:text-red-600 shadow-sm border border-slate-100 dark:border-slate-700"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <h4 className="font-black text-slate-900 dark:text-white leading-tight mb-1 truncate">{record.fileName}</h4>
                    <p className="text-xs font-bold text-blue-600 mb-4">By Dr. {record.doctorName}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                       <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          <Calendar size={12} /> {record.uploadedAt?.toDate?.()?.toLocaleDateString() || "Recent"}
                       </span>
                       <a 
                         href={record.fileURL} 
                         download={record.fileName}
                         className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                       >
                         DOWNLOAD <Download size={12} />
                       </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
           <ShieldCheck className="text-blue-600" size={20} />
           <p className="text-xs text-blue-800 dark:text-blue-400 font-medium">All records are encrypted using AES-256 standards and stored in compliant medical cloud infrastructure.</p>
        </div>

      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">Secure Upload</h3>
                 <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleUpload} className="p-8 space-y-6 text-left">
                 <div className="space-y-4">
                    <label className="block">
                       <span className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Doctor's Name</span>
                       <input 
                         type="text" 
                         required
                         value={doctorName}
                         onChange={(e) => setDoctorName(e.target.value)}
                         placeholder="e.g. Dr. Ramesh Kumar"
                         className="mt-2 w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                       />
                    </label>

                    <div className="relative">
                       <span className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Select Document</span>
                       <div className={`mt-2 h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-all ${file ? 'border-emerald-500/50 bg-emerald-50/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>
                          <input 
                            type="file" 
                            accept="image/*,.pdf" 
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          {file ? (
                             <>
                                <CheckCircle2 className="text-emerald-500 mb-2" size={32} />
                                <p className="text-sm font-bold text-emerald-600 truncate max-w-[200px]">{file.name}</p>
                                <button type="button" onClick={(e) => {e.preventDefault(); setFile(null)}} className="text-[10px] font-black text-red-500 uppercase mt-2 hover:underline">Remove File</button>
                             </>
                          ) : (
                            <>
                               <UploadCloud className="text-slate-300 mb-2" size={32} />
                               <p className="text-xs font-bold text-slate-400">Click or drag to upload</p>
                               <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">PDF or Image (Max 5MB)</p>
                            </>
                          )}
                       </div>
                    </div>
                 </div>

                 <button
                   type="submit"
                   disabled={uploading}
                   className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 dark:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                   {uploading ? (
                      <>
                        <RefreshCw className="animate-spin" size={20} />
                        UPLOADING VAULT...
                      </>
                   ) : (
                      <>
                        CONFIRM UPLOAD
                        <ShieldCheck size={20} />
                      </>
                   )}
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default DigitalRecords;
