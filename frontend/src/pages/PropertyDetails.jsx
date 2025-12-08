import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function PropertyDetails() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/properties/${slug}`)
      .then((res) => res.json())
      .then((data) => setProperty(data));
  }, [slug]);

  if (!property) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <img 
        src={property.image} 
        alt={property.title} 
        className="rounded-xl shadow-lg mb-6 w-full h-80 object-cover" 
      />

      <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
      <p className="text-gray-600 mb-4">{property.location}</p>
      <p className="text-xl font-semibold text-primary mb-4">
        BDT {property.price}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <p><strong>Category:</strong> {property.category}</p>
        <p><strong>Size:</strong> {property.size}</p>
        <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
        <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
      </div>

      <p className="mb-6 leading-relaxed">{property.description}</p>

      <Link to={`/book/${property.slug}`} className="btn btn-primary w-full">
        Book a Visit
      </Link>
    </div>
  );
}
