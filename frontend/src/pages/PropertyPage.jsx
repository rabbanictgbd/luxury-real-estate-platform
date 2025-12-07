import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PropertyPage() {
  const serverApi = "http://localhost:5000";
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${serverApi}/api/properties`);
        const data = await res.json();
        setProperties(data);
        setFiltered(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let items = [...properties];

    if (search) {
      items = items.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (city) {
      items = items.filter((p) => p.city === city);
    }

    if (category) {
      items = items.filter((p) => p.category === category);
    }

    if (maxPrice) {
      items = items.filter((p) => p.price <= maxPrice);
    }

    setFiltered(items);
  }, [search, city, category, maxPrice, properties]);

  if (loading) return <p className="text-center text-lg mt-10">Loading properties...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-6">Luxury Properties</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        
        <input 
          type="text" 
          placeholder="Search property..." 
          className="input input-bordered w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input 
          type="text" 
          placeholder="City (e.g. Dhaka)" 
          className="input input-bordered w-full"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <select 
          className="select select-bordered w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="duplex">Duplex</option>
          <option value="commercial">Commercial</option>
        </select>

        <input 
          type="number" 
          placeholder="Max Price" 
          className="input input-bordered w-full"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* Property Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No properties found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p._id} className="card bg-base-100 shadow-xl rounded-lg overflow-hidden">
              
              <figure>
                <img 
                  src={p.image || "https://placehold.co/600x400"} 
                  alt={p.title}
                  className="h-48 w-full object-cover"
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title">{p.title}</h2>
                <p className="text-gray-600">{p.city}</p>

                <p className="font-bold text-primary">${p.price.toLocaleString()}</p>

                <div className="card-actions justify-end mt-2">
                  <Link to={`/properties/${p._id}`} className="btn btn-primary text-white">
                    View Details
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
