import React, { useState } from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Page Header */}
      <div className="bg-[#f3f9ff] py-16 px-[4%] lg:px-[12%] text-center">
        <span className="text-[#076dcb] font-semibold sora-font text-sm">
          <i className="bi bi-envelope pe-2"></i>Contact Us
        </span>
        <h1 className="text-[#222e48] text-3xl sm:text-5xl font-bold sora-font mt-2">
          Get In Touch
        </h1>
        <p className="text-[#576070] mt-3 text-sm max-w-xl mx-auto">
          Have a question or want to learn more? We'd love to hear from you.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[#576070]">
          <Link to="/" className="hover:text-[#076dcd]">Home</Link>
          <i className="bi bi-chevron-right text-xs"></i>
          <span className="text-[#076dcd]">Contact</span>
        </div>
      </div>

      <div className="px-[4%] lg:px-[12%] py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Info Cards */}
        <div className="flex flex-col gap-6">
          {[
            { icon: "bi-geo-alt", title: "Our Location", text: "123 Learning Street, Education City, 400001", color: "text-[#076dcd]", bg: "bg-[#f1f6fd]" },
            { icon: "bi-envelope", title: "Email Us", text: "support@learnhub.com", color: "text-[#18a54a]", bg: "bg-[#f0faf4]" },
            { icon: "bi-telephone", title: "Call Us", text: "+91 12345 67890", color: "text-[#f37739]", bg: "bg-[#fdf6f3]" },
            { icon: "bi-clock", title: "Working Hours", text: "Mon–Fri: 9 AM – 6 PM IST", color: "text-[#076dcd]", bg: "bg-[#f1f6fd]" },
          ].map(({ icon, title, text, color, bg }) => (
            <div key={title} className={`${bg} rounded-2xl p-6 flex items-start gap-4 border border-[#ebecef]`}>
              <div className={`${color} text-2xl mt-0.5`}>
                <i className={`bi ${icon}`}></i>
              </div>
              <div>
                <h4 className="text-[#222e48] font-semibold sora-font text-sm mb-1">{title}</h4>
                <p className="text-[#576070] text-sm">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#ebecef] p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-16 h-16 bg-[#f0faf4] rounded-full flex items-center justify-center mb-4">
                <i className="bi bi-check-circle text-[#18a54a] text-3xl"></i>
              </div>
              <h3 className="text-[#222e48] font-semibold sora-font text-xl mb-2">Message Sent!</h3>
              <p className="text-[#576070] text-sm max-w-sm">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="mt-6 bg-[#076dcd] hover:bg-black text-white px-6 py-2.5 rounded-full text-sm transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-[#222e48] font-bold sora-font text-2xl mb-2">Send Us a Message</h2>
              <p className="text-[#576070] text-sm mb-8">Fill out the form and our team will be in touch shortly.</p>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[#222e48] text-sm font-medium block mb-1.5">Full Name *</label>
                  <input
                    name="name" value={form.name} onChange={handleChange} required
                    placeholder="Your full name"
                    className="w-full border border-[#ebecef] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#076dcd] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[#222e48] text-sm font-medium block mb-1.5">Email Address *</label>
                  <input
                    name="email" value={form.email} onChange={handleChange} required type="email"
                    placeholder="your@email.com"
                    className="w-full border border-[#ebecef] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#076dcd] transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[#222e48] text-sm font-medium block mb-1.5">Subject *</label>
                  <input
                    name="subject" value={form.subject} onChange={handleChange} required
                    placeholder="How can we help?"
                    className="w-full border border-[#ebecef] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#076dcd] transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[#222e48] text-sm font-medium block mb-1.5">Message *</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange} required rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full border border-[#ebecef] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#076dcd] transition-colors resize-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="bg-[#076dcd] hover:bg-black text-white px-8 py-3 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2"
                  >
                    Send Message <i className="bi bi-send"></i>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Contact;
