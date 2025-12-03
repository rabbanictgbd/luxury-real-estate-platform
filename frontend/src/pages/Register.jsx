import { useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DistrictUpazilaSelector from "../components/DistrictUpazilaSelector";

export default function Register() {
  const { register, serverApi } = useContext(AuthContext);
  const navigate = useNavigate();

  const [location, setLocation] = useState({ district: "", upazila: "" });
  const handleLocationChange = useCallback((loc) => setLocation(loc), []);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Check email before submit
  const handleEmailChange= async(e) => {
    const value= e.target.value
     setEmail(value)

  }
  
  const handleEmailBlur = async () => {
    if (!email) return;
    try {
      const res = await fetch(`${serverApi}/api/users/${email}`);
      const data = await res.json();
      setEmailError(data ? "Email already registered!" : "");
    } catch (err) {
      console.error(err);
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (emailError) return; // stop if duplicate

    const name = e.target.name.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const bloodGroup = e.target.bloodGroup.value;
    const imageFile = e.target.image.files[0];
    const status = "active";
    const role = "donor";

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    try {
      // Upload image
      const formData = new FormData();
      formData.append("image", imageFile);
      const imgUploadRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );
      const imgData = await imgUploadRes.json();
      if (!imgData.success) throw new Error("Image upload failed");
      const imageUrl = imgData.data.url;

      // Save user to MongoDB
      const res = await fetch(`${serverApi}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, password, bloodGroup,
          district: location.district, upazila: location.upazila,
          image: imageUrl, status, role
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Firebase user creation
      await register(email, password);
      Swal.fire("Success", "Registration successful! You can now login.", "success");
      navigate("/login");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-base-100 shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-red-600">
        Register as Donor 🩸
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" type="text" placeholder="Full Name" className="input input-bordered w-full" required />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          className={`input input-bordered w-full ${emailError ? "border-red-500" : ""}`}
          required
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

        <input name="password" type="password" placeholder="Password" className="input input-bordered w-full" required minLength={6} />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" className="input input-bordered w-full" required />

        <select name="bloodGroup" className="select select-bordered w-full" required>
          <option value="">Select Blood Group</option>
          {bloodGroups.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
        </select>

        <DistrictUpazilaSelector defaultDistrict="" defaultUpazila="" onChange={handleLocationChange} />

        <input name="image" type="file" className="file-input file-input-bordered w-full" accept="image/*" required />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={!!emailError} className="btn btn-error w-full text-white">Register</button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-red-500 font-semibold">Login</Link>
      </p>
    </div>
  );
}
