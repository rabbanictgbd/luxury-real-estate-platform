import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading blog...</p>;
  }

  if (!blog) {
    return <p className="text-center mt-10 text-red-500">Blog not found!</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/blogs" className="btn btn-sm btn-outline mb-4">⬅ Back to Blogs</Link>
      <h2 className="text-4xl font-bold text-red-600 mb-4">{blog.title}</h2>
      <img src={blog.thumbnail} alt={blog.title} className="w-full rounded-lg mb-6" />
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>
    </div>
  );
}
