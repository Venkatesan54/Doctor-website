import React from "react";
import { Activity, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AppointmentRow = ({ apt }) => {
  const navigate = useNavigate();
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-2xl transition-all">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
        <div className="flex gap-4 min-w-0">
          <div className="w-14 h-14 shrink-0 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Activity size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 cursor-help" title={apt.status === 'confirmed' ? 'Appointment Confirmed' : 'Appointment Pending'}>
              <span className={`w-2 h-2 rounded-full ${apt.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{apt.status}</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">Dr. {apt.doctorName}</h3>
            <p className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-tighter">{apt.doctorSpecialty || "General Physician"}</p>
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-1">
          <p className="text-sm font-black text-slate-900 dark:text-white">{apt.date}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">@ {apt.time}</p>
        </div>
        <button 
          onClick={() => navigate(`/chat/${apt.doctorId}`)}
          className="p-4 w-full md:w-auto flex justify-center shrink-0 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
        >
          <MessageSquare size={20} />
        </button>
      </div>
    </div>
  );
};

export default AppointmentRow;
