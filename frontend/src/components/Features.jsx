// components/Features.jsx
import { Heart, Users, Calendar, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Heart className="w-10 h-10 text-red-600" />,
    title: "Save Lives",
    description:
      "Your one donation can save up to three lives. Join thousands of heroes making a real difference.",
  },
  {
    icon: <Users className="w-10 h-10 text-red-600" />,
    title: "Community Support",
    description:
      "Connect donors and recipients in your local area. Together, we build a strong and caring community.",
  },
  {
    icon: <Calendar className="w-10 h-10 text-red-600" />,
    title: "Easy Scheduling",
    description:
      "Request and schedule donations effortlessly. Get reminders so you never miss a chance to help.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-red-600" />,
    title: "Safe & Secure",
    description:
      "We verify donors and ensure secure information handling for your peace of mind.",
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-12">
          Why Donate with Us?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
