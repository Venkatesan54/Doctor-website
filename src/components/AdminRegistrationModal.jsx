import React, { useState, useEffect } from "react";
import {
  X
} from "lucide-react";
import { toast } from "react-toastify";
import { addDoctor, addHospital, addLab } from "../lib/firebase/firestore";

const getRandomAvatar = () =>
  `https://ui-avatars.com/api/?name=User&background=random`;

const initialState = {
  name: "",
  specialty: "",
  hospital: "",
  experience: "",
  fee: "",
  email: "",
  phone: "",
  address: "",
  about: "",
  services: "",
  beds: "",
  image: getRandomAvatar(),
};

const AdminRegistrationModal = ({ isOpen, onClose, onRefresh }) => {
  const [type, setType] = useState("doctor");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  // ✅ Reset form when type changes
  useEffect(() => {
    setFormData({ ...initialState, image: getRandomAvatar() });
  }, [type]);

  // ✅ Lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parseServices = (services) =>
    services
      ? services.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  // ✅ Validation
  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";

    if (type === "doctor") {
      if (!formData.specialty.trim()) return "Specialty required";
      if (!formData.hospital.trim()) return "Hospital required";
      if (!formData.experience || Number(formData.experience) <= 0)
        return "Valid experience required";
      if (!formData.fee || Number(formData.fee) <= 0)
        return "Valid fee required";
    }

    if (type !== "doctor") {
      if (!formData.address.trim()) return "Address required";
      if (!formData.phone.trim()) return "Phone required";
      if (!/^\d{10}$/.test(formData.phone))
        return "Enter valid 10-digit phone number";
    }

    if (type === "lab" && formData.email) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailValid.test(formData.email)) return "Invalid email";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validateForm();
    if (errorMsg) return toast.error(errorMsg);

    setLoading(true);

    try {
      if (type === "doctor") {
        await addDoctor({
          name: formData.name.trim(),
          specialty: formData.specialty.trim(),
          experience: Number(formData.experience),
          hospital: formData.hospital.trim(),
          fee: Number(formData.fee),
          about: formData.about || "",
          image: formData.image,
          status: "approved",
          verified: true,
          createdAt: new Date(),
        });
      }

      if (type === "hospital") {
        await addHospital({
          name: formData.name.trim(),
          address: formData.address.trim(),
          phone: formData.phone.trim(),
          beds: Number(formData.beds) || 0,
          services: parseServices(formData.services),
          image:
            "https://images.unsplash.com/photo-1586773860418-d3b979515c3d",
          createdAt: new Date(),
        });
      }

      if (type === "lab") {
        await addLab({
          name: formData.name.trim(),
          address: formData.address.trim(),
          phone: formData.phone.trim(),
          email: formData.email || "",
          services: parseServices(formData.services),
          image:
            "https://images.unsplash.com/photo-1579154235602-3868da34f89d",
          createdAt: new Date(),
        });
      }

      toast.success(`${type} added successfully ✅`);

      onRefresh?.();
      onClose();

      setFormData({ ...initialState, image: getRandomAvatar() });

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-500 animate-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white dark:border-slate-800 p-10 max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-up">

        {/* Header Portfolio */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black font-outfit text-slate-900 dark:text-white capitalize tracking-tight">
              Register {type}
            </h2>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Authorized Infrastructure Deployment</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-2xl transition-all hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>

        {/* Dynamic Entity Selector */}
        <div className="flex gap-3 mb-10 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-[2rem] border border-slate-100 dark:border-slate-800">
          {["doctor", "hospital", "lab"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                type === t
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xl"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Registration Protocol Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Identification Name</label>
               <input name="name" placeholder="Full Name / Entity Title" value={formData.name} onChange={handleChange} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-slate-900 dark:text-white font-bold" required />
            </div>

            {type === "doctor" && (
              <div className="grid sm:grid-cols-2 gap-6 animate-fade-up">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Medical Specialty</label>
                  <input name="specialty" placeholder="e.g. Cardiology" value={formData.specialty} onChange={handleChange} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-slate-900 dark:text-white font-bold" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Affiliated Hospital</label>
                  <input name="hospital" placeholder="Medical Center Name" value={formData.hospital} onChange={handleChange} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-slate-900 dark:text-white font-bold" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Tenure (Years)</label>
                  <input name="experience" type="number" placeholder="Years of Exp." value={formData.experience} onChange={handleChange} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-slate-900 dark:text-white font-bold" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Consultation Fee</label>
                  <input name="fee" type="number" placeholder="USD ($)" value={formData.fee} onChange={handleChange} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-slate-900 dark:text-white font-bold" required />
                </div>
              </div>
            )}

            {type !== "doctor" && (
              <div className="space-y-6 animate-fade-up">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Geographic Coordinates (Address)</label>
                  <input name="address" placeholder="Master Location" value={formData.address} onChange={handleChange} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-slate-900 dark:text-white font-bold" required />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Communications (Phone)</label>
                    <input name="phone" placeholder="Contact Mobile" value={formData.phone} onChange={handleChange} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-slate-900 dark:text-white font-bold" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">{type === 'hospital' ? 'Total Beds' : 'Email Protocol'}</label>
                    <input name={type === 'hospital' ? 'beds' : 'email'} placeholder={type === 'hospital' ? 'No. of Beds' : 'Inbound Email'} value={type === 'hospital' ? formData.beds : formData.email} onChange={handleChange} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-slate-900 dark:text-white font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Service Matrix (Comma Separated)</label>
                  <textarea name="services" placeholder="e.g. ICU, Emergency, Diagnostics..." value={formData.services} onChange={handleChange} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-slate-900 dark:text-white font-bold h-32 resize-none" />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-20 bg-slate-900 dark:bg-blue-600 text-white rounded-3xl text-sm font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 group relative overflow-hidden mt-8"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10">{loading ? "Synchronizing..." : `Deploy ${type} to registry`}</span>
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminRegistrationModal;