import React from "react";
import { Link } from "react-router-dom";
import { BsCheckAll } from "react-icons/bs";

const About = () => {
  return (
    <>
      {/* Page Header */}
      <div className="bg-[#f3f9ff] py-16 px-[4%] lg:px-[12%] text-center">
        <span className="text-[#076dcb] font-semibold sora-font text-sm">
          <i className="bi bi-book pe-2"></i>About Us
        </span>
        <h1 className="text-[#222e48] text-3xl sm:text-5xl font-bold sora-font mt-2">
          About LearnHub
        </h1>
        <p className="text-[#576070] mt-3 text-sm max-w-xl mx-auto">
          We are passionate about transforming lives through accessible, high-quality education.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[#576070]">
          <Link to="/" className="hover:text-[#076dcd]">Home</Link>
          <i className="bi bi-chevron-right text-xs"></i>
          <span className="text-[#076dcd]">About</span>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="px-[4%] lg:px-[12%] py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-[#076dcb] font-semibold sora-font text-sm">
            <i className="bi bi-book pe-2"></i>Our Story
          </span>
          <h2 className="text-[#222e48] text-3xl sm:text-4xl font-bold sora-font mt-2 mb-5 leading-tight">
            The Place Where You Can <span className="text-[#076dcd]">Achieve</span> Anything
          </h2>
          <p className="text-[#576070] text-sm leading-relaxed mb-4">
            LearnHub was founded with a simple but powerful vision: to make quality education
            available to everyone, everywhere. Whether you are a student starting your journey,
            a professional looking to upskill, or a lifelong learner — we are here for you.
          </p>
          <p className="text-[#576070] text-sm leading-relaxed mb-8">
            Driven by a team of dedicated educators, technologists and visionaries, we strive
            to create a supportive, engaging environment where knowledge meets opportunity.
          </p>
          <ul className="flex flex-col gap-3 mb-8">
            {[
              "Expert-led courses across 50+ categories",
              "9/10 average student satisfaction rate",
              "96% course completion rate",
              "Certificates recognised by top employers",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-[#222e48]">
                <BsCheckAll className="size-6 text-[#076dcd] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-[#076dcd] hover:bg-black text-white px-6 py-3 rounded-full text-sm font-medium transition-colors duration-300"
          >
            Explore Courses <i className="bi bi-arrow-up-right"></i>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "bi-people", value: "1.4K+", label: "Students Trained", color: "text-[#f37739]", bg: "bg-[#fdf6f3]" },
            { icon: "bi-camera-video", value: "2K+", label: "Courses Available", color: "text-[#076dcd]", bg: "bg-[#f1f6fd]" },
            { icon: "bi-hand-thumbs-up", value: "96%", label: "Satisfaction Rate", color: "text-[#18a54a]", bg: "bg-[#f0faf4]" },
            { icon: "bi-award", value: "500+", label: "Certificates Issued", color: "text-[#f37739]", bg: "bg-[#fdf6f3]" },
          ].map(({ icon, value, label, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-6 flex flex-col items-center text-center border border-[#ebecef]`}>
              <div className={`${color} text-3xl mb-3`}>
                <i className={`bi ${icon}`}></i>
              </div>
              <h3 className="text-[#222e48] text-2xl font-bold sora-font">{value}</h3>
              <p className="text-[#576070] text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-[#f3f9ff] px-[4%] lg:px-[12%] py-20">
        <div className="text-center mb-12">
          <span className="text-[#076dcb] font-semibold sora-font text-sm">
            <i className="bi bi-people pe-2"></i>Our Team
          </span>
          <h2 className="text-[#222e48] text-3xl sm:text-4xl font-bold sora-font mt-2">
            Meet The People Behind LearnHub
          </h2>
          <p className="text-[#576070] text-sm mt-3 max-w-lg mx-auto">
            A passionate group of educators and engineers committed to changing how the world learns.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Anjali Sharma", role: "Founder & CEO", initials: "AS", color: "from-[#076dcd] to-[#18a54a]" },
            { name: "Rohan Mehta", role: "Head of Curriculum", initials: "RM", color: "from-[#f37739] to-[#e58209]" },
            { name: "Priya Nair", role: "Lead Engineer", initials: "PN", color: "from-[#18a54a] to-[#076dcd]" },
          ].map(({ name, role, initials, color }) => (
            <div key={name} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#ebecef] hover:shadow-md transition-shadow">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                {initials}
              </div>
              <h4 className="text-[#222e48] font-semibold sora-font text-lg">{name}</h4>
              <p className="text-[#576070] text-sm mt-1">{role}</p>
              <div className="flex justify-center gap-3 mt-4">
                {["bi-linkedin", "bi-twitter-x"].map((icon) => (
                  <a key={icon} href="#" className="text-[#a0aab8] hover:text-[#076dcd] transition-colors">
                    <i className={`bi ${icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-[4%] lg:px-[12%] py-20 text-center">
        <h2 className="text-[#222e48] text-3xl sm:text-4xl font-bold sora-font mb-4">
          Ready to Start Learning?
        </h2>
        <p className="text-[#576070] text-sm mb-8 max-w-md mx-auto">
          Join thousands of learners already building their future with LearnHub.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/signup" className="bg-[#076dcd] hover:bg-black text-white px-6 py-3 rounded-full text-sm font-medium transition-colors duration-300 inline-flex items-center gap-2">
            Get Started Free <i className="bi bi-arrow-up-right"></i>
          </Link>
          <Link to="/courses" className="border border-[#076dcd] text-[#076dcd] hover:bg-[#076dcd] hover:text-white px-6 py-3 rounded-full text-sm font-medium transition-colors duration-300">
            Browse Courses
          </Link>
        </div>
      </div>
    </>
  );
};

export default About;
