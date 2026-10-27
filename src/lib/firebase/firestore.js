import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  serverTimestamp,
  orderBy,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db, storage } from "./config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- DOCTOR SERVICES ---

// Get all doctors
export const getDoctors = async () => {
  try {
    const doctorsCol = collection(db, "doctors");
    const q = query(doctorsCol); 
    const doctorSnapshot = await getDocs(q);
    return doctorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    return [];
  }
};

// Get doctors by specialty
export const getDoctorsBySpecialty = async (specialty) => {
  const q = query(collection(db, "doctors"), where("specialty", "==", specialty));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get doctor by ID
export const getDoctorById = async (id) => {
  const docRef = doc(db, "doctors", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

// --- APPOINTMENT SERVICES ---

// Create appointment
export const createAppointment = async (appointmentData) => {
  const docRef = await addDoc(collection(db, "appointments"), {
    ...appointmentData,
    createdAt: serverTimestamp(),
    status: "pending"
  });
  return docRef.id;
};

// Get user appointments
export const getUserAppointments = async (userId) => {
  const q = query(
    collection(db, "appointments"), 
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return docs.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return timeB - timeA;
  });
};

// Get doctor appointments
export const getDoctorAppointments = async (doctorId) => {
  const q = query(
    collection(db, "appointments"), 
    where("doctorId", "==", doctorId)
  );
  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return docs.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return timeB - timeA;
  });
};

// Update appointment status
export const updateAppointmentStatus = async (appointmentId, status) => {
  const appointmentRef = doc(db, "appointments", appointmentId);
  await updateDoc(appointmentRef, { status });
};

// Update appointment with payment details
export const updateAppointmentPayment = async (appointmentId, paymentData) => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await updateDoc(appointmentRef, {
      status: paymentData.status || 'confirmed',
      paymentMethod: paymentData.method || 'stripe',
      transactionId: paymentData.transactionId || null,
      receiptId: paymentData.receiptId || null,
      paidAt: serverTimestamp()
    });
  } catch (err) {
    console.error('Error updating appointment payment:', err);
    throw err;
  }
};

// Create a payment record (receipt) in Firestore
export const createPaymentRecord = async (payment) => {
  try {
    const docRef = await addDoc(collection(db, "payments"), {
      ...payment,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.error('Error creating payment record:', err);
    throw err;
  }
};

// Check if a time slot is available for a doctor on a specific date
export const checkSlotAvailability = async (doctorId, date, time) => {
  try {
    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctorId),
      where("date", "==", date),
      where("time", "==", time),
      where("status", "!=", "cancelled")
    );
    const querySnapshot = await getDocs(q);
    // Return true if no appointments found at this time (slot is available)
    return querySnapshot.docs.length === 0;
  } catch (error) {
    console.error("Error checking slot availability:", error);
    // If error, assume slot is available
    return true;
  }
};

// --- HOSPITAL & LAB SERVICES ---

// Get nearby hospitals
export const getHospitals = async () => {
  const hospitalsCol = collection(db, "hospitals");
  const hospitalSnapshot = await getDocs(hospitalsCol);
  return hospitalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get nearby labs
export const getLabs = async () => {
  const labsCol = collection(db, "labs");
  const labSnapshot = await getDocs(labsCol);
  return labSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- DATA ENTRY SERVICES ---

// Add a doctor manually
export const addDoctor = async (doctorData) => {
  const docRef = await addDoc(collection(db, "doctors"), {
    ...doctorData,
    createdAt: new Date().toISOString(),
    status: "approved"
  });
  return docRef.id;
};

// Delete a doctor
export const updateDoctorStatus = async (id, status) => {
  try {
    const doctorRef = doc(db, "doctors", id);
    await updateDoc(doctorRef, { status });
    return true;
  } catch (error) {
    console.error("Error updating doctor status:", error);
    throw error;
  }
};

export const deleteDoctor = async (id) => {
  const docRef = doc(db, "doctors", id);
  await deleteDoc(docRef);
};

// Add a hospital manually
export const addHospital = async (hospitalData) => {
  const docRef = await addDoc(collection(db, "hospitals"), {
    ...hospitalData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

// Delete a hospital
export const deleteHospital = async (id) => {
  const docRef = doc(db, "hospitals", id);
  await deleteDoc(docRef);
};

// Add a lab manually
export const addLab = async (labData) => {
  const docRef = await addDoc(collection(db, "labs"), {
    ...labData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

// Delete a lab
export const deleteLab = async (id) => {
  const docRef = doc(db, "labs", id);
  await deleteDoc(docRef);
};

// --- USER & ADMIN SERVICES ---

// Delete a user profile from Firestore
export const deleteUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
};

// Delete an appointment
export const deleteAppointment = async (id) => {
  const aptRef = doc(db, "appointments", id);
  await deleteDoc(aptRef);
};

// --- FAVORITES & REVIEWS ---

// Toggle favorite doctor for a user
export const toggleFavorite = async (userId, doctorId, isCurrentlyFavorite) => {
  try {
    const userRef = doc(db, "users", userId);
    if (isCurrentlyFavorite) {
      await updateDoc(userRef, {
        favorites: arrayRemove(doctorId)
      });
    } else {
      await updateDoc(userRef, {
        favorites: arrayUnion(doctorId)
      });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

// Get all favorite doctors for a user
export const getFavorites = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return [];
    
    const favorites = userSnap.data().favorites || [];
    if (favorites.length === 0) return [];
    
    // Fetch detailed doctor info for each favorited ID
    const doctorsCol = collection(db, "doctors");
    const doctorSnapshot = await getDocs(doctorsCol);
    return doctorSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(doc => favorites.includes(doc.id));
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

// Add a review for a doctor
export const addReview = async (doctorId, reviewData) => {
  try {
    const reviewRef = await addDoc(collection(db, "doctors", doctorId, "reviews"), {
      ...reviewData,
      createdAt: serverTimestamp()
    });
    
    // Also update doctor's average rating/review count
    const doctorRef = doc(db, "doctors", doctorId);
    const doctorSnap = await getDoc(doctorRef);
    if (doctorSnap.exists()) {
      const currentData = doctorSnap.data();
      const currentReviews = currentData.reviews || 0;
      const currentRating = currentData.rating || 0;
      
      const newReviews = currentReviews + 1;
      const newRating = ((currentRating * currentReviews) + reviewData.rating) / newReviews;
      
      await updateDoc(doctorRef, {
        reviews: newReviews,
        rating: Number(newRating.toFixed(1))
      });
    }
    
    return reviewRef.id;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

// Get reviews for a doctor
export const getReviews = async (doctorId) => {
  try {
    const reviewsCol = collection(db, "doctors", doctorId, "reviews");
    const q = query(reviewsCol, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting reviews:", error);
  }
};

// --- PRESCRIPTION SERVICES ---

/**
 * Upload a prescription document to Storage and save metadata to Firestore
 * @param {string} userId - ID of the user
 * @param {File} file - The file object (image/pdf)
 * @param {string} doctorName - Name of the prescribing doctor
 */
export const uploadPrescription = async (userId, file, doctorName) => {
  try {
    const storageRef = ref(storage, `prescriptions/${userId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const docRef = await addDoc(collection(db, "prescriptions"), {
      userId,
      doctorName,
      fileURL: downloadURL,
      fileName: file.name,
      fileType: file.type,
      uploadedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error uploading prescription:", error);
    throw error;
  }
};

export const getPrescriptions = async (userId) => {
  try {
    const q = query(
      collection(db, "prescriptions"), 
      where("userId", "==", userId),
      orderBy("uploadedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    return [];
  }
};

// --- CHAT SERVICES ---

export const getOrCreateChat = async (patientId, doctorId) => {
  try {
    const q = query(
      collection(db, "chats"),
      where("patientId", "==", patientId),
      where("doctorId", "==", doctorId)
    );
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() };
    }

    const docRef = await addDoc(collection(db, "chats"), {
      patientId,
      doctorId,
      createdAt: serverTimestamp(),
      lastMessage: "",
      lastMessageAt: serverTimestamp()
    });

    return { id: docRef.id, patientId, doctorId, lastMessage: "", lastMessageAt: new Date() };
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

export const sendMessage = async (chatId, senderId, text) => {
  try {
    const msgRef = await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId,
      text,
      timestamp: serverTimestamp()
    });

    // Update last message in main chat doc
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageAt: serverTimestamp()
    });

    return msgRef.id;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getMessages = async (chatId) => {
  try {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("error fetching messages", err);
    return [];
  }
};
