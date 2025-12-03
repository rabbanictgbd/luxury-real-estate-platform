import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import JoditEditor from "jodit-react";

export default function AddBlog() {
  const { user, serverApi } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null); // file
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ 1. Upload thumbnail to ImageBB
      const formData = new FormData();
      formData.append("image", thumbnail);

      const imgUploadRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );

      const imgData = await imgUploadRes.json();
      if (!imgData.success) throw new Error("Image upload failed");
      const imageUrl = imgData.data.url;

      // ✅ 2. Save blog to backend
      const res = await fetch(`${serverApi}/api/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          thumbnail: imageUrl,
          content,
          authorEmail: user?.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create blog");

      Swal.fire("Success", "Blog created successfully (Draft)", "success");
      navigate("/dashboard/content-management"); // go back
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-base-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">✍️ Add New Blog</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
          required
        />

        {/* Thumbnail Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          className="file-input file-input-bordered w-full"
          required
        />

        {/* Rich Text Editor for Content */}
        <JoditEditor
          value={content}
          onChange={(newContent) => setContent(newContent)}
        />

        <button type="submit" className="btn btn-error text-white w-full">
          Create Blog
        </button>
      </form>
    </div>
  );
}
