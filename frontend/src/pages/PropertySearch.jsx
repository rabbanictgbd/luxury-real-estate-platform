import { useEffect, useState } from "react";

export default function PropertySearch() {
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    category: "",
    maxPrice: "",
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all properties initially
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (queryParams = "") => {
    try {
      setLoading(true);
      const url = queryParams
        ? `http://localhost:5000/api/properties/search?${queryParams}`
        : "http://localhost:5000/api/properties";

      const res = await fetch(url);
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setProperties([]);
      setLoading(false);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();

    const query = Object.entries(filters)
      .filter(([key, value]) => value.trim() !== "")
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    fetchProperties(query);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Search Properties</h1>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow-lg"
      >
        <input
          type="text"
          name="title"
          placeholder="Property Name"
          className="input input-bordered"
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          className="input input-bordered"
          onChange={handleChange}
        />

        <select
          name="category"
          className="select select-bordered"
          onChange={handleChange}
        >
          <option value="">Category</option>
          <option value="Luxury Villa">Luxury Villa</option>
          <option value="Apartment">Apartment</option>
          <option value="Commercial">Commercial</option>
          <option value="Penthouse">Penthouse</option>
        </select>

        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          className="input input-bordered"
          onChange={handleChange}
        />

        <button className="btn btn-primary col-span-full">Search</button>
      </form>

      {/* Property Cards */}
      <div className="mt-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-gray-500">No properties found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div key={p._id} className="card bg-base-100 shadow-xl">
                <figure>
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-48 w-full object-cover"
                  />
                </figure>

                <div className="card-body">
                  <h2 className="card-title">{p.title}</h2>
                  <p className="text-gray-600">{p.location}</p>
                  <p className="font-semibold">BDT {p.price}</p>

                  <div className="card-actions justify-end">
                    <a
                      href={`/properties/${p.slug}`}
                      className="btn btn-sm btn-outline"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
