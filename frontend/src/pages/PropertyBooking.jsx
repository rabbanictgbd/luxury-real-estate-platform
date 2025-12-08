import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";

export default function PropertyBooking() {
  const { id } = useParams(); // property _id
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/properties/${id}`);
        const data = await res.json();
        setProperty(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      Swal.fire("Error", "Please login to book a property", "error");
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
      const bookingData = {
        userEmail: user.email,
        propertyId: property._id,
        propertyTitle: property.title,
        propertyImage: property.image,
        price: property.price,
        bookedAt: new Date(),
      };

      try {
        const res = await fetch("http://localhost:5000/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });

        const result = await res.json();

        if (result.success) {
          Swal.fire(
            "Booked!",
            "Your property has been booked successfully.",
            "success"
          );
          navigate("/my-bookings");
        } else {
          Swal.fire("Error", "Failed to book property", "error");
        }
      } catch (err) {
        console.error("Booking error:", err);
        Swal.fire("Error", "Server error. Try again later.", "error");
      }
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading property details...</p>;
  }

  if (!property) {
    return <p className="text-center mt-10">Property not found.</p>;
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{property.title}</h1>

      <div className="card bg-base-100 shadow-xl">
        <figure>
          <img
            src={property.image}
            alt={property.title}
            className="h-64 w-full object-cover"
          />
        </figure>

        <div className="card-body">
          <p className="font-semibold">Price: BDT {property.price}</p>
          <p className="text-gray-600">Location: {property.location}</p>
          <p>Size: {property.size} sqft</p>
          <p>Bedrooms: {property.bedrooms}</p>
          <p>Bathrooms: {property.bathrooms}</p>
          <p className="mt-3">{property.description}</p>

          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary" onClick={handleBooking}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
