import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Clock3,
  HeartPulse,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const specialties = [
  { emoji: "🫀", name: "Cardiology", count: "45+ Doctors" },
  { emoji: "🧠", name: "Neurology", count: "30+ Doctors" },
  { emoji: "🦷", name: "Dentistry", count: "60+ Doctors" },
  { emoji: "👁️", name: "Ophthalmology", count: "25+ Doctors" },
  { emoji: "🩺", name: "General", count: "120+ Doctors" },
  { emoji: "🦴", name: "Orthopedics", count: "38+ Doctors" },
  { emoji: "🌸", name: "Dermatology", count: "42+ Doctors" },
  { emoji: "👶", name: "Pediatrics", count: "55+ Doctors" },
];

const stats = [
  { value: "50k+", label: "Happy patients" },
  { value: "500+", label: "Expert doctors" },
  { value: "98%", label: "Patient satisfaction" },
];

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Find your doctor",
    description: "Search trusted specialists by name or area of care.",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    icon: CalendarCheck,
    number: "02",
    title: "Choose a time",
    description: "Find an appointment that fits your schedule.",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  {
    icon: HeartPulse,
    number: "03",
    title: "Get the care you need",
    description: "Connect with your doctor and focus on feeling better.",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    if (!search.trim()) return;
    navigate(`/doctors?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <section className="relative isolate overflow-hidden bg-[#f5f9ff] dark:bg-slate-900">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-500/10" />
        <div className="pointer-events-none absolute -bottom-48 left-1/4 h-96 w-96 rounded-full bg-teal-100/70 blur-3xl dark:bg-teal-500/10" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:min-h-[650px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-blue-200">
              <Sparkles size={16} aria-hidden="true" />
              Healthcare, made easier
            </div>

            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              The right doctor
              <span className="mt-1 block text-blue-700 dark:text-blue-400">
                is closer than you think.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Find trusted doctors, compare specialties, and book care with confidence.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.28)] dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center"
            >
              <label className="flex min-w-0 flex-1 items-center gap-3 px-2">
                <Search className="shrink-0 text-blue-600 dark:text-blue-400" size={21} aria-hidden="true" />
                <span className="sr-only">Search doctors or specialties</span>
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-white dark:placeholder:text-slate-400"
                  placeholder="Doctor name or specialty"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Find a doctor
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck size={18} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                Verified professionals
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                Care you can trust
              </span>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-slate-200 pt-6 dark:border-slate-700">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -left-5 top-12 z-10 hidden h-24 w-24 rounded-3xl border border-white/70 bg-white/70 backdrop-blur-sm sm:block dark:border-slate-700/70 dark:bg-slate-800/70" />
            <div className="relative overflow-hidden rounded-[2rem] bg-blue-100 shadow-[0_30px_70px_-28px_rgba(15,23,42,0.45)] dark:bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1000&q=80&auto=format&fm=webp"
                alt="Doctor talking with a patient in a bright, modern clinic"
                fetchPriority="high"
                className="h-[360px] w-full object-cover sm:h-[440px] lg:h-[520px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-lg backdrop-blur-md dark:border-slate-600 dark:bg-slate-900/90 sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <Activity size={21} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Care that fits your life</p>
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Start with a specialist near you</p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex dark:bg-emerald-900/40 dark:text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Here to help
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 hidden items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-xl sm:flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <Clock3 size={18} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
              Convenient appointments
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-950 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-400">
                Browse by care
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                Find your specialty
              </h2>
              <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
                Explore care options and connect with the right specialist.
              </p>
            </div>
            <Link
              to="/doctors"
              className="hidden items-center gap-2 pb-1 font-semibold text-blue-700 transition hover:text-blue-900 sm:inline-flex dark:text-blue-400 dark:hover:text-blue-300"
            >
              All doctors <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {specialties.map((specialty) => (
              <Link
                key={specialty.name}
                to={`/doctors?specialty=${encodeURIComponent(specialty.name)}`}
                className="group rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800 sm:p-5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl transition group-hover:bg-blue-50 dark:bg-slate-800 dark:group-hover:bg-blue-950/60">
                  {specialty.emoji}
                </span>
                <p className="mt-4 font-semibold text-slate-900 group-hover:text-blue-800 dark:text-white dark:group-hover:text-blue-300">
                  {specialty.name}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{specialty.count}</p>
              </Link>
            ))}
          </div>
          <Link
            to="/doctors"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700 sm:hidden dark:text-blue-400"
          >
            View all doctors <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="bg-[#f5f9ff] py-16 dark:bg-slate-900 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-400">
              Simple from the start
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              Your next step to better care
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, description, color }) => (
              <article
                key={number}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                    {React.createElement(Icon, { size: 22, "aria-hidden": true })}
                  </span>
                  <span className="text-sm font-bold tracking-widest text-slate-300 dark:text-slate-700">
                    {number}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-2 leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 dark:bg-slate-950 sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 right-1/3 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-blue-100">
                <MapPin size={15} aria-hidden="true" />
                Care in your community
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Find hospitals and labs nearby
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-300">
                Explore local healthcare facilities and find the services you need.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                to="/find-nearby/hospitals"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Explore hospitals <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                to="/find-nearby/labs"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Explore labs <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
