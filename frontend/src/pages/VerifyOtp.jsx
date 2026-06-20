import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-regular-svg-icons";
import { verifyOtp, resendOtp } from "../api/auth";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await verifyOtp({ email, otp });
      navigate("/signin?verified=true");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendOtp(email);
      setSuccess("A new OTP has been sent to your email.");
      setResendCooldown(60);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <>
      <div className="section-banner bg-[#f3f9ff] h-[350px] py-[50px] lg:py-[90px] flex flex-col justify-center items-center relative">
        <h1 className="chakrapetch-font font-bold text-4xl lg:text-5xl mb-4 text-[#222e48]">Verify Your Email</h1>
        <ul className="flex items-center gap-2">
          <li><Link to="/"><FontAwesomeIcon icon={faHome} className="pr-1" /><span className="text-sm text-[#404a60]">Home</span></Link></li>
          / <li><span className="text-sm text-[#f37739]">Verify OTP</span></li>
        </ul>
        <img src={"/Images/element-01.png"} alt="shape" className="absolute left-30 top-30 object-contain hidden md:block" />
        <img src={"/Images/element-05.png"} alt="shape" className="absolute right-30 top-70 w-[20px] h-[20px] hidden sm:flex" />
      </div>

      <div className="px-[2%] lg:px-[12%] sm:px-[8%] py-[50px] lg:py-[80px] flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-[#f3f9ff] border border-[#ebecef] p-10 rounded-2xl shadow-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#076dcd] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-envelope-check text-white text-2xl"></i>
              </div>
              <h2 className="text-[#222e48] text-2xl font-semibold">Check your inbox</h2>
              <p className="text-[#404a60] text-sm mt-2">
                We sent a 6-digit OTP to <span className="font-medium text-[#076dcd]">{email}</span>
              </p>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="text-[#404a60] font-medium pb-2 text-sm">Enter 6-digit OTP</label>
                <input
                  type="text" id="otp-input" maxLength={6} pattern="\d{6}"
                  placeholder="000000"
                  value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                  className="h-[54px] border border-[#ebecef] bg-white text-center text-2xl tracking-[0.5em] font-bold rounded-lg outline-none focus:ring-2 focus:ring-[#076dcd]"
                  required
                />
              </div>

              <button id="otp-submit"
                className="mt-6 w-full bg-[#076dcd] hover:bg-black text-white py-3 rounded-full text-sm cursor-pointer transition-colors duration-300 disabled:opacity-60"
                type="submit" disabled={loading || otp.length !== 6}>
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            <div className="text-center mt-4">
              <button onClick={handleResend} disabled={resendCooldown > 0}
                className="text-sm text-[#076dcd] hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed">
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Didn't get the code? Resend"}
              </button>
            </div>
            <p className="text-center text-sm text-[#404a60] mt-3">
              Back to <Link to="/signin" className="text-[#076dcd] hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;
