import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, ArrowRight, Activity, Eye, EyeOff } from "lucide-react";
// reCAPTCHA removed per user request
import { registerUser } from "../lib/firebase/auth";
import { toast } from "react-toastify";
import { sanitizeFormData, isValidEmail, isValidPhone, validatePassword } from "../utils/validation";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "user" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // reCAPTCHA removed: proceed without captcha validation

    // Validate email
    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate phone
    if (!isValidPhone(form.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.message);
      return;
    }

    // Sanitize form data
    const sanitizedForm = sanitizeFormData(form);

    setLoading(true);
    try {
      await registerUser(sanitizedForm.email, sanitizedForm.password, {
        name: sanitizedForm.name,
        phone: sanitizedForm.phone,
        role: sanitizedForm.role,
      });
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* LOGO & HEADER */}
        <div className="text-center mb-10">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Activity size={18} />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">DocBook</span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create Account
          </h1>

          <p className="text-slate-600 dark:text-slate-300">
            Join us to book appointments with verified doctors
          </p>
        </div>


        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
            <input
              name="name"
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PHONE */}
          <div className="relative">
            <Phone className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
            <input
              name="phone"
              placeholder="Phone Number"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* reCAPTCHA removed */}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition mt-6"
          >
            {loading ? "Creating Account..." : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-300 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;