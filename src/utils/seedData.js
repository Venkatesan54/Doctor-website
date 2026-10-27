import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase/config";

const specialties = [
  "Cardiologist", "Dermatologist", "Orthopedic", "Pediatrician", 
  "Neurologist", "Gynecologist", "ENT Specialist", "Psychiatrist", 
  "General Physician", "Ophthalmologist", "Dentist", "Endocrinologist", 
  "Urologist", "Oncologist", "Pulmonologist", "Nutritionist", 
  "Radiologist", "Physiotherapist", "Gastroenterologist", "Nephrologist"
];

const indianFirstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Riya", "Diya", "Ananya", "Kavya", "Dhruv", "Kabir", "Aryan", "Isha", "Neha", "Rohan", "Sanjay", "Priya", "Pooja", "Rahul"];
const indianLastNames = ["Sharma", "Patel", "Reddy", "Singh", "Kumar", "Gupta", "Desai", "Mehta", "Jain", "Bose", "Iyer", "Nair", "Rao", "Chopra", "Das", "Verma", "Yadav", "Malhotra", "Kapoor", "Joshi"];
const indianHospitals = ["Apollo Hospitals", "Fortis Healthcare", "Max Super Speciality", "Medanta", "Manipal Hospitals", "Narayana Health", "AIIMS", "Christian Medical College", "Tata Memorial", " हिंदुजा Hospital"];

const languagesList = [["English", "Hindi"], ["English", "Tamil", "Telugu"], ["English", "Hindi", "Marathi"], ["English", "Gujarati"], ["English", "Hindi", "Punjabi"], ["English", "Bengali"]];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generateId = (name, specialty) => `${name.replace(/\s+/g, '_').toLowerCase()}_${specialty.toLowerCase()}`;

export const seedDoctors = async () => {
  try {
    let count = 0;

    for (let i = 0; i < 20; i++) {
      const firstName = indianFirstNames[i];
      const lastName = indianLastNames[i];
      const fullName = `${firstName} ${lastName}`;
      const specialty = specialties[i]; // 1 doctor per specialty

      const docId = generateId(fullName, specialty);

      const isTamilNadu = i < 6;
      const doctorData = {
        id: docId,
        name: fullName,
        specialty: specialty,
        rating: Number((Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)),
        reviews: Math.floor(Math.random() * 500) + 50,
        experience: Math.floor(Math.random() * 25) + 5,
        hospital: isTamilNadu
          ? getRandom(["Apollo Hospitals Chennai", "MIOT International", "SRM Medical College", "Global Health City"])
          : getRandom(indianHospitals),
        fee: Math.floor(Math.random() * 8) * 100 + 500, // 500 to 1200
        verified: true, // all realistic docs verified
        wait: `${Math.floor(Math.random() * 20) + 10} mins`,
        about: `Dr. ${fullName} is a highly regarded ${specialty} with years of clinical excellence. Committed to providing compassionate and comprehensive medical care using state-of-the-art technology.`,
        education: [`MBBS - AIIMS`, `MD/MS - ${specialty}`],
        location: isTamilNadu ? "Chennai, Tamil Nadu" : "Mumbai, Maharashtra",
        image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${(i + 30) % 100}.jpg`,

        // Bonus Features
        lat: 19.0760 + (Math.random() * 0.1 - 0.05),
        lng: 72.8777 + (Math.random() * 0.1 - 0.05),
        availability: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"],
        onlineConsultation: Math.random() > 0.3,
        languagesSpoken: getRandom(languagesList),

        createdAt: new Date().toISOString(),
        status: "approved",
      };

      await setDoc(doc(db, "doctors", docId), doctorData);
      count++;
    }

    console.log(`Successfully seeded ${count} doctors!`);
    return count;
  } catch (error) {
    console.error("Error seeding doctors:", error);
    throw error;
  }
};
