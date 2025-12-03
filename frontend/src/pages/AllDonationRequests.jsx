import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from "../components/Pagination";

const AllDonationRequests = () => {
  const { role, serverApi } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 5;

  // ✅ Fetch requests with filter + pagination
  const { data, isLoading } = useQuery({
    queryKey: ["allRequests", page, statusFilter],
    queryFn: async () => {
      const res = await fetch(
        `${serverApi}/api/requests?page=${page}&limit=${limit}&status=${statusFilter}`
      );
      if (!res.ok) throw new Error("Failed to fetch requests");
      return res.json();
    },
  });

  const requests = data?.requests || [];
  const totalPages = data?.totalPages || 1;

  // ✅ Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`${serverApi}/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allRequests"]);
    },
  });

  // ✅ Delete request mutation
  const deleteRequestMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${serverApi}/api/requests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete request");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allRequests"]);
    },
  });

  // ✅ Handle delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This request will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRequestMutation.mutate(id, {
          onSuccess: () =>
            Swal.fire("Deleted!", "The request has been deleted.", "success"),
          onError: () =>
            Swal.fire("Error!", "Failed to delete request.", "error"),
        });
      }
    });
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading requests...</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">
        All Donation Requests 🩸
      </h1>

      {/* ✅ Filter */}
      <div className="flex justify-end mb-4">
        <select
          className="select select-bordered w-48"
          value={statusFilter}
          onChange={(e) => {
            setPage(1); // reset to first page
            setStatusFilter(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">
          No donation request found yet.
        </p>
      ) : (
        <>
          {/* ✅ Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table w-full border">
              <thead className="bg-red-800 text-white">
                <tr>
                  <th>Sl</th>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Blood Group</th>
                  <th>Status</th>
                  <th>Donor Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, i) => (
                  <tr key={req._id} className="border">
                    <td>{(page - 1) * limit + i + 1}</td>
                    <td>{req.recipientName}</td>
                    <td>
                      {req.district}, {req.upazila}
                    </td>
                    <td>{req.donationDate}</td>
                    <td>{req.donationTime}</td>
                    <td>{req.bloodGroup}</td>
                    <td className="capitalize">{req.status}</td>
                    <td>
                      {req.status === "inprogress" || req.status === "done" ? (
                        <div>
                          <p>{req.donorName}</p>
                          <p>{req.donorEmail}</p>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="space-x-2 space-y-1 ">
                      <Link
                        to={`/dashboard/view-request/${req._id}`}
                        className="btn btn-sm btn-info"
                      >
                        View
                      </Link>
                      {role === "admin" && (
                        <>
                          <Link
                            to={`/dashboard/edit-request/${req._id}`}
                            className="btn btn-sm btn-warning"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(req._id)}
                            className="btn btn-error btn-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {requests.map((req, i) => (
              <div
                key={req._id}
                className="card bg-white shadow-md border p-4 rounded-lg"
              >
                <h3 className="font-bold text-lg text-red-700">
                  {req.recipientName} ({req.bloodGroup})
                </h3>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {req.district}, {req.upazila}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {req.donationDate} at {req.donationTime}
                </p>
                <p className="capitalize">
                  <span className="font-semibold">Status:</span> {req.status}
                </p>
                {req.status === "inprogress" || req.status === "done" ? (
                  <p>
                    <span className="font-semibold">Donor:</span>{" "}
                    {req.donorName} ({req.donorEmail})
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link
                    to={`/dashboard/view-request/${req._id}`}
                    className="btn btn-sm btn-info"
                  >
                    View
                  </Link>
                  {role === "admin" && (
                    <>
                      <Link
                        to={`/dashboard/edit-request/${req._id}`}
                        className="btn btn-sm btn-warning"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="btn btn-error btn-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default AllDonationRequests;
