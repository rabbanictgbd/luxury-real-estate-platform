import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";



// Fetch all districts
const fetchDistricts = async (serverApi) => {
  const res = await fetch(`${serverApi}/api/districts`);
  if (!res.ok) throw new Error("Failed to fetch districts");
  return res.json();
};

// Fetch upazilas by district
const fetchUpazilas = async (serverApi, districtId) => {
  if (!districtId) return [];
  const res = await fetch(`${serverApi}/api/upazilas/${districtId}`);
  if (!res.ok) throw new Error("Failed to fetch upazilas");
  return res.json();
};

const DistrictUpazilaSelector = ({
  defaultDistrict = "",
  defaultUpazila = "",
  onChange,
  disabled,
}) => {
  const { serverApi } = useContext(AuthContext)
  const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict);
  const [selectedUpazila, setSelectedUpazila] = useState(defaultUpazila);

  // Fetch districts
  const { data: districts = [], isLoading: loadingDistricts } = useQuery({
    queryKey: ["districts"],
    queryFn: () => fetchDistricts(serverApi),
  });

  // Fetch upazilas based on district
  const { data: upazilas = [], isLoading: loadingUpazilas } = useQuery({
    queryKey: ["upazilas", selectedDistrict],
    queryFn: () => fetchUpazilas(serverApi, selectedDistrict),
    enabled: !!selectedDistrict,
  });

  // Emit changes
  useEffect(() => {
    onChange?.({ district: selectedDistrict, upazila: selectedUpazila });
  }, [selectedDistrict, selectedUpazila, onChange]);

  return (
    <div className="space-y-4">
      {/* District Select */}
      <div>
        <label className="block mb-1 font-semibold">District</label>
        <select
          className="select select-bordered w-full"
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedUpazila(""); // reset when district changes
          }}
          disabled={disabled}
        >
          <option value="">-- Select a district --</option>
          {loadingDistricts ? (
            <option disabled>Loading...</option>
          ) : (
            districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Upazila Select */}
      {selectedDistrict && (
        <div>
          <label className="block mb-1 font-semibold">Upazila</label>
          <select
            className="select select-bordered w-full"
            value={selectedUpazila}
            onChange={(e) => setSelectedUpazila(e.target.value)}
            disabled={disabled}
          >
            <option value="">-- Select an upazila --</option>
            {loadingUpazilas ? (
              <option disabled>Loading...</option>
            ) : (
              upazilas.map((upazila) => (
                <option key={upazila.id} value={upazila.id}>
                  {upazila.name}
                </option>
              ))
            )}
          </select>
        </div>
      )}
    </div>
  );
};

export default DistrictUpazilaSelector;
