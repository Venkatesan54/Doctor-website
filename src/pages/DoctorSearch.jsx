import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Activity, ChevronRight, X } from "lucide-react";
import DoctorCard from "../components/DoctorCard";
import { getDoctors } from "../lib/firebase/firestore";
import Skeleton from "../components/ui/Skeleton";

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [tamilNaduOnly, setTamilNaduOnly] = useState(false);

  const specialties = [
    "All",
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
    "Orthopedic",
    "Dentist",
    "Ophthalmologist"
  ];

  // ✅ Fetch Doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        const safeData = Array.isArray(data) ? data : [];
        setDoctors(safeData);
        setFilteredDoctors(safeData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // ✅ Filtering Logic
  useEffect(() => {
    let result = [...doctors];

    if (searchTerm) {
      result = result.filter((d) =>
        (d?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d?.specialty?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSpecialty !== "All") {
      result = result.filter(
        (d) =>
          d?.specialty?.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    if (tamilNaduOnly) {
      result = result.filter((d) => d?.location?.toLowerCase().includes("tamil nadu"));
    }

    setFilteredDoctors(result);
  }, [searchTerm, selectedSpecialty, doctors, tamilNaduOnly]);

  // ✅ Reset Filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("All");
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            <span>Home</span>
            <ChevronRight size={10} />
            <span className="text-blue-600 dark:text-blue-400">Specialists</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-4">
            Find the <span className="text-blue-600 dark:text-blue-400">Top Specialists</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            Browse through {doctors.length}+ verified healthcare professionals.
          </p>
        </div>

        {/* Area Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setTamilNaduOnly(false)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              !tamilNaduOnly
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200"
            }`}
          >
            All Doctors
          </button>
          <button
            onClick={() => setTamilNaduOnly(true)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              tamilNaduOnly
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200"
            }`}
          >
            Tamil Nadu Top Doctors
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400">{tamilNaduOnly ? `${filteredDoctors.length} Tamil Nadu doctors` : `${doctors.length} doctors`}</span>
        </div>

        {/* Search Bar */}
        <div className="glass p-5 rounded-[3rem] mb-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex gap-4 flex-col lg:flex-row">

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

              <input
                type="text"
                placeholder="Search doctor or specialty..."
                className="w-full pl-12 pr-10 py-4 rounded-2xl border border-slate-200 dark:border-slate-600 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl flex items-center gap-2 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 flex flex-wrap gap-3">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-4 py-2 rounded-xl text-sm transition ${
                    selectedSpecialty === spec
                      ? "bg-blue-600 dark:bg-blue-700 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {spec}
                </button>
              ))}

              <button
                onClick={resetFilters}
                className="text-red-600 dark:text-red-400 font-bold hover:text-red-700 dark:hover:text-red-300"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="p-8 rounded-[3rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex gap-8">
                <Skeleton className="w-48 h-48 rounded-4xl shrink-0" />
                <div className="flex-1 space-y-4 py-2">
                  <div className="flex gap-2">
                    <Skeleton className="w-20 h-6 rounded" />
                    <Skeleton className="w-20 h-6 rounded" />
                  </div>
                  <Skeleton className="w-3/4 h-8" variant="text" />
                  <div className="space-y-2">
                    <Skeleton className="w-1/2 h-4" variant="text" />
                    <Skeleton className="w-2/3 h-4" variant="text" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Activity size={40} className="mx-auto mb-4 text-slate-400 dark:text-slate-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Doctors Found</h3>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;