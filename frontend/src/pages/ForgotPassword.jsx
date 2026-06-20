import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-regular-svg-icons";
import { forgotPassword, verifyPasswordResetOtp, resetPassword } from "../api/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStep1 = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await forgotPassword(email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally { setLoading(false); }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await verifyPasswordResetOtp({ email, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally { setLoading(false); }
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      await resetPassword({ email, otp, newPassword, confirmPassword });
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.");
    } finally { setLoading(false); }
  };

  const stepIcons = ["1", "2", "3"];
  const stepLabels = ["Email", "OTP", "New Password"];

  return (
    <>
      <div className="section-banner bg-[#f3f9ff] h-[350px] py-[50px] lg:py-[90px] flex flex-col justify-center items-center relative">
        <h1 className="chakrapetch-font font-bold text-4xl lg:text-5xl mb-4 text-[#222e48]">Forgot Password</h1>
        <ul className="flex items-center gap-2">
          <li><Link to="/"><FontAwesomeIcon icon={faHome} className="pr-1" /><span className="text-sm text-[#404a60]">Home</span></Link></li>
          / <li><span className="text-sm text-[#f37739]">Forgot Password</span></li>
        </ul>
        <img src={"/Images/element-01.png"} alt="shape" className="absolute left-30 top-30 object-contain hidden md:block" />
        <img src={"/Images/element-05.png"} alt="shape" className="absolute right-30 top-70 w-[20px] h-[20px] hidden sm:flex" />
      </div>

      <div className="px-[2%] lg:px-[12%] sm:px-[8%] py-[50px] lg:py-[80px] flex justify-center">
        <div className="w-full max-w-md">
          {/* Steps indicator */}
          <div className="flex items-center justify-center mb-8 gap-2">
            {stepIcons.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-[#076dcd] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {step > i + 1 ? "✓" : s}
                </div>
                <span className="text-xs text-[#404a60] hidden sm:block">{stepLabels[i]}</span>
                {i < 2 && <div className={`flex-1 h-0.5 max-w-[40px] ${step > i + 1 ? "bg-green-500" : "bg-gray-200"}`}></div>}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-[#f3f9ff] border border-[#ebecef] p-10 rounded-2xl shadow-sm">
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

            {step === 1 && (
              <form onSubmit={handleStep1}>
                <h2 className="text-[#222e48] text-xl font-semibold mb-2">Enter your email</h2>
                <p className="text-[#404a60] text-sm mb-6">We'll send a reset code to your email address.</p>
                <div className="flex flex-col">
                  <label className="text-[#404a60] font-medium pb-2 text-sm">Email Address</label>
                  <input type="email" placeholder="Enter your email..." required value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="h-[45px] border border-[#ebecef] bg-white ps-4 rounded-lg outline-none focus:ring-2 focus:ring-[#076dcd]" />
                </div>
                <button className="mt-6 w-full bg-[#076dcd] hover:bg-black text-white py-3 rounded-full text-sm cursor-pointer transition-colors duration-300 disabled:opacity-60"
                  type="submit" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleStep2}>
                <h2 className="text-[#222e48] text-xl font-semibold mb-2">Enter OTP</h2>
                <p className="text-[#404a60] text-sm mb-6">A 6-digit code was sent to <span className="text-[#076dcd] font-medium">{email}</span></p>
                <div className="flex flex-col">
                  <label className="text-[#404a60] font-medium pb-2 text-sm">6-digit OTP</label>
                  <input type="text" maxLength={6} pattern="\d{6}" placeholder="000000" required
                    value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                    className="h-[54px] border border-[#ebecef] bg-white text-center text-2xl tracking-[0.5em] font-bold rounded-lg outline-none focus:ring-2 focus:ring-[#076dcd]" />
                </div>
                <button className="mt-6 w-full bg-[#076dcd] hover:bg-black text-white py-3 rounded-full text-sm cursor-pointer transition-colors duration-300 disabled:opacity-60"
                  type="submit" disabled={loading || otp.length !== 6}>{loading ? "Verifying..." : "Verify OTP"}</button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleStep3}>
                <h2 className="text-[#222e48] text-xl font-semibold mb-2">Create new password</h2>
                <p className="text-[#404a60] text-sm mb-6">Enter a strong password for your account.</p>
                <div className="flex flex-col mb-4">
                  <label className="text-[#404a60] font-medium pb-2 text-sm">New Password</label>
                  <input type="password" placeholder="Enter new password..." required value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                    className="h-[45px] border border-[#ebecef] bg-white ps-4 rounded-lg outline-none focus:ring-2 focus:ring-[#076dcd]" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[#404a60] font-medium pb-2 text-sm">Confirm Password</label>
                  <input type="password" placeholder="Re-enter new password..." required value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    className="h-[45px] border border-[#ebecef] bg-white ps-4 rounded-lg outline-none focus:ring-2 focus:ring-[#076dcd]" />
                </div>
                <button className="mt-6 w-full bg-[#076dcd] hover:bg-black text-white py-3 rounded-full text-sm cursor-pointer transition-colors duration-300 disabled:opacity-60"
                  type="submit" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
              </form>
            )}

            <p className="text-center text-sm text-[#404a60] mt-4">
              Back to <Link to="/signin" className="text-[#076dcd] hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
