import { useContext } from "react";
import DistrictUpazilaSelector from "./DistrictUpazilaSelector";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";

export default function DonationRequestForm({
  mode = "view",       // "create" | "edit" | "view"
  request = {},        // prefilled data (edit/view)
  location = { district: "", upazila: "" },
  onLocationChange,    // handler for location
  onSubmit,            // callback for submit
  submitting = false,  // loading state
}) {
  const { user, serverApi } = useContext(AuthContext);
  const readOnly = mode === "view";

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      if (!user?.email) return null; // avoid fetch if no user
      const res = await fetch(`${serverApi}/api/users/${user.email}`);
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return res.json();
    },
    enabled: !!user?.email, // only run if email exists
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && mode !== "view") {
      const form = e.target;
      const payload = {
        requesterName: request?.requesterName || profile?.name,
        // question: req name vs user name & trim
        requesterEmail: request?.requesterEmail || user?.email,
        recipientName: form.recipientName.value.trim(),
        recipientMobile: form.recipientMobile.value.trim(),
        district: location.district,
        districtName: location.district,
        upazila: location.upazila,
        upazilaName: location.upazila,
        hospital: form.hospital.value.trim(),
        address: form.address.value.trim(),
        bloodGroup: form.bloodGroup.value,
        donationDate: form.donationDate.value,
        donationTime: form.donationTime.value,
        requestMessage: form.requestMessage.value.trim(),
        status: "pending",
        donorName: "",
        donorEmail: "",
      };
      onSubmit(payload, form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Requester Info */}
      <div>
        <label className="block font-semibold mb-1">Requester Name</label>
        <input
          type="text"
          value={
             request?.requesterName || profile?.name || "Anonymous"
          }
          className="input input-bordered w-full bg-gray-100"
          readOnly
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Requester Email</label>
        <input
          type="email"
          value={request?.requesterEmail || user?.email || "Unknown"}
          className="input input-bordered w-full bg-gray-100"
          readOnly
        />
      </div>

      {/* Recipient Info */}
      <div className="flex gap-2 w-full">
        <div className="w-xl">
          <label className="block font-semibold mb-1">Recipient Name *</label>
          <input
            name="recipientName"
            type="text"
            defaultValue={mode !== "view" ? request?.recipientName : undefined}
            value={mode === "view" ? request?.recipientName || "" : undefined}
            className="input input-bordered w-full"
            required
            readOnly={readOnly}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Recipient Mobile *</label>
          <input
            name="recipientMobile"
            type="text"
            defaultValue={mode !== "view" ? request?.recipientMobile : undefined}
            value={mode === "view" ? request?.recipientMobile || "" : undefined}
            className="input input-bordered w-full"
            required
            readOnly={readOnly}
          />
        </div>
      </div>

      {/* District & Upazila */}
      <div>
        <label className="block font-semibold mb-1">Recipient Location *</label>
        <DistrictUpazilaSelector
          defaultDistrict={location.district}
          defaultUpazila={location.upazila}
          onChange={onLocationChange}
          disabled={readOnly}
        />
      </div>

      {/* Hospital & Address */}
      <div>
        <label className="block font-semibold mb-1">Hospital Name *</label>
        <input
          name="hospital"
          type="text"
          defaultValue={mode !== "view" ? request?.hospital : undefined}
          value={mode === "view" ? request?.hospital || "" : undefined}
          className="input input-bordered w-full"
          required
          readOnly={readOnly}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Full Address Line *</label>
        <input
          name="address"
          type="text"
          defaultValue={mode !== "view" ? request?.address : undefined}
          value={mode === "view" ? request?.address || "" : undefined}
          className="input input-bordered w-full"
          required
          readOnly={readOnly}
        />
      </div>

      {/* Blood Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold mb-1">Blood Group *</label>
          <select
            name="bloodGroup"
            className="select select-bordered w-full"
            defaultValue={mode !== "view" ? request?.bloodGroup || "" : undefined}
            value={mode === "view" ? request?.bloodGroup || "" : undefined}
            disabled={readOnly}
            required
          >
            <option value="" disabled>
              Select Blood Group
            </option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Donation Date *</label>
          <input
            name="donationDate"
            type="date"
            defaultValue={mode !== "view" ? request?.donationDate : undefined}
            value={mode === "view" ? request?.donationDate || "" : undefined}
            className="input input-bordered w-full"
            required
            readOnly={readOnly}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Donation Time *</label>
          <input
            name="donationTime"
            type="time"
            defaultValue={mode !== "view" ? request?.donationTime : undefined}
            value={mode === "view" ? request?.donationTime || "" : undefined}
            className="input input-bordered w-full"
            required
            readOnly={readOnly}
          />
        </div>
      </div>

      {/* Request Message */}
      <div>
        <label className="block font-semibold mb-1">Request Message *</label>
        <textarea
          name="requestMessage"
          rows={4}
          defaultValue={mode !== "view" ? request?.requestMessage : undefined}
          value={mode === "view" ? request?.requestMessage || "" : undefined}
          className="textarea textarea-bordered w-full"
          required
          readOnly={readOnly}
        />
      </div>

      {/* Buttons */}
      {mode !== "view" && (
        <div className="flex space-x-2">
          <button
            type="submit"
            className="btn btn-error text-white"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : mode === "create"
                ? "Submit Request"
                : "Update Request"}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={(ev) => {
              ev.preventDefault();
              ev.target.form && ev.target.form.reset();
              onLocationChange({ district: "", upazila: "" });
            }}
          >
            Reset
          </button>
        </div>
      )}
    </form>
  );
}
