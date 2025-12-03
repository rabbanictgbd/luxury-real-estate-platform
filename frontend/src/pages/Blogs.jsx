import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthProvider";
import { Link } from "react-router-dom";

export default function Blogs() {
  const { serverApi } = useContext(AuthContext);

  const { data: blogs = [], isLoading, isError } = useQuery({
    queryKey: ["blogs", "published"],
    queryFn: async () => {
      const res = await fetch(`${serverApi}/api/blogs?status=published`);
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      // Ensure data is always an array
      return Array.isArray(data) ? data : data.blogs || [];
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading blogs...</p>;
  }

  if (isError) {
    return <p className="text-center mt-10 text-red-500">Failed to load blogs.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-red-600">📝 Blogs</h2>
      {blogs.length === 0 ? (
        <p className="text-center">No blogs found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="card bg-base-100 shadow-lg">
              <figure>
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">{blog.title}</h3>
                <p className="text-sm text-gray-600">
                  {blog.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
                </p>
                <div className="card-actions justify-end">
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
