import { useEffect, useState } from "react";

export default function PropertySearch() {
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    category: "",
    maxPrice: "",
  });

  const [properties, setProperties] = useState([]);

  // 🚀 Load all properties by default
  useEffect(() => {
    fetch("http://localhost:5000/api/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data));
  }, []);

  // Handle filter change
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();

    const query = new URLSearchParams(filters).toString();

    const res = await fetch(
      `http://localhost:5000/api/properties/search?${query}`
    );
    const data = await res.json();
    setProperties(data);
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

      {/* Property Cards Section */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">
        {properties.length} Properties Found
      </h2>

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
                <a href={`/property/${p.slug}`} className="btn btn-sm btn-outline">
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
