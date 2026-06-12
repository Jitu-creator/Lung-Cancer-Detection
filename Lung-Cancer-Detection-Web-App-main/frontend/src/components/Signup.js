// 

import toast from "react-hot-toast";
import React, { useState } from "react";

import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

import { motion } from "framer-motion";


import {

  FaUser,
  FaEnvelope,
  FaLock,
  FaBrain,
  FaLungsVirus

} from "react-icons/fa";

const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    username: "",
    email: "",
    password: "",
    confirmPassword: ""

  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {

      toast.error("Passwords do not match");

      return;

    }

    setLoading(true);

    try {

      await axios.post(

        "http://127.0.0.1:8000/api/register/",

        {

          username: formData.username,

          email: formData.email,

          password: formData.password

        }

      );

      toast.success("Registration successful");

      navigate("/login");

    } catch (error) {

      console.log(error);

      toast.error("Registration failed");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-6 relative overflow-hidden">

      {/* GLOW EFFECTS */}

      <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 top-10 left-10"></div>

      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>

      {/* CARD */}

      <motion.div

        initial={{ opacity: 0, y: 40 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.8 }}

        className="relative z-10 w-full max-w-md"

      >

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10">

          {/* HEADER */}

          <div className="flex flex-col items-center mb-8">

            <div className="w-20 h-20 rounded-3xl bg-cyan-500 flex items-center justify-center shadow-xl mb-4">

              <FaLungsVirus className="text-white text-4xl" />

            </div>

            <h1 className="text-4xl font-bold text-white">

              Create Account

            </h1>

            <p className="text-slate-300 mt-2 text-center">

              Join the AI Lung Cancer Diagnostic Platform

            </p>

          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* USERNAME */}

            <div>

              <label className="text-slate-300 text-sm mb-2 block">

                Username

              </label>

              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3">

                <FaUser className="text-cyan-400 mr-3" />

                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-transparent outline-none text-white w-full placeholder-slate-400"
                  required
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label className="text-slate-300 text-sm mb-2 block">

                Email

              </label>

              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3">

                <FaEnvelope className="text-cyan-400 mr-3" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent outline-none text-white w-full placeholder-slate-400"
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label className="text-slate-300 text-sm mb-2 block">

                Password

              </label>

              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3">

                <FaLock className="text-cyan-400 mr-3" />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-transparent outline-none text-white w-full placeholder-slate-400"
                  required
                />

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="text-slate-300 text-sm mb-2 block">

                Confirm Password

              </label>

              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3">

                <FaLock className="text-cyan-400 mr-3" />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-transparent outline-none text-white w-full placeholder-slate-400"
                  required
                />

              </div>

            </div>

            {/* BUTTON */}

            <motion.button

              whileHover={{ scale: 1.03 }}

              whileTap={{ scale: 0.97 }}

              type="submit"

              disabled={loading}

              className="w-full bg-cyan-500 hover:bg-cyan-400 transition-all text-white py-4 rounded-xl font-semibold shadow-lg"

            >

              {loading ? "Creating Account..." : "Sign Up"}

            </motion.button>

          </form>

          {/* FOOTER */}

          <div className="text-center mt-6 text-slate-300">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >

              Login

            </Link>

          </div>

        </div>

      </motion.div>

    </div>

  );

};

export default Signup;