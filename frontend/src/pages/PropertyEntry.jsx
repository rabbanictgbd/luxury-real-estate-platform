// src/pages/PropertyEntry.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function PropertyEntry() {
  const { serverApi } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const title = e.target.title.value;
    const description = e.target.description.value;
    const price = parseFloat(e.target.price.value);
    const category = e.target.category.value;
    const mediaFiles = e.target.media.files;

    try {
      // Upload media files to imgbb or your storage
      const mediaUrls = [];
      for (let i = 0; i < mediaFiles.length; i++) {
        const formData = new FormData();
        formData.append("image", mediaFiles[i]);
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (!data.success) throw new Error("Media upload failed");
        mediaUrls.push(data.data.url);
      }

      // Send property data to backend
      const res = await fetch(`${serverApi}/api/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price,
          category,
          media: mediaUrls,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Property creation failed");

      Swal.fire("Success", "Property added successfully!", "success");
      navigate("/properties"); // Redirect to property list
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        Add New Property
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          placeholder="Property Title"
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          required
        ></textarea>
        <input
          name="price"
          type="number"
          placeholder="Price"
          className="input input-bordered w-full"
          required
        />
        <input
          name="category"
          type="text"
          placeholder="Category"
          className="input input-bordered w-full"
          required
        />
        <input
          name="media"
          type="file"
          multiple
          accept="image/*"
          className="file-input file-input-bordered w-full"
          required
        />
        <button
          type="submit"
          className={`btn btn-primary w-full text-white ${loading ? "loading" : ""}`}
        >
          Add Property
        </button>
      </form>
    </div>
  );
}
