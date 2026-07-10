
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaLungsVirus } from "react-icons/fa";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("user_id");

    if (!token || !userId) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/verify-email/`, {
          token,
          user_id: userId,
        });
        setStatus("success");
        setMessage(res.data.msg);
        toast.success("Email verified!");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || "Verification failed.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-xl mb-6 ${
            status === 'success' ? 'bg-green-500' : status === 'error' ? 'bg-rose-500' : 'bg-cyan-500'
          }`}>
            {status === "loading" && <FaSpinner className="text-white text-3xl animate-spin" />}
            {status === "success" && <FaCheckCircle className="text-white text-3xl" />}
            {status === "error" && <FaTimesCircle className="text-white text-3xl" />}
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">
            {status === "loading" ? "Verifying..." : status === "success" ? "Verified!" : "Verification Failed"}
          </h1>

          <p className="text-slate-300 mb-8">{message}</p>

          {status === "success" && (
            <Link
              to="/login"
              className="inline-block bg-cyan-500 hover:bg-cyan-400 text-white py-3 px-8 rounded-xl font-semibold transition-all"
            >
              Go to Login
            </Link>
          )}

          {status === "error" && (
            <Link
              to="/login"
              className="inline-block bg-slate-600 hover:bg-slate-500 text-white py-3 px-8 rounded-xl font-semibold transition-all"
            >
              Back to Login
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
