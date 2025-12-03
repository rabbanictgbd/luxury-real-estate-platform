import { Link } from "react-router-dom";
import Features from "../components/Features";
import ContactUs from "../components/ContactUs";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";


export default function Home() {
  const {user} = useContext(AuthContext)
  return (
    <div className="w-full">
      {/* Banner */}
      <div className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold text-red-600">
              Welcome to Blood Donation App 🩸
            </h1>
            <p className="py-6 text-gray-600">
              Your contribution can save lives. Join as a donor or search for donors near you.
            </p>
            <div className="flex gap-4 justify-center">
              {
                !user?.email &&
              <Link to="/register" className="btn btn-error text-white">
                Join as Donor
              </Link>
              }
              <Link to="/search" className="btn btn-outline btn-error">
                Search Donors
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder Sections */}
      <section className="py-10  text-center">
        <Features></Features>
      </section>

      <section className="py-10  text-center bg-base-100">
        <ContactUs></ContactUs>
      </section>
    </div>
  );
}
