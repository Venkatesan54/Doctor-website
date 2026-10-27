import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Calendar,
  ShieldCheck,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  createAppointment,
  checkSlotAvailability,
} from "../lib/firebase/firestore";
import { createCheckoutSession } from "../lib/payments";
import { useAuth } from "../context/AuthContext";

const BookingModal = ({ isOpen, onClose, doctor }) => {
  const { currentUser, userProfile } = useAuth();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const timeSlots = useMemo(() => {
    return doctor?.availability || [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
    ];
  }, [doctor?.availability]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  // Fetch unavailable slots
  useEffect(() => {
    if (!selectedDate || !doctor?.id) return;

    const fetchUnavailable = async () => {
      try {
        const results = await Promise.all(
          timeSlots.map(async (slot) => {
            const available = await checkSlotAvailability(
              doctor.id,
              selectedDate,
              slot
            );
            return available ? null : slot;
          })
        );
        setUnavailableSlots(results.filter(Boolean));
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnavailable();
  }, [selectedDate, doctor?.id, timeSlots]);

  const isPastTime = (slot) => {
    if (selectedDate !== today) return false;

    const now = new Date();
    const [time, modifier] = slot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const slotDate = new Date();
    slotDate.setHours(hours, minutes, 0);

    return slotDate < now;
  };

  const handleBooking = async () => {
    if (loading) return;

    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Select date & time");
      return;
    }

    setLoading(true);

    try {
      const available = await checkSlotAvailability(
        doctor.id,
        selectedDate,
        selectedTime
      );

      if (!available) {
        toast.error("Slot already booked");
        setLoading(false);
        return;
      }

      // Create appointment first (pending)
      const appointmentId = await createAppointment({
        userId: currentUser.uid,
        userName:
          userProfile?.name || currentUser.displayName || "Patient",
        doctorId: doctor.id,
        doctorName: doctor.name || "Unknown",
        doctorSpecialty: doctor.specialty || "General",
        date: selectedDate,
        time: selectedTime,
        status: "pending",
        fee: doctor.fee || 500,
        createdAt: new Date(),
      });

      // Create Stripe Checkout session and redirect to payment
      try {
        const session = await createCheckoutSession({
          amount: doctor.fee || 500,
          currency: 'inr',
          appointmentId,
          description: `Consultation with Dr. ${doctor.name}`,
        });

        if (session?.url) {
          window.location.href = session.url;
          return; // redirecting
        }
      } catch (err) {
        console.error('Checkout creation failed:', err);
        toast.error('Payment initialization failed. Please try again.');
      }

      toast.success("Appointment created — complete payment to confirm 🎉");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-md"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-800 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-dark p-8 max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-slate-900 dark:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Doctor Info */}
        <div className="text-center mb-6">
          <img
            src={doctor.image || `https://ui-avatars.com/api/?name=${doctor.name || "Doctor"}&background=random`}
            alt={doctor.name}
            className="w-20 h-20 rounded-2xl mx-auto mb-3 shadow"
          />
          <h3 className="text-xl font-bold dark:text-white">Dr. {doctor.name}</h3>
          <p className="text-blue-600 dark:text-blue-400 font-medium">{doctor.specialty}</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 flex justify-center gap-1">
            <MapPin size={14} /> {doctor.hospital || "Clinic"}
          </p>
        </div>

        {/* Fee */}
        <div className="mb-6 flex justify-between bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
          <span className="text-sm text-gray-500 dark:text-slate-400">Consultation Fee</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            ₹{doctor.fee || 500}
          </span>
        </div>

        {/* Date */}
        <div className="mb-5">
          <label className="text-sm font-semibold mb-2 block dark:text-white">
            Select Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400 dark:text-slate-500" />
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime("");
              }}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Time Slots */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-2 block dark:text-white">
            Select Time
          </label>

          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((slot) => {
              const disabled =
                !selectedDate ||
                unavailableSlots.includes(slot) ||
                isPastTime(slot);

              return (
                <button
                  key={slot}
                  disabled={disabled}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition ${
                    selectedTime === slot
                      ? "bg-blue-600 dark:bg-blue-700 text-white shadow"
                      : disabled
                      ? "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                      : "border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky Button */}
        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          {loading ? "Booking..." : "Confirm Booking"}
          <ArrowRight size={18} />
        </button>

        <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-4 flex justify-center gap-1">
          <ShieldCheck size={14} /> Secure Booking
        </p>
      </div>
    </div>
  );
};

export default BookingModal;