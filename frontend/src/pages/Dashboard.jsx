import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import AdminStats from "../components/AdminStats";

const Dashboard = () => {
  const { role, user, serverApi } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ✅ Fetch donor profile
  const { data: profile } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await fetch(`${serverApi}/api/users/${user?.email}`);
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return res.json();
    },
    enabled: !!user?.email,
  });

  // ✅ Fetch 3 recent requests
  const { data } = useQuery({
    queryKey: ["recentRequests", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `${serverApi}/api/requests?email=${user?.email}&limit=3`
      );
      if (!res.ok) throw new Error("Failed to fetch donation requests");
      return res.json();
    },
    enabled: !!user?.email,
  });

  const requests = data?.requests || [];

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
      queryClient.invalidateQueries(["recentRequests", user?.email]);
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
      queryClient.invalidateQueries(["recentRequests", user?.email]);
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
          onSuccess: () =>
            Swal.fire("Deleted!", "The request has been deleted.", "success"),
          onError: () =>
            Swal.fire("Error!", "Failed to delete request.", "error"),
        });
      }
    });
  };

  return (
    <div className="p-5">
      {/* ✅ Greeting */}
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
        <span className="text-blue-500">Hi {profile?.name},</span> Welcome to
        Your Blood Donation Dashboard 🩸
      </h1>

      {/* ✅ Admin Stats */}
      {role === "admin" && (
        <div className="mb-6">
          <AdminStats />
        </div>
      )}

      {/* ✅ Show requests if available */}
      {requests.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            My Recent Donation Requests
          </h2>

          {/* ✅ Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table w-full border border-red-800">
              <thead className="bg-red-800 text-white">
                <tr>
                  <th>Sl</th>
                  <th>Recipient Name</th>
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
                {requests.map((req, index) => (
                  <tr key={req._id} className="border">
                    <td>{index + 1}</td>
                    <td>{req.recipientName}</td>
                    <td>
                      {req.district}, {req.upazila}
                    </td>
                    <td>{req.donationDate}</td>
                    <td>{req.donationTime}</td>
                    <td>{req.bloodGroup}</td>
                    <td className="capitalize">{req.status}</td>
                    <td>
                      {req.status === "inprogress" ? (
                        <div>
                          <p>{req.donorName}</p>
                          <p>{req.donorEmail}</p>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="space-x-2 space-y-1">
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
                              updateStatusMutation.mutate({
                                id: req._id,
                                status: "done",
                              })
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

          {/* ✅ Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {requests.map((req, index) => (
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
                  <span className="font-semibold">Date:</span> {req.donationDate}{" "}
                  at {req.donationTime}
                </p>
                <p className="capitalize">
                  <span className="font-semibold">Status:</span> {req.status}
                </p>
                {req.status === "inprogress" && (
                  <p>
                    <span className="font-semibold">Donor:</span>{" "}
                    {req.donorName} ({req.donorEmail})
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
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
                          updateStatusMutation.mutate({
                            id: req._id,
                            status: "done",
                          })
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
                </div>
              </div>
            ))}
          </div>

          {/* ✅ View All Button */}
          <div className="text-center mt-6">
            <Link to="/my-donation-requests" className="btn btn-primary">
              View My All Requests
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
