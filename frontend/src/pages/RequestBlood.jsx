import { useContext, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthProvider";
import DistrictUpazilaSelector from "../components/DistrictUpazilaSelector";
import { useQuery } from "@tanstack/react-query";

export default function RequestBlood() {
    const { user, serverApi } = useContext(AuthContext); // ✅ logged-in user info
    const [location, setLocation] = useState({ district: "", upazila: "" });
    const [submitting, setSubmitting] = useState(false);

    // ✅ Fetch current user from backend
    const { data: profile } = useQuery({
        queryKey: ["user", user?.email],
        queryFn: async () => {
            const res = await fetch(`${serverApi}/api/users/${user?.email}`);
            if (!res.ok) throw new Error("Failed to fetch user profile");
            return res.json();
        },
    });

    const handleLocationChange = useCallback((loc) => setLocation(loc), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const form = e.target;
        const payload = {
            requesterName: profile?.name || "Anonymous",
            requesterEmail: user?.email || "N/A",
            recipientName: form.recipientName.value.trim(),
            recipientMobile: form.recipientMobile.value.trim(),
            district: location.district,
            upazila: location.upazila,
            hospital: form.hospital.value.trim(),
            address: form.address.value.trim(),
            bloodGroup: form.bloodGroup.value,
            donationDate: form.donationDate.value,
            donationTime: form.donationTime.value,
            requestMessage: form.requestMessage.value.trim(),
            status: "pending", // ✅ default status
            createdAt: new Date().toISOString(),
        };

        if (
            !payload.recipientName ||
            !payload.recipientMobile ||
            !payload.district ||
            !payload.upazila ||
            !payload.hospital ||
            !payload.address ||
            !payload.bloodGroup ||
            !payload.donationDate ||
            !payload.donationTime ||
            !payload.requestMessage
        ) {
            Swal.fire("Error", "Please fill all required fields.", "error");
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch(`${serverApi}/api/requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire("Success", "Blood request submitted successfully.", "success");
                form.reset();
                setLocation({ district: "", upazila: "" });
            } else {
                Swal.fire("Error", data.message || "Failed to submit request", "error");
            }
        } catch (err) {
            Swal.fire("Error", err.message || "Network error", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-base-100 shadow-lg p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-red-600">
                Blood Request Form 🩸
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Requester Info */}
                <div>
                    <label className="block font-semibold mb-1">Requester Name</label>
                    <input
                        type="text"
                        value={profile?.name || ""}
                        className="input input-bordered w-full bg-gray-100"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1">Requester Email</label>
                    <input
                        type="email"
                        value={user?.email || ""}
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
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Recipient Mobile *</label>
                        <input
                            name="recipientMobile"
                            type="text"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                </div>


                {/* District & Upazila */}
                <div>
                    <label className="block font-semibold mb-1">Recipient Location *</label>
                    <DistrictUpazilaSelector
                        defaultDistrict={location.district}
                        defaultUpazila={location.upazila}
                        onChange={handleLocationChange}
                    />
                </div>

                {/* Hospital & Address */}
                <div>
                    <label className="block font-semibold mb-1">Hospital Name *</label>
                    <input
                        name="hospital"
                        type="text"
                        placeholder="Dhaka Medical College Hospital"
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1">Full Address Line *</label>
                    <input
                        name="address"
                        type="text"
                        placeholder="Zahir Raihan Rd, Dhaka"
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                {/* Blood Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block font-semibold mb-1">Blood Group *</label>
                        <select
                            name="bloodGroup"
                            className="select select-bordered w-full"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select Blood Group
                            </option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                <option key={bg} value={bg}>
                                    {bg}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date & Time */}

                    <div>
                        <label className="block font-semibold mb-1">Donation Date *</label>
                        <input
                            name="donationDate"
                            type="date"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Donation Time *</label>
                        <input
                            name="donationTime"
                            type="time"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                </div>

                {/* Request Message */}
                <div>
                    <label className="block font-semibold mb-1">Request Message *</label>
                    <textarea
                        name="requestMessage"
                        rows={4}
                        className="textarea textarea-bordered w-full"
                        placeholder="Please explain why this blood donation is needed"
                        required
                    />
                </div>

                {/* Buttons */}
                <div className="flex space-x-2 space-y-1">
                    <button
                        type="submit"
                        className="btn btn-error text-white"
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={(ev) => {
                            ev.preventDefault();
                            ev.target.form && ev.target.form.reset();
                            setLocation({ district: "", upazila: "" });
                        }}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}
