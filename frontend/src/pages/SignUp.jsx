import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", confirmPassword: "", role: "STUDENT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="section-banner bg-[#f3f9ff] h-[400px] py-[50px] lg:py-[90px] flex flex-col justify-center items-center relative">
        <h1 className="chakrapetch-font font-bold text-5xl lg:text-6xl mb-5 text-[#222e48]">Sign Up</h1>
        <ul className="flex items-center gap-2">
          <li className="cursor-pointer">
            <Link to="/"><FontAwesomeIcon icon={faHome} className="pr-1" /><span className="text-sm xl:text-md text-[#404a60]">Home</span></Link>
          </li>
          /
          <li className="cursor-pointer">
            <span className="text-sm xl:text-md text-[#f37739]">Sign Up</span>
          </li>
        </ul>
        <img src={"/Images/element-01.png"} alt="shape" className="absolute left-30 top-30 hidden md:block" />
        <img src={"/Images/element-02.png"} alt="shape" className="absolute left-20 top-60 hidden md:block" />
        <img src={"/Images/element-03.png"} alt="shape" className="absolute right-96 bottom-10 hidden lg:block" />
        <img src={"/Images/element-04.png"} alt="shape" className="absolute right-30 bottom-30 hidden lg:block" />
        <img src={"/Images/element-05.png"} alt="shape" className="absolute right-30 top-70 w-[20px] h-[20px] hidden sm:flex" />
        <img src={"/Images/element-05.png"} alt="shape" className="absolute left-10 bottom-50 w-[25px] h-[25px] hidden sm:flex" />
      </div>

      <div className="px-[2%] lg:px-[12%] sm:px-[8%] py-[50px] lg:py-[80px] w-full flex flex-col lg:flex-row gap-10 justify-between items-center xl:gap-20 relative">
        <div className="lg:w-1/2 w-full">
          <form onSubmit={handleSubmit} className="w-full bg-[#f3f9ff] border border-[#ebecef] p-10 rounded-2xl shadow-sm">
            <h2 className="text-[#222e48] text-2xl lg:text-4xl font-semibold pb-2">Create an Account</h2>
            <p className="text-[#404a60] text-sm lg:text-md">Fill in your details to join us</p>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-col">
              <label className="text-[#404a60] font-medium pb-2 text-sm">Full Name</label>
              <input type="text" name="fullName" id="signup-name" placeholder="Enter your name..."
                required value={formData.fullName} onChange={handleChange}
                className="h-[45px] border border-[#ebecef] bg-white ps-4 rounded-lg outline-none focus:ring-2 focus:ring-[#076dcd]" />
            </div>

            <div className="mt-5 flex flex-col">
              <label className="text-[#404a60] font-medium pb-2 text-sm">Email Address</label>
              <input type="email" name="email" id="signup-email" placeholder="Enter your email..."
                required value={formData.email} onChange={handleChange}
                className="h-[45px] border border-[#ebecef] bg-white ps-4 rounded-lg outline-none focus:ring-2 focus:ring-[#076dcd]" />
            </div>

            <div className="mt-5 flex flex-col">
              <label className="text-[#404a60] font-medium pb-2 text-sm">I am a</label>
              <select name="role" id="signup-role" value={formData.role} onChange={handleChange}
                className="h-[45px] border border-[#ebecef] bg-white ps-4 rounded-lg outline-none focus:ring-2 focus:ring-[#076dcd] cursor-pointer">
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
              </select>
            </div>

            <div className="mt-5 flex flex-col">
              <label className="text-[#404a60] font-medium pb-2 text-sm">Password</label>
              <input type="password" name="password" id="signup-password" placeholder="Enter your password..."
                required value={formData.password} onChange={handleChange}
                className="h-[45px] border border-[#ebecef] bg-white ps-4 rounded-lg outline-none focus:ring-2 focus:ring-[#076dcd]" />
            </div>

            <div className="mt-5 flex flex-col">
              <label className="text-[#404a60] font-medium pb-2 text-sm">Confirm Password</label>
              <input type="password" name="confirmPassword" id="signup-confirm-password" placeholder="Re-enter your password..."
                required value={formData.confirmPassword} onChange={handleChange}
                className="h-[45px] border border-[#ebecef] bg-white ps-4 rounded-lg outline-none focus:ring-2 focus:ring-[#076dcd]" />
            </div>

            <div className="flex justify-between items-center mt-3">
              <p className="text-[#404a60] text-sm">
                Already have an account?{" "}
                <Link to="/signin" className="text-[#076dcd] font-medium hover:underline">Sign In</Link>
              </p>
            </div>

            <div className="mt-8">
              <button id="signup-submit"
                className="btn custom-btn bg-[#076dcd] hover:bg-black text-white px-6 py-3 rounded-full text-sm cursor-pointer transition-colors duration-300 disabled:opacity-60"
                type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
                <i className="bi bi-arrow-up-right ps-2"></i>
              </button>
            </div>
          </form>
        </div>

        <div className="lg:w-1/2 w-full flex justify-center">
          <div className="learning-image bg-[#f3f9ff] rounded-full w-[300px] sm:w-[450px] lg:w-[550px] aspect-square p-6 flex items-center justify-center shadow-inner">
            <img src={"/Images/learning_image.png"} alt="learning" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
