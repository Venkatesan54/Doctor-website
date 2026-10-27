import { useState, useEffect } from "react";
import { getHospitals, getLabs } from "../../lib/firebase/firestore";

export const useNearbyFacilities = (fallbackHospitals = [], fallbackLabs = []) => {
  const [hospitals, setHospitals] = useState([]);
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounts = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [hospitalsData, labsData] = await Promise.all([
          getHospitals(),
          getLabs()
        ]);
        
        if (!mounts) return;

        const validHospitals = (hospitalsData || []).filter(h => h.name);
        const validLabs = (labsData || []).filter(l => l.name);

        setHospitals([...validHospitals, ...fallbackHospitals]);
        setLabs([...validLabs, ...fallbackLabs]);
      } catch (err) {
        console.error("Error fetching nearby data:", err);
        if (mounts) {
          setError(err);
          // Apply fallback values so UI doesn't break
          setHospitals(fallbackHospitals || []);
          setLabs(fallbackLabs || []);
        }
      } finally {
        if (mounts) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      mounts = false; // Cleanup to prevent race conditions
    };
  }, [fallbackHospitals, fallbackLabs]); // Run once on component mount or when fallbacks change

  return { hospitals, labs, dataLoading: isLoading, error };
};
