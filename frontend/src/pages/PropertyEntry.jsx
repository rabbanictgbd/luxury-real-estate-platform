import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import Swal from "sweetalert2";

export default function PropertyEntry() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const imageHostKey = import.meta.env.VITE_IMGBB_API_KEY;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: null,
    location: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    category: "",
    image: null,
  });

  // 🔹 Handle Change (Text Fields)
  const handleChange = (e) => {
  const { name, value, type } = e.target;

  // Convert number fields to real numbers
  const processedValue = type === "number" ? Number(value) : value;

  // Auto-generate slug from title
  if (name === "title") {
    const newSlug = slugify(value, { lower: true });
    setFormData({
      ...formData,
      title: value,
      slug: newSlug,
    });
  } else {
    setFormData({
      ...formData,
      [name]: processedValue,
    });
  }
};


  // 🔹 Image Handler
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // 🔹 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    // Upload to ImageBB
    if (formData.image) {
      const imgData = new FormData();
      imgData.append("image", formData.image);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
        {
          method: "POST",
          body: imgData,
        }
      );

      const imageResponse = await res.json();
      imageUrl = imageResponse.data.url;
    }

    const propertyData = {
      ...formData,
      image: imageUrl,
      email: user?.email,
    };

    // Save to backend
    fetch("http://localhost:5000/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(propertyData),
    }).then(() => {
      Swal.fire({
        title: "Success!",
        text: "Property added successfully.",
        icon: "success",
      });

      navigate("/properties");
    });
  };

  return (
<div className="p-10 max-w-4xl mx-auto bg-white shadow-xl rounded-xl">
  <h1 className="text-3xl font-bold mb-6 text-center">Add New Property</h1>

  <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">

    {/* Title */}
    <div className="flex flex-col">
      <label className="font-medium mb-1">Property Title</label>
      <input
        type="text"
        name="title"
        placeholder="Enter property title"
        className="input input-bordered w-full"
        value={formData.title}
        onChange={handleChange}
        required
      />
    </div>

    {/* Slug (Auto) */}
    <div className="flex flex-col">
      <label className="font-medium mb-1">Slug (Auto)</label>
      <input
        type="text"
        name="slug"
        placeholder="auto-generated-slug"
        className="input input-bordered bg-gray-100 w-full"
        value={formData.slug}
        disabled
      />
    </div>

    {/* Category */}
    <div className="flex flex-col">
      <label className="font-medium mb-1">Category</label>
      <select
        name="category"
        className="select select-bordered w-full"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        <option value="Luxury Villa">Luxury Villa</option>
        <option value="Apartment">Apartment</option>
        <option value="Commercial">Commercial</option>
        <option value="Penthouse">Penthouse</option>
      </select>
    </div>

    {/* Price */}
    <div className="flex flex-col">
      <label className="font-medium mb-1">Price (BDT)</label>
      <input
        type="number"
        name="price"
        placeholder="Enter price"
        className="input input-bordered w-full"
        value={formData.price}
        onChange={handleChange}
        required
      />
    </div>

    {/* Location */}
    <div className="flex flex-col">
      <label className="font-medium mb-1">Location</label>
      <input
        type="text"
        name="location"
        placeholder="Property location"
        className="input input-bordered w-full"
        value={formData.location}
        onChange={handleChange}
        required
      />
    </div>

    {/* Size */}
    <div className="flex flex-col">
      <label className="font-medium mb-1">Size (sqft)</label>
      <input
        type="text"
        name="size"
        placeholder="e.g. 2500 sqft"
        className="input input-bordered w-full"
        value={formData.size}
        onChange={handleChange}
        required
      />
    </div>

    {/* Bedrooms */}
    <div className="flex flex-col">
      <label className="font-medium mb-1">Bedrooms</label>
      <input
        type="number"
        name="bedrooms"
        placeholder="e.g. 3"
        className="input input-bordered w-full"
        value={formData.bedrooms}
        onChange={handleChange}
      />
    </div>

    {/* Bathrooms */}
    <div className="flex flex-col">
      <label className="font-medium mb-1">Bathrooms</label>
      <input
        type="number"
        name="bathrooms"
        placeholder="e.g. 2"
        className="input input-bordered w-full"
        value={formData.bathrooms}
        onChange={handleChange}
      />
    </div>

    {/* Description */}
    <div className="flex flex-col">
      <label className="font-medium mb-1">Description</label>
      <textarea
        name="description"
        placeholder="Write a detailed property description..."
        className="textarea textarea-bordered w-full"
        rows={4}
        value={formData.description}
        onChange={handleChange}
        required
      />
    </div>

    {/* Image Upload */}
    <div className="flex flex-col">
      <label className="font-medium mb-1">Upload Property Image</label>
      <input
        type="file"
        name="image"
        className="file-input file-input-bordered w-full"
        onChange={handleImageChange}
        required
      />
    </div>

    {/* Submit Button */}
    <button className="btn btn-primary mt-3 w-full">
      Save Property
    </button>
  </form>
</div>

  );
}
