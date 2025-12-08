import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthProvider";

export default function PropertyBooking() {
  const { id } = useParams(); // get property _id from URL
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch property by _id
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/properties/${id}`);
        const data = await res.json();
        setProperty(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching property:", err);
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Handle booking confirmation
  const handleBooking = async () => {
    if (!user) {
      Swal.fire("Error", "You must be logged in to book a property", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Confirm Booking",
      text: `Do you want to book "${property.title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Book Now",
    });

    if (confirm.isConfirmed) {
      try {
        const bookingData = {
          propertyId: property._id,
          propertyTitle: property.title,
          propertyImage: property.image,
          userEmail: user.email,
          price: property.price,
          bookedAt: new Date(),
        };

        const res = await fetch("http://localhost:5000/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });

        if (res.ok) {
          Swal.fire("Booked!", "Your property has been booked.", "success");
          navigate("/my-bookings");
        } else {
          Swal.fire("Error", "Failed to book property", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading property...</p>;
  if (!property) return <p className="text-center mt-10">Property not found</p>;

  return (
    <div className="p-10 max-w-4xl mx-auto bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">{property.title}</h1>
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-64 object-cover mb-6 rounded"
      />
      <p className="mb-2"><strong>Location:</strong> {property.location}</p>
      <p className="mb-2"><strong>Category:</strong> {property.category}</p>
      <p className="mb-2"><strong>Price:</strong> BDT {property.price}</p>
      <p className="mb-2"><strong>Size:</strong> {property.size} sqft</p>
      <p className="mb-2"><strong>Bedrooms:</strong> {property.bedrooms}</p>
      <p className="mb-2"><strong>Bathrooms:</strong> {property.bathrooms}</p>
      <p className="mb-4"><strong>Description:</strong> {property.description}</p>

      <button
        onClick={handleBooking}
        className="btn btn-primary w-full mt-4"
      >
        Confirm Booking
      </button>
    </div>
  );
}
