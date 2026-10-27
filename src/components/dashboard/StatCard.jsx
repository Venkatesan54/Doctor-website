import React from "react";

const StatCard = ({ icon, label, val, trend }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-blue-600">
          {icon}
        </div>
        {trend && (
          <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">{val}</h2>
      </div>
    </div>
  );
};

export default StatCard;
