import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import DonationRequestForm from "../components/DonationRequestForm";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";

export default function EditRequest() {
  const { id } = useParams(); // ✅ Request ID from URL (/edit-request/:id)
  const { serverApi } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Fetch existing request data
  const { data: request, isLoading, error } = useQuery({
    queryKey: ["request", id],
    queryFn: async () => {
      const res = await fetch(`${serverApi}/api/requests/${id}`);
      if (!res.ok) throw new Error("Failed to fetch request");
      return res.json();
    },
  });

  // ✅ Mutation for updating
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await fetch(`${serverApi}/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update request");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["request", id]); // refresh request data
      queryClient.invalidateQueries(["recentRequests"]); // refresh list if needed
      Swal.fire("", "updated successfully", "success")
      navigate(`/dashboard`); // redirect after update
    },
  });

  const handleUpdate = (payload) => {
    updateMutation.mutate(payload);
  };

  if (isLoading) return <p>Loading request...</p>;
  if (error) return <p>Error loading request</p>;

  return (
    <div className="max-w-3xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
        ✏️ Edit Donation Request
      </h2>
      <DonationRequestForm
        mode="edit"
        request={request}
        location={{ district: request?.district, upazila: request?.upazila }}
        onLocationChange={() => {}}
        onSubmit={handleUpdate}
        submitting={updateMutation.isLoading}
      />
    </div>
  );
}
