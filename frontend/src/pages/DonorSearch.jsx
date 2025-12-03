import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const DonorSearch = () => {
  const { serverApi } = useContext(AuthContext);
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const [filters, setFilters] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  // Fetch districts on mount
  useEffect(() => {
    fetch(`${serverApi}/api/districts`)
      .then((res) => res.json())
      .then((data) => setDistricts(data));
  }, [serverApi]);

  // Fetch upazilas when selected district changes
  useEffect(() => {
    if (!selectedDistrictId) {
      setUpazilas([]);
      return;
    }
    fetch(`${serverApi}/api/upazilas/${selectedDistrictId}`)
      .then((res) => res.json())
      .then((data) => setUpazilas(data));
  }, [selectedDistrictId, serverApi]);

  // Handle search button click
  const handleSearch = async () => {
    setLoading(true);
    setDonors([]);

    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
    ).toString();

    try {
      const res = await fetch(`${serverApi}/api/users?${query}`);
      const data = await res.json();
      setDonors(data.users || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // Helper functions to get names from IDs
  const getDistrictName = (id) => districts.find((d) => d.id === id)?.name || "";
  const getUpazilaName = (id) => upazilas.find((u) => u.id === id)?.name || "";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-red-600">
        🩸 Search Donors
      </h2>

      {/* Search Form */}
      <div className="flex flex-wrap gap-4 items-end mb-6">
        {/* Blood Group */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Blood Group</label>
          <select
            value={filters.bloodGroup}
            onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
            className="select select-bordered"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">District</label>
          <select
            value={selectedDistrictId}
            onChange={(e) => {
              const districtId = e.target.value;
              setSelectedDistrictId(districtId);
              setFilters({ ...filters, district: districtId, upazila: "" });
            }}
            className="select select-bordered"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d._id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Upazila */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Upazila</label>
          <select
            value={filters.upazila}
            onChange={(e) => setFilters({ ...filters, upazila: e.target.value })}
            className="select select-bordered"
          >
            <option value="">Select Upazila</option>
            {upazilas.map((u) => (
              <option key={u._id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="flex flex-col justify-end">
          <button onClick={handleSearch} className="btn btn-error text-white">
            Search
          </button>
        </div>
      </div>

      {/* Donor List */}
      {loading ? (
        <p className="text-center mt-10">Loading donors...</p>
      ) : donors.length === 0 ? (
        <p className="text-center mt-10">No donors found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => (
            <div key={donor._id} className="card bg-base-100 shadow-lg">
              <figure>
                {donor.image ? (
                  <img
                    src={donor.image}
                    alt={donor.name}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 w-full flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}
              </figure>
              <div className="card-body">
                <h3 className="card-title">{donor.name}</h3>
                <p>Email: {donor.email}</p>
                <p>Blood Group: {donor.bloodGroup}</p>
                <p>
                  Location: {getDistrictName(donor.district)}, {getUpazilaName(donor.upazila)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorSearch;
