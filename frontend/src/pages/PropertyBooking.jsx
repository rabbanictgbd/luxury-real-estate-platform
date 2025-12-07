// src/pages/PropertyBooking.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";

export default function PropertyBooking() {
  const { serverApi, user } = useContext(AuthContext);
  const { id } = useParams(); // property ID from URL
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState("");

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

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire("Error", "You must be logged in to book a property", "error");
      return;
    }

    try {
      const res = await fetch(`${serverApi}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property._id,
          userEmail: user.email,
          bookingDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      Swal.fire("Success", "Property booked successfully", "success");
      navigate("/my-bookings");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!property) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 shadow-lg rounded-lg mt-6">
      <h1 className="text-3xl font-bold mb-4">Book: {property.title}</h1>
      <p className="text-gray-600 mb-2">Category: {property.category}</p>
      <p className="text-xl font-semibold mb-2">Price: ${property.price}</p>
      <p className="mb-4">{property.description}</p>

      <form onSubmit={handleBooking} className="space-y-4">
        <label className="block">
          Booking Date:
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="input input-bordered w-full mt-1"
            required
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full text-white"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}
