import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const ContactUs = () => {
  const { serverApi } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const res = await fetch(`${serverApi}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Your message has been sent!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSuccess("❌ Failed to send: " + data.error);
      }
    } catch (err) {
      setSuccess("❌ Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-10">
          📞 Contact Us
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Info */}
          <div className="space-y-6">
            <p className="text-lg text-gray-600">
              Have questions or need assistance? Reach out to us through this form
              or via the details below.
            </p>
            <p><strong>📍 Address:</strong> Chattogram, Bangladesh</p>
            <p><strong>📧 Email:</strong> support@bloodapp.com</p>
            <p><strong>📞 Phone:</strong> +880 1234-567890</p>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="card bg-white shadow-lg p-6 space-y-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="textarea textarea-bordered w-full"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-error text-white w-full"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {success && <p className="text-center text-green-600">{success}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
