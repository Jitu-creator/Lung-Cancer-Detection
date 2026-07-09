
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";

import { motion } from "framer-motion";

import {

  FaBars,
  FaTimes,
  FaBrain,
  FaLungsVirus,
  FaLungs,
  FaSignOutAlt,
  FaLogOutAlt,
  FaShieldAlt

} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("token") !== null);
    setIsStaff(localStorage.getItem("isStaff") === "true");
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    toast.success("You have logged out successfully");
    navigate('/');
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

          <NavLink to="/">Home</NavLink>

          <NavLink to="/patientdata">Dashboard</NavLink>

          {isLoggedIn && <NavLink to="/patients">Patients</NavLink>}

          {isLoggedIn && <NavLink to="/patient_form">Upload Scan</NavLink>}

          {isStaff && <NavLink to="/admin/dashboard"><span className="flex items-center gap-1"><FaShieldAlt />Admin</span></NavLink>}

        </div>

        {/* RIGHT BUTTONS */}

         <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
            >
              <FaSignOutAlt />
              Sign Out
            </button>
          ) : (
            <div className="flex items-center gap-4">
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
            </div>
          )}
        </div>

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

          <MobileNavLink to="/" text="Home" />

          <MobileNavLink to="/patientdata" text="Dashboard" />

          {isLoggedIn && <MobileNavLink to="/patient_form" text="Upload Scan" />}

          {isLoggedIn && <MobileNavLink to="/patients" text="Patients" />}

          {isLoggedIn && <MobileNavLink to="/search" text="Search" />}

          {isLoggedIn && <MobileNavLink to="/doctor_profile" text="Doctor" />}

          {isStaff && <MobileNavLink to="/admin/dashboard" text="Admin Dashboard" />}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-all text-lg font-medium pt-2 border-t border-slate-800"
            >
              <FaSignOutAlt />
              Sign Out
            </button>
          ) : (
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <MobileNavLink to="/login" text="Login" />
              <MobileNavLink to="/register" text="Sign Up" />
            </div>
          )}

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
