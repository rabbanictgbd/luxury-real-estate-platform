// src/pages/PropertyDetails.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";

export default function PropertyDetails() {
  const { serverApi, user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${serverApi}/api/properties/${id}`);
        if (!res.ok) throw new Error("Property not found");
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        Swal.fire("Error", err.message, "error");
        navigate("/properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, serverApi, navigate]);

  const handleBookNow = () => {
    if (!user) {
      Swal.fire("Login required", "You must login to book a property", "info");
      return;
    }
    navigate(`/properties/${id}/book`);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!property) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 shadow-lg rounded-lg mt-6">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <p className="text-gray-600 mb-2">Category: {property.category}</p>
      <p className="text-xl font-semibold mb-2">Price: ${property.price}</p>
      <p className="mb-4">{property.description}</p>

      <button
        onClick={handleBookNow}
        className="btn btn-primary w-full text-white"
      >
        Book Now
      </button>
    </div>
  );
}
