import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from "../components/Pagination";

const MyDonationRequests = () => {
  const { user, serverApi } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(""); // ✅ Status filter
  const limit = 5;

  // ✅ Fetch all requests of logged-in user
  const { data, isLoading } = useQuery({
    queryKey: ["myRequests", user?.email, page, statusFilter],
    queryFn: async () => {
      const query = new URLSearchParams({
        email: user?.email,
        page,
        limit,
        ...(statusFilter && { status: statusFilter }),
      }).toString();

      const res = await fetch(`${serverApi}/api/requests?${query}`);
      if (!res.ok) throw new Error("Failed to fetch donation requests");
      return res.json();
    },
    enabled: !!user?.email,
  });

  const requests = data?.requests || [];
  const totalPages = data?.totalPages || 1;

  // ✅ Update status
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
      queryClient.invalidateQueries(["myRequests", user?.email, page, statusFilter]);
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
      queryClient.invalidateQueries(["myRequests", user?.email, page, statusFilter]);
    },
  });

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
          onSuccess: () => {
            Swal.fire("Deleted!", "The request has been deleted.", "success");
          },
          onError: () => {
            Swal.fire("Error!", "Failed to delete request.", "error");
          },
        });
      }
    });
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading requests...</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">
        My Donation Requests 🩸
      </h1>

      {/* ✅ Status Filter */}
      <div className="mb-4 flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1); // reset page
            setStatusFilter(e.target.value);
          }}
          className="select select-bordered"
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
          You haven’t made any donation requests yet.
        </p>
      ) : (
        <>
          {/* ✅ Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table w-full">
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
                    <td>{i + 1}</td>
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
                    <td className="space-x-2 space-y-1">
                      {/* Edit */}
                      <Link
                        to={`/dashboard/edit-request/${req._id}`}
                        className="btn btn-sm btn-warning"
                      >
                        Edit
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="btn btn-error btn-sm"
                      >
                        Delete
                      </button>

                      {/* View */}
                      <Link
                        to={`/dashboard/view-request/${req._id}`}
                        className="btn btn-sm btn-info"
                      >
                        View
                      </Link>

                      {/* Status Update */}
                      {req.status === "inprogress" && (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              updateStatusMutation.mutate({ id: req._id, status: "done" })
                            }
                          >
                            Done
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: req._id,
                                status: "canceled",
                              })
                            }
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile Cards */}
          <div className="grid md:hidden gap-4">
            {requests.map((req, i) => (
              <div key={req._id} className="card bg-white shadow-md p-4 border">
                <h3 className="font-bold text-lg text-red-600">{req.recipientName}</h3>
                <p>📍 {req.district?.name}, {req.upazila?.name}</p>
                <p>📅 {req.donationDate} ⏰ {req.donationTime}</p>
                <p>🩸 {req.bloodGroup}</p>
                <p className="capitalize">Status: {req.status}</p>

                {req.status === "inprogress" && (
                  <div className="mt-2 text-sm">
                    <p>Donor: {req.donorName}</p>
                    <p>Email: {req.donorEmail}</p>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
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
                  <Link
                    to={`/dashboard/view-request/${req._id}`}
                    className="btn btn-sm btn-info"
                  >
                    View
                  </Link>

                  {req.status === "inprogress" && (
                    <>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() =>
                          updateStatusMutation.mutate({ id: req._id, status: "done" })
                        }
                      >
                        Done
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() =>
                          updateStatusMutation.mutate({ id: req._id, status: "canceled" })
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MyDonationRequests;
