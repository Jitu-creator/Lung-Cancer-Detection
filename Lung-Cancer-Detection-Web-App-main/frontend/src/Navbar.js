
import toast from "react-hot-toast";
import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import {

  FaBars,
  FaTimes,
  FaBrain,
  FaLungsVirus,
  FaLungs,
  FaSignOutAlt,
  FaLogOutAlt

} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("You have logged out successfully");
    console.log("User logged out");
    navigate('/login');
  };

  return (

    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/70 border-b border-slate-700">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3"
        >

          <div className="w-11 h-11 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-lg">

            <FaLungsVirus className="text-white text-xl" />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">

              LungDetect AI

            </h1>

            <p className="text-xs text-cyan-400">

              Medical Diagnostic Platform

            </p>

          </div>

        </motion.div>

        {/* DESKTOP MENU */}

        <div className="hidden md:flex items-center gap-8">

          <NavLink to="/home">Home</NavLink>

          <NavLink to="/patientdata">Dashboard</NavLink>

          <NavLink to="/patients">Patients</NavLink>

          <NavLink to="/patient_form">Upload Scan</NavLink>

          {/* <NavLink to="/search">Search</NavLink> */}

          {/* <NavLink to="/doctor_profile">Doctor</NavLink> */}

        </div>

        {/* RIGHT BUTTONS */}

         <div className="hidden md:flex items-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>

        {/* <div className="hidden md:flex items-center gap-4">

          <Link
            to="/login"
            className="text-slate-300 hover:text-white transition-all"
          >

            Login

          </Link>

          <Link
            to="/register"
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 rounded-xl font-medium shadow-lg transition-all"
          >

            Sign Up

          </Link>

        </div> */}

        {/* MOBILE BUTTON */}

        

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
        >

          {menuOpen ? <FaTimes /> : <FaBars />}

        </button>

      </div>

      {/* MOBILE MENU */}

      {menuOpen && (

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-slate-900 border-t border-slate-700 px-6 py-6 space-y-4"
        >

          <MobileNavLink to="/home" text="Home" />

          <MobileNavLink
            to="/patientdata"
            text="Dashboard"
          />

          <MobileNavLink
            to="/patient_form"
            text="Upload Scan"
          />

          <MobileNavLink
            to="/search"
            text="Search"
          />

          <MobileNavLink
            to="/doctor_profile"
            text="Doctor"
          />

            

          <MobileNavLink
            to="/login"
            text="Login"
          />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-all text-lg font-medium pt-2 border-t border-slate-800"
          >
            <FaSignOutAlt />
            Sign Out
          </button>

        </motion.div>

      )}

    </nav>

  );
};

/* DESKTOP LINK */

const NavLink = ({ to, children }) => (

  <Link
    to={to}
    className="text-slate-300 hover:text-cyan-400 transition-all font-medium"
  >

    {children}

  </Link>

);

/* MOBILE LINK */

const MobileNavLink = ({ to, text }) => (

  <Link
    to={to}
    className="block text-slate-300 hover:text-cyan-400 transition-all text-lg"
  >

    {text}

  </Link>

);

export default Navbar;
