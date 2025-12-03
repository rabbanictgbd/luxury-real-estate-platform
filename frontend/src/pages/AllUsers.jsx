import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthProvider";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";
import { MoreVertical } from "lucide-react"; // 3-dot menu icon

const AllUsers = () => {
  const { role, serverApi } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const limit = 5;

  // ✅ Fetch users
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", page, statusFilter],
    queryFn: async () => {
      const res = await fetch(
        `${serverApi}/api/users?page=${page}&limit=${limit}&status=${statusFilter}`
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const users = data?.users || [];

  // ✅ Mutations
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`${serverApi}/api/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await fetch(`${serverApi}/api/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  const handleBlockUnblock = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    Swal.fire({
      title: `${newStatus === "blocked" ? "Block" : "Unblock"} User?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.isConfirmed) {
        updateStatusMutation.mutate({ id, status: newStatus });
      }
    });
  };

  const handleChangeRole = (id, role) => {
    Swal.fire({
      title: `Make ${role}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.isConfirmed) {
        updateRoleMutation.mutate({ id, role });
      }
    });
  };

  if (isLoading) return <p className="text-center">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load users</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">👥 All Users</h1>

      {/* ✅ Filter */}
      <div className="mb-4 flex justify-end space-x-2 space-y-1">
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* ✅ Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-red-800 text-white">
            <tr>
              <th>Avatar</th>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border">
                <td>
                  <img src={u.image} alt="avatar" className="w-10 h-10 rounded-full" />
                </td>
                <td>{u.email}</td>
                <td>{u.name}</td>
                <td className="capitalize">{u.role}</td>
                <td className={u.status === "active" ? "text-green-600" : "text-red-600"}>
                  {u.status}
                </td>
                <td>
                  {role !== "admin" ? (
                    <button className="btn btn-xs text-red-600" disabled>
                      No access
                    </button>
                  ) : (
                    <div className="dropdown dropdown-left">
                      <button tabIndex={0} className="btn btn-sm btn-outline">
                        <MoreVertical size={16} />
                      </button>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
                      >
                        {u.status === "active" ? (
                          <li>
                            <button onClick={() => handleBlockUnblock(u._id, u.status)}>
                              Block
                            </button>
                          </li>
                        ) : (
                          <li>
                            <button onClick={() => handleBlockUnblock(u._id, u.status)}>
                              Unblock
                            </button>
                          </li>
                        )}

                        {u.role !== "volunteer" && (
                          <li>
                            <button onClick={() => handleChangeRole(u._id, "volunteer")}>
                              Make Volunteer
                            </button>
                          </li>
                        )}

                        {u.role !== "admin" && (
                          <li>
                            <button onClick={() => handleChangeRole(u._id, "admin")}>
                              Make Admin
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Cards */}
      <div className="grid gap-4 md:hidden px-3">
        {users.map((u) => (
          <div key={u._id} className="card bg-base-100 shadow p-4 border max-w-md mx-auto w-full">
            <div className="flex items-center space-x-3">
              <img src={u.image} alt="avatar" className="w-12 h-12 rounded-full" />
              <div>
                <h2 className="font-bold">{u.name}</h2>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <span className="capitalize text-sm">Role: {u.role}</span>
              <span
                className={`text-sm font-semibold ${
                  u.status === "active" ? "text-green-600" : "text-red-600"
                }`}
              >
                {u.status}
              </span>
            </div>

            {role === "admin" && (
              <div className="mt-3 flex justify-end">
                <div className="dropdown dropdown-left">
                  <button tabIndex={0} className="btn btn-sm btn-outline">
                    <MoreVertical size={16} />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
                  >
                    {u.status === "active" ? (
                      <li>
                        <button onClick={() => handleBlockUnblock(u._id, u.status)}>
                          Block
                        </button>
                      </li>
                    ) : (
                      <li>
                        <button onClick={() => handleBlockUnblock(u._id, u.status)}>
                          Unblock
                        </button>
                      </li>
                    )}

                    {u.role !== "volunteer" && (
                      <li>
                        <button onClick={() => handleChangeRole(u._id, "volunteer")}>
                          Make Volunteer
                        </button>
                      </li>
                    )}

                    {u.role !== "admin" && (
                      <li>
                        <button onClick={() => handleChangeRole(u._id, "admin")}>
                          Make Admin
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default AllUsers;
