import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  HeartPulse,
  Users,
  Award,
  Clock,
  Globe,
} from "lucide-react";

const stats = [
  { value: "50k+", label: "Happy Patients" },
  { value: "500+", label: "Expert Doctors" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support Available" },
];

const values = [
  {
    icon: ShieldCheck,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    title: "Trust & Safety",
    desc: "Every doctor on DocBook is verified and credentialed. Your health data stays private and secure.",
  },
  {
    icon: HeartPulse,
    color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    title: "Patient-First Care",
    desc: "We design every feature around the patient experience — from simple booking to real-time support.",
  },
  {
    icon: Clock,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    title: "Speed & Convenience",
    desc: "Book an appointment in under 2 minutes. No waiting rooms, no phone queues.",
  },
  {
    icon: Globe,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    title: "Accessible Healthcare",
    desc: "We bridge the gap between patients and quality care, no matter where you are.",
  },
  {
    icon: Award,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    title: "Excellence",
    desc: "We partner only with top-rated specialists and accredited hospitals across India.",
  },
  {
    icon: Users,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    title: "Community",
    desc: "A growing network of patients, doctors, and partners united by better healthcare.",
  },
];

const team = [
  {
    name: "Dr. Arun Kumar",
    role: "Co-Founder & CEO",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Natarajan",
    role: "Chief Medical Officer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Raj Venkatesh",
    role: "Head of Engineering",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    name: "Divya Menon",
    role: "Director of Operations",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">

      {/* HERO */}
      <section className="relative bg-linear-to-br from-blue-600 to-blue-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full bg-blue-400/20 blur-2xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/15 border border-white/25 mb-6">
            🏥 Our Story
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5">
            Healthcare Made <span className="text-blue-200">Human</span>
          </h1>

          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            DocBook helps you find trusted doctors and book appointments easily.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/doctors" className="btn-primary">
              Find a Doctor
            </Link>
            <Link to="/register" className="btn-secondary">
              Join for Free
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white dark:bg-slate-800 py-14 border-b border-slate-100 dark:border-slate-700">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, index) => (
            <div key={s.label || index}>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 bg-white dark:bg-slate-800 px-4 mt-2">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, index) => {
            const Icon = v.icon;
            return (
              <div key={v.title || index} className="p-6 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 rounded-2xl hover:shadow-lg dark:hover:shadow-slate-900/50 transition">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 ${v.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 px-4">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Meet Our Team</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={member.name || index} className="p-6 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl text-center hover-lift">
              <img
                src={member.avatar}
                alt={member.name}
                onError={(e) => (e.target.src = "https://via.placeholder.com/120")}
                className="w-20 h-20 mx-auto rounded-xl mb-3"
              />
              <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;