import React, { useState } from "react";
import { 
  Activity, Search, AlertCircle, CheckCircle2, 
  UserCheck, ArrowRight, RefreshCw, Info,
  Thermometer, Wind, Zap, Brain, HeartPulse,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const symptomsList = [
  { id: "fever", label: "Fever / High Temperature", icon: <Thermometer size={18} /> },
  { id: "cough", label: "Persistent Cough", icon: <Wind size={18} /> },
  { id: "headache", label: "Severe Headache", icon: <Brain size={18} /> },
  { id: "fatigue", label: "Extreme Fatigue", icon: <Zap size={18} /> },
  { id: "chest_pain", label: "Chest Pain / Pressure", icon: <HeartPulse size={18} /> },
  { id: "body_ache", label: "Muscle or Body Aches", icon: <Activity size={18} /> },
];

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) return;

    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      let advice = "";
      let suggestedSpecialty = "";
      let urgency = "low";

      if (selectedSymptoms.includes("chest_pain")) {
        advice =
          "Chest pain can be serious. Please seek immediate medical attention if you experience shortness of breath or dizziness.";
        suggestedSpecialty = "Cardiologist";
        urgency = "high";
      } 
      else if (
        selectedSymptoms.includes("fever") &&
        selectedSymptoms.includes("cough")
      ) {
        advice =
          "These symptoms are common in viral infections like flu or COVID-19. Monitor your temperature and stay hydrated.";
        suggestedSpecialty = "General Physician";
        urgency = "medium";
      } 
      else if (selectedSymptoms.includes("headache")) {
        advice =
          "Frequent headaches can be due to stress, dehydration, or vision issues. Maintain a regular sleep schedule.";
        suggestedSpecialty = "Neurologist";
        urgency = "low";
      } 
      else {
        advice =
          "Based on your symptoms, a general checkup is recommended to rule out any underlying issues.";
        suggestedSpecialty = "General Physician";
      }

      setResult({ advice, suggestedSpecialty, urgency });
      setAnalyzing(false);
    }, 2000);
  };

  const reset = () => {
    setSelectedSymptoms([]);
    setResult(null);
  };

  return (
    <div className="pt-24 pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            AI Symptom Checker
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Select your symptoms for a quick AI-based suggestion.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Symptom Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Search size={18} />
              Select Symptoms
            </h2>

            <div className="space-y-3 mb-6">
              {symptomsList.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleSymptom(s.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border ${
                    selectedSymptoms.includes(s.id)
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {s.icon}
                    {s.label}
                  </div>

                  {selectedSymptoms.includes(s.id) && (
                    <CheckCircle2 size={18} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={selectedSymptoms.length === 0 || analyzing}
              className="w-full py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Analyzing...
                </>
              ) : (
                <>
                  Check Symptoms
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">

            {!result && !analyzing && (
              <p className="text-slate-400 text-center">
                Select symptoms and click analyze.
              </p>
            )}

            {analyzing && (
              <p className="text-center">Analyzing symptoms...</p>
            )}

            {result && (
              <>
                <div className="mb-6">
                  <p className="font-bold mb-2">Advice</p>
                  <p className="text-sm text-slate-600">{result.advice}</p>
                </div>

                <div className="mb-6">
                  <p className="font-bold mb-2">Suggested Specialist</p>
                  <p>{result.suggestedSpecialty}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={reset}
                    className="border rounded-lg py-2"
                  >
                    Reset
                  </button>

                  <Link
                    to={`/doctors?specialty=${result.suggestedSpecialty}`}
                    className="bg-black text-white rounded-lg py-2 flex items-center justify-center gap-2"
                  >
                    Find Doctors
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;