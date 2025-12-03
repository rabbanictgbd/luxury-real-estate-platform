import { FaFacebook, FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-red-900 text-white py-6 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        
        {/* Logo / Brand */}
        <div className="text-lg font-bold mb-4 md:mb-0 text-red-200">
          Blood Donation App
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="/" className="hover:text-red-400">Home</a>
          <a href="/about" className="hover:text-red-400">About</a>
          <a href="/contact" className="hover:text-red-400">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-red-400">
            <FaFacebook size={22} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-red-400">
            <FaTwitter size={22} />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-red-400">
            <FaGithub size={22} />
          </a>
        </div>
      </div>

      <p className="text-center text-red-200 text-sm mt-4">
        © {new Date().getFullYear()} Blood Donation App. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
