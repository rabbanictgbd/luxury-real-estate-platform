import { useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import DistrictUpazilaSelector from "../components/DistrictUpazilaSelector";

export default function Profile() {
  const { user, serverApi } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState({ district: "", upazila: "" });
  const [preview, setPreview] = useState(null); // ✅ preview for uploaded image
  const [file, setFile] = useState(null); // ✅ selected file

  const handleLocationChange = useCallback((loc) => setLocation(loc), []);

  // ✅ Fetch current user from backend
  const { data: profile, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await fetch(`${serverApi}/api/users/${user.email}`);
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return res.json();
    },
    enabled: !!user?.email,
  });

  // ✅ Mutation to update profile
  const updateMutation = useMutation({
    mutationFn: async (updatedUser) => {
      const res = await fetch(`${serverApi}/api/users/${user.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", user?.email]);
      setIsEditing(false);
      Swal.fire("Success", "Profile updated successfully!", "success");
    },
    onError: (err) => Swal.fire("Error", err.message, "error"),
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (!profile) return <p className="text-center">Loading..</p>;

  // ✅ Handle File Upload (preview + store file)
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  // ✅ Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    let imageUrl = profile.image;

    // (Optional) Upload to your image hosting service (Cloudinary, imgbb, etc.)
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      // Example using imgbb:
      const uploadRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const uploadData = await uploadRes.json();
      imageUrl = uploadData.data.url;
    }

    updateMutation.mutate({
      name: form.name.value,
      bloodGroup: form.bloodGroup.value,
      district: location.district || profile.district,
      upazila: location.upazila || profile.upazila,
      image: imageUrl,
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-base-100 shadow-lg p-6 rounded-lg">
      <div className="flex justify-end">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary btn-sm mb-4"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={() => {
              setIsEditing(false);
              setPreview(null);
              setFile(null);
            }}
            className="btn btn-secondary btn-sm mb-4"
          >
            Cancel
          </button>
        )}
      </div>

      <h2 className="text-2xl font-bold text-center mb-4 text-red-600">
        My Profile 🩸
      </h2>

      {/* ✅ Profile Image */}
      <div className="flex flex-col items-center mb-4">
        <img
          className="rounded-full w-24 h-24 object-cover border"
          src={preview || profile.image}
          alt="avatar"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 file-input file-input-bordered file-input-sm w-full max-w-xs"
          />
        )}
      </div>

      {/* ✅ Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          defaultValue={profile.name}
          className="input input-bordered w-full"
          disabled={!isEditing}
        />

        <input
          name="email"
          type="email"
          value={profile.email}
          className="input input-bordered w-full bg-gray-100"
          disabled
        />

        <select
          name="bloodGroup"
          defaultValue={profile.bloodGroup}
          className="select select-bordered w-full"
          disabled={!isEditing}
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <DistrictUpazilaSelector
          defaultDistrict={profile.district}
          defaultUpazila={profile.upazila}
          onChange={handleLocationChange}
          disabled={!isEditing}
        />

        {isEditing && (
          <button type="submit" className="btn btn-success w-full">
            Save
          </button>
        )}
      </form>
    </div>
  );
}
