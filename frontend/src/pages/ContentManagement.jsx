// src/pages/ContentManagement.jsx
import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ContentManagement = () => {
  const { serverApi, user, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState(""); // draft | published | ""

  // Fetch blogs
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", statusFilter],
    queryFn: async () => {
      const res = await fetch(`${serverApi}/api/blogs?status=${statusFilter}`);
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    },
  });

  const blogs = data?.blogs || [];

  // Publish / Unpublish
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`${serverApi}/api/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update blog status");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["blogs"]),
  });

  // Delete blog
  const deleteBlogMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${serverApi}/api/blogs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["blogs"]),
  });

  const handlePublish = (id) => {
    Swal.fire({
      title: "Publish this blog?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.isConfirmed) updateStatusMutation.mutate({ id, status: "published" });
    });
  };

  const handleUnpublish = (id) => {
    Swal.fire({
      title: "Unpublish this blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.isConfirmed) updateStatusMutation.mutate({ id, status: "draft" });
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this blog?",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.isConfirmed) deleteBlogMutation.mutate(id);
    });
  };

  if (isLoading) return <p className="text-center mt-10">Loading blogs...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Failed to load blogs</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <button
          onClick={() => navigate("/dashboard/content-management/add-blog")}
          className="btn btn-primary"
        >
          Add Blog
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Blogs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((b) => (
          <div key={b._id} className="card shadow-lg p-4 rounded-lg bg-white">
            <img src={b.thumbnail} alt={b.title} className="w-full h-40 object-cover rounded" />
            <h2 className="text-lg font-bold mt-2">{b.title}</h2>
            <p className="mt-1">Status: <span className={b.status === "draft" ? "text-red-600" : "text-green-600"}>{b.status}</span></p>
            
            {role === "admin" && (
              <div className="flex justify-between mt-4">
                {b.status === "draft" ? (
                  <button onClick={() => handlePublish(b._id)} className="btn btn-sm btn-success">
                    Publish
                  </button>
                ) : (
                  <button onClick={() => handleUnpublish(b._id)} className="btn btn-sm btn-warning">
                    Unpublish
                  </button>
                )}
                <button onClick={() => handleDelete(b._id)} className="btn btn-sm btn-error">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentManagement;
