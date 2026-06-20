import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#222e48] text-white">
      {/* Main Footer */}
      <div className="px-[4%] lg:px-[12%] sm:px-[8%] py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl sora-font w-fit">
            <div className="w-9 h-9 bg-[#076dcd] rounded-lg flex items-center justify-center">
              <i className="bi bi-mortarboard-fill text-white text-sm"></i>
            </div>
            LearnHub
          </Link>
          <p className="text-[#a0aab8] text-sm leading-relaxed">
            Empowering learners worldwide with quality education. Build skills,
            earn certificates, and achieve your goals.
          </p>
          {/* Social Links */}
          <div className="flex gap-3 mt-2">
            {[
              { icon: "bi-facebook",  href: "#" },
              { icon: "bi-twitter-x", href: "#" },
              { icon: "bi-linkedin",  href: "#" },
              { icon: "bi-youtube",   href: "#" },
            ].map(({ icon, href }) => (
              <a
                key={icon}
                href={href}
                className="w-9 h-9 rounded-full border border-[#354259] flex items-center justify-center text-[#a0aab8] hover:bg-[#076dcd] hover:border-[#076dcd] hover:text-white transition-all duration-300"
              >
                <i className={`bi ${icon} text-sm`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold sora-font mb-5 text-sm uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3">
            {[
              { to: "/", label: "Home" },
              { to: "/courses", label: "Courses" },
              { to: "/About", label: "About Us" },
              { to: "/blog", label: "Blog" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-[#a0aab8] text-sm hover:text-[#076dcd] transition-colors duration-200 flex items-center gap-2"
                >
                  <i className="bi bi-arrow-right-short text-[#076dcd]"></i>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold sora-font mb-5 text-sm uppercase tracking-wider">
            Categories
          </h4>
          <ul className="flex flex-col gap-3">
            {[
              "Web Development",
              "Data Science",
              "Design & Arts",
              "Language Learning",
              "Health & Fitness",
            ].map((cat) => (
              <li key={cat}>
                <Link
                  to="/courses"
                  className="text-[#a0aab8] text-sm hover:text-[#076dcd] transition-colors duration-200 flex items-center gap-2"
                >
                  <i className="bi bi-arrow-right-short text-[#076dcd]"></i>
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold sora-font mb-5 text-sm uppercase tracking-wider">
            Contact Us
          </h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3 text-[#a0aab8] text-sm">
              <i className="bi bi-geo-alt text-[#076dcd] mt-0.5"></i>
              <span>123 Learning Street, Education City, 400001</span>
            </li>
            <li className="flex items-center gap-3 text-[#a0aab8] text-sm">
              <i className="bi bi-envelope text-[#076dcd]"></i>
              <a href="mailto:support@learnhub.com" className="hover:text-[#076dcd] transition-colors">
                support@learnhub.com
              </a>
            </li>
            <li className="flex items-center gap-3 text-[#a0aab8] text-sm">
              <i className="bi bi-telephone text-[#076dcd]"></i>
              <a href="tel:+911234567890" className="hover:text-[#076dcd] transition-colors">
                +91 12345 67890
              </a>
            </li>
          </ul>

          {/* Newsletter */}
          <div className="mt-6">
            <p className="text-[#a0aab8] text-xs mb-3">Subscribe to our newsletter</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-[#2d3a52] border border-[#354259] text-white text-sm px-3 py-2 rounded-l-lg outline-none placeholder:text-[#5a6880] focus:border-[#076dcd] transition-colors"
              />
              <button className="bg-[#076dcd] hover:bg-[#005bb5] px-3 py-2 rounded-r-lg transition-colors">
                <i className="bi bi-send text-white text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#354259] px-[4%] lg:px-[12%] py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[#a0aab8] text-sm">
          © {currentYear} <span className="text-white font-medium">LearnHub</span>. All rights reserved.
        </p>
        <div className="flex gap-5">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[#a0aab8] text-xs hover:text-[#076dcd] transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
