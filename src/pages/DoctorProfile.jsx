  import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Star, MapPin, Clock, ShieldCheck, Heart, 
  ArrowRight, Share2, Calendar, Activity, 
  Award, BookOpen, User, Phone, Globe, ChevronRight, MessageSquare,
  Send, AlertCircle, CheckCircle2
} from "lucide-react";
import { getDoctorById, toggleFavorite, addReview, getReviews } from "../lib/firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import BookingModal from "../components/BookingModal";

const DoctorProfile = () => {
  const { id } = useParams();
  const { currentUser, userProfile } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);



  // Sync favorite state
  useEffect(() => {
    if (userProfile?.favorites) {
      setIsFavorite(userProfile.favorites.includes(id));
    } else {
      setIsFavorite(false);
    }
  }, [id, userProfile?.favorites]);

  // Fetch doctor & reviews
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const data = await getDoctorById(id);
        if (data) {
          setDoctor(data);
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const revs = await getReviews(id);
        setReviews(revs || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchDoctorData();
    fetchReviews();
    window.scrollTo(0, 0);
  }, [id]);

  // Toggle favorite
  const handleToggleFavorite = async () => {
    if (!currentUser) {
      toast.info("Please login to save favorites!");
      return;
    }

    setFavLoading(true);
    try {
      await toggleFavorite(currentUser.uid, id, isFavorite);
      const newState = !isFavorite;
      setIsFavorite(newState);
      toast.success(newState ? "Added to favorites" : "Removed from favorites");
    } catch {
      toast.error("Failed to update favorites");
    } finally {
      setFavLoading(false);
    }
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.info("Please login to leave a review!");
      return;
    }

    if (!newReview.comment.trim()) {
      toast.warning("Please add some feedback!");
      return;
    }

    setSubmittingReview(true);

    try {
      const reviewData = {
        userId: currentUser.uid,
        userName: userProfile?.name || currentUser.displayName || "Patient",
        rating: newReview.rating,
        comment: newReview.comment,
      };

      await addReview(id, reviewData);

      const updatedRevs = await getReviews(id);
      setReviews(updatedRevs || []);

      const updatedDoc = await getDoctorById(id);
      setDoctor(updatedDoc);

      setNewReview({ rating: 5, comment: "" });
      toast.success("Review submitted successfully!");
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-screen bg-medical-surface">
        <div className="w-16 h-16 border-4 border-medical-blue border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
          Loading...
        </p>
      </div>
    );
  }

  // Not found
  if (!doctor) {
    return (
      <div className="pt-32 text-center h-screen bg-medical-surface px-4">
        <AlertCircle size={48} className="mx-auto text-red-400 mb-6" />
        <h2 className="text-2xl font-bold">Doctor Not Found</h2>
        <Link to="/doctors" className="btn-primary mt-6 inline-block">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 min-h-screen bg-slate-50">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/doctors" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
            <ArrowRight size={20} className="rotate-180" />
            Back
          </Link>

          <button
            onClick={handleToggleFavorite}
            disabled={favLoading}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            title="Add to favorites"
          >
            <Heart
              size={24}
              fill={isFavorite ? "#ef4444" : "none"}
              color={isFavorite ? "#ef4444" : "#999"}
              className="transition"
            />
          </button>
        </div>

        {/* DOCTOR INFO SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">

            {/* IMAGE */}
            <div className="flex justify-center md:justify-start">
              <img
                src={doctor.image || `https://ui-avatars.com/api/?name=${doctor.name || "Doctor"}&background=random&size=400`}
                alt={doctor.name}
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-md"
              />
            </div>

            {/* DETAILS */}
            <div className="md:col-span-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Dr. {doctor.name}
              </h1>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Activity className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-slate-600">Specialty</p>
                    <p className="font-semibold text-slate-900">{doctor.specialty || "General"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-slate-600">Location</p>
                    <p className="font-semibold text-slate-900">{doctor.location || doctor.hospital || "Clinic"}</p>
                    {doctor.location?.toLowerCase().includes("tamil nadu") && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold text-white bg-emerald-600 rounded-xl">
                        Tamil Nadu Top Doctor
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Award className="text-purple-600" size={20} />
                  <div>
                    <p className="text-sm text-slate-600">Experience</p>
                    <p className="font-semibold text-slate-900">{doctor.experience || 5}+ Years</p>
                  </div>
                </div>

                {doctor.verified && (
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-green-600" size={20} />
                    <p className="font-semibold text-green-600">Verified Doctor</p>
                  </div>
                )}
              </div>

              {/* RATING */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.round(doctor.rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                    />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{doctor.rating || "4.5"}</p>
                  <p className="text-sm text-slate-600">Based on {reviews.length} reviews</p>
                </div>
              </div>

              {/* FEES */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-600">Consultation Fee</p>
                <p className="text-2xl font-bold text-blue-600">₹{doctor.fee || 500}</p>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Calendar size={20} />
                  Book Appointment
                </button>
                <Link
                  to={`/chat/${id}`}
                  className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare size={20} />
                  Message
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
          <p className="text-slate-700 leading-relaxed">
            {doctor.bio || "Highly experienced and compassionate healthcare professional dedicated to providing the best medical care to patients."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{doctor.experience || 5}+</p>
              <p className="text-sm text-slate-600">Years Experience</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{reviews.length}</p>
              <p className="text-sm text-slate-600">Patient Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">98%</p>
              <p className="text-sm text-slate-600">Success Rate</p>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MessageSquare size={24} />
            Patient Reviews ({reviews.length})
          </h2>

          {reviewsLoading ? (
            <p className="text-center py-8 text-slate-600">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className="space-y-4 mb-8">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{rev.userName}</p>
                      <p className="text-xs text-slate-500">
                        {rev.createdAt?.seconds
                          ? new Date(rev.createdAt.seconds * 1000).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < (rev.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-slate-500">No reviews yet. Be the first to review!</p>
          )}

          {/* ADD REVIEW FORM */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-semibold text-slate-900 mb-4">Share Your Experience</h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">

              {/* RATING */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="transition"
                    >
                      <Star
                        size={24}
                        className={star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* COMMENT */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this doctor..."
                  rows="4"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 placeholder-slate-500"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={submittingReview || !newReview.comment.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                <Send size={18} />
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={doctor}
      />
    </div>
  );
};

export default DoctorProfile;