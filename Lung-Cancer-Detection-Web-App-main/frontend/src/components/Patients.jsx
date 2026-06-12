import { FaSearch, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";

import axios from "axios";




const Patients = () => {

  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const patientsPerPage = 5;

  const [stats, setStats] = useState({
  
      total: 0,
  
      malignant: 0,
  
      benign: 0,
  
      normal: 0,
  
      averageConfidence: 0
  
    });

 useEffect(() => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/list/')
      .then(response => {
        setPatients(response.data.candidates);
        setLoading(false);

        const data = response.data.candidates

        const malignant = data.filter(patient =>
          patient.classified?.includes('Malignant')
        ).length

        const benign = data.filter(patient =>
          patient.classified?.includes('Benign')
        ).length

        const normal = data.filter(patient =>
          patient.classified?.includes('Normal')
        ).length

        const totalConfidence = data.reduce(

          (sum, patient) =>

            sum + (patient.confidence_score || 0),

          0
        )

        const averageConfidence =

          data.length > 0
            ? totalConfidence / data.length
            : 0

        setStats({

          total: data.length,

          malignant,

          benign,

          normal,

          averageConfidence

        })

      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const filteredPatients = patients.filter((patient) => {

  const matchesSearch = patient.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase())

  const matchesFilter =

    activeFilter === "All"

      ? true

      : patient.classified?.includes(activeFilter)

  return matchesSearch && matchesFilter

})

const indexOfLastPatient = currentPage * patientsPerPage;

const indexOfFirstPatient =
  indexOfLastPatient - patientsPerPage;

const currentPatients =
  filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

const totalPages = Math.ceil(
  filteredPatients.length / patientsPerPage
);

const totalPatients = patients.length;

const malignantCount = patients.filter((patient) =>
  patient.classified?.includes("Malignant")
).length;

const benignCount = patients.filter((patient) =>
  patient.classified?.includes("Benign")
).length;

const normalCount = patients.filter((patient) =>
  patient.classified?.includes("Normal")
).length;

useEffect(() => {

  setCurrentPage(1);

}, [searchTerm, activeFilter]);

  return (

    // <div className="min-h-screen bg-slate-100 p-6">
    <div className="relative min-h-screen bg-slate-100 overflow-hidden p-6">
      {/* BACKGROUND EFFECTS */}

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-200 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-200 rounded-full blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>

    <div>

      <div className="relative z-10">

    <p className="text-cyan-600 font-semibold uppercase tracking-wider mb-3">

      AI Lung Cancer Detection Records

    </p>
    </div>

      <h1 className="text-5xl font-bold text-slate-800 mb-3">

        Patient Management

      </h1>

      <p className="text-slate-500 text-lg">

        Manage, search, and review all patient
        AI diagnostic reports.

      </p>

      {/* ANALYTICS */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

  {/* TOTAL */}

  <motion.div

    whileHover={{ y: -5 }}

    // className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200"
    className="

      relative overflow-hidden

      bg-white rounded-3xl

      shadow-xl

      p-8

      border border-slate-200

      transition-all duration-500

      hover:-translate-y-2
      hover:shadow-2xl

    "

  >

    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-100 rounded-full blur-3xl opacity-30 -translate-y-16 translate-x-16"></div>

    <p className="text-slate-500 mb-4">

      Total Patients

    </p>

    <h1 className="text-5xl font-bold text-slate-800 mb-4">

      <CountUp
        end={totalPatients}
        duration={2}
      />

    </h1>

    <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center">

      <span className="text-3xl">

        👨‍⚕️

      </span>

    </div>

  </motion.div>

  {/* MALIGNANT */}

  <motion.div

    whileHover={{ y: -5 }}

    // className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200"
    className="

      relative overflow-hidden

      bg-white rounded-3xl

      shadow-xl

      p-8

      border border-slate-200

      transition-all duration-500

      hover:-translate-y-2
      hover:shadow-2xl

    "

  >

    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-100 rounded-full blur-3xl opacity-30 -translate-y-16 translate-x-16"></div>

    <p className="text-slate-500 mb-4">

      Malignant Cases

    </p>

    <h1 className="text-5xl font-bold text-red-500 mb-4">

      <CountUp
        end={malignantCount}
        duration={2}
      />

    </h1>

    <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">

      <span className="text-3xl">

        🔴

      </span>

    </div>

  </motion.div>

  {/* BENIGN */}

  <motion.div

    whileHover={{ y: -5 }}

    // className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200"
    className="

      relative overflow-hidden

      bg-white rounded-3xl

      shadow-xl

      p-8

      border border-slate-200

      transition-all duration-500

      hover:-translate-y-2
      hover:shadow-2xl

    "

  >

    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-100 rounded-full blur-3xl opacity-30 -translate-y-16 translate-x-16"></div>

    <p className="text-slate-500 mb-4">

      Benign Cases

    </p>

    <h1 className="text-5xl font-bold text-orange-500 mb-4">

      <CountUp
        end={benignCount}
        duration={2}
      />

    </h1>

    <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

      <span className="text-3xl">

        🟠

      </span>

    </div>

  </motion.div>

  {/* NORMAL */}

  <motion.div

    whileHover={{ y: -5 }}

    // className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200"
    className="

      relative overflow-hidden

      bg-white rounded-3xl

      shadow-xl

      p-8

      border border-slate-200

      transition-all duration-500

      hover:-translate-y-2
      hover:shadow-2xl

    "

  >

    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-100 rounded-full blur-3xl opacity-30 -translate-y-16 translate-x-16"></div>

    <p className="text-slate-500 mb-4">

      Normal Cases

    </p>

    <h1 className="text-5xl font-bold text-green-500 mb-4">

      <CountUp
        end={normalCount}
        duration={2}
      />

    </h1>

    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">

      <span className="text-3xl">

        🟢

      </span>

    </div>

  </motion.div>

</div>

      {/* <div className="mt-10 bg-white rounded-3xl shadow-xl p-6"> */}
      <div className="mt-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-6">


      

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

          
          {/* SEARCH */}

          <div className="relative w-full md:w-[500px]">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}

              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-700"
            />

          </div>

          {/* BUTTON */}

          <button className="flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg transition-all">

            <FaSearch />

            Search Patient

          </button>

        </div>

      </div>

    <div className="flex flex-wrap gap-4 mt-8">

  {["All", "Malignant", "Benign", "Normal"].map((filter) => (

    <motion.button
      whileHover={{ y: -2 }}

      whileTap={{ scale: 0.97 }}

      key={filter}

      onClick={() => setActiveFilter(filter)}

      className={` px-6 py-3 rounded-2xl font-semibold transition-all duration-300

        ${

          activeFilter === filter

            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl'

            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'

        }

      `}
    >

      {filter}

    </motion.button>

  ))}

</div> 


      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10 "> */}

  {/* TOTAL */}
{/* <motion.div

  whileHover={{
    y: -10,
    scale: 1.02
  }}

  transition={{
    type: "spring",
    stiffness: 200
  }}

  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 p-8 shadow-2xl"

>


  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 shadow-xl text-white">

    <p className="text-cyan-100 mb-2">

      Total Patients

    </p>

    <h1 className="text-5xl font-bold">

      {stats.total}

    </h1>

  </div>
  </motion.div> */}

  {/* MALIGNANT */}

{/* <motion.div

  whileHover={{
    y: -10,
    scale: 1.02
  }}

  transition={{
    type: "spring",
    stiffness: 200
  }}

  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 p-8 shadow-2xl"

>

  <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-6 shadow-xl text-white">

    <p className="text-red-100 mb-2">

      Malignant Cases

    </p>

    <h1 className="text-5xl font-bold">

      {stats.malignant}

    </h1>

  </div>
</motion.div> */}
  {/* BENIGN */}

  {/* BENIGN */}

 {/* <motion.div
 
   whileHover={{
     y: -10,
     scale: 1.02
   }}
 
   transition={{
     type: "spring",
     stiffness: 200
   }}
 
   className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-8 shadow-2xl"
 
 >

<div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 shadow-xl text-white">

  <p className="text-amber-100 mb-2">

    Benign Cases

  </p>

  <h1 className="text-5xl font-bold">

    {stats.benign}

  </h1>

</div>
</motion.div> */}
  {/* NORMAL */}
{/* <motion.div

  whileHover={{
    y: -10,
    scale: 1.02
  }}

  transition={{
    type: "spring",
    stiffness: 200
  }}

  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 p-8 shadow-2xl"

>

  <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-6 shadow-xl text-white">

    <p className="text-green-100 mb-2">

      Normal Cases

    </p>

    <h1 className="text-5xl font-bold">

      {stats.normal}

    </h1>

  </div>
</motion.div>

</div> */}

<div className="bg-white rounded-3xl shadow-2xl mt-10 overflow-hidden">

  {/* HEADER */}

  {/* <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">

    <div>

      <h2 className="text-3xl font-bold text-slate-800">

        Patient Records

      </h2>

      <p className="text-slate-500 mt-1">

        AI-generated diagnostic reports and patient scan history

      </p>

    </div>

  </div> */}

  {/* TABLE PLACEHOLDER */}

  {loading ? (
    <div className="bg-white rounded-b-3xl shadow-xl border-x border-b border-slate-200 p-8 animate-pulse">

  {/* ROWS */}

  <div className="space-y-6">

    {[...Array(5)].map((_, index) => (

      <div

        key={index}

        className="grid grid-cols-5 gap-6 items-center border-b border-slate-100 pb-6"

      >

        {/* ID */}

        <div className="h-6 w-12 bg-slate-200 rounded"></div>

        {/* PATIENT */}

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-slate-200"></div>

          <div className="space-y-3">

            <div className="h-5 w-40 bg-slate-200 rounded"></div>

            <div className="h-4 w-28 bg-slate-100 rounded"></div>

          </div>

        </div>

        {/* CLASSIFICATION */}

        <div className="h-10 w-32 bg-slate-200 rounded-2xl"></div>

        {/* CONFIDENCE */}

        <div className="space-y-3">

          <div className="h-4 w-28 bg-slate-200 rounded"></div>

          <div className="h-3 w-full bg-slate-100 rounded-full"></div>

        </div>

        {/* BUTTON */}

        <div className="h-12 w-36 bg-slate-200 rounded-2xl"></div>

      </div>

    ))}

  </div>

</div>

) : (

  <div className="overflow-x-auto">
    {/* TABLE TOPBAR */}

<div className="bg-white border border-slate-200 rounded-t-3xl px-8 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

  {/* LEFT */}

  <div>

    <h2 className="text-3xl font-bold text-slate-800 mb-2">

      Patient Diagnostic Records

    </h2>

    <p className="text-slate-500">

      AI-generated diagnostic reports and lung CT scan analysis database.

    </p>

  </div>

  {/* RIGHT */}

  <div className="flex flex-wrap items-center gap-4">

    {/* PAGE */}

    <div className="bg-slate-100 rounded-2xl px-5 py-4">

      <p className="text-slate-500 text-sm mb-1">

        Current Page

      </p>

      <h3 className="text-2xl font-bold text-slate-800">

        {currentPage}

      </h3>

    </div>

    {/* RESULTS */}

    <div className="bg-slate-100 rounded-2xl px-5 py-4">

      <p className="text-slate-500 text-sm mb-1">

        Visible Results

      </p>

      <h3 className="text-2xl font-bold text-slate-800">

        {currentPatients.length}

      </h3>

    </div>

    {/* AI */}

    <div className="bg-green-50 rounded-2xl px-5 py-4 border border-green-100">

      <div className="flex items-center gap-3">

        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

        <div>

          <p className="text-green-600 text-sm">

            AI System

          </p>

          <h3 className="font-bold text-slate-800">

            Active

          </h3>

        </div>

      </div>

    </div>

  </div>

</div>
  {/* <div className="overflow-x-auto rounded-3xl"> */}
  <div className="overflow-x-auto rounded-b-3xl bg-white shadow-xl border-x border-b border-slate-200">

  <table className="w-full">

    {/* <thead className="bg-slate-50 border-b border-slate-200"> */}
    <thead className="sticky top-0 z-10">

      <tr>

  {/* <th className="text-left px-8 py-5 text-slate-600 font-semibold"> */}
      <th className="bg-slate-100 text-slate-700 font-bold px-6 py-5 text-left">

    Patient ID

  </th>

  {/* <th className="text-left px-8 py-5 text-slate-600 font-semibold"> */}
      <th className="bg-slate-100 text-slate-700 font-bold px-6 py-5 text-left">


    Patient

  </th>

  {/* <th className="text-left px-6 py-5 text-slate-600 font-semibold"> */}
      <th className="bg-slate-100 text-slate-700 font-bold px-6 py-5 text-left">

    Classification

  </th>

  {/* <th className="text-left px-6 py-5 text-slate-600 font-semibold"> */}
      <th className="bg-slate-100 text-slate-700 font-bold px-6 py-5 text-left">

    Confidence

  </th>

  {/* <th className="text-left px-6 py-5 text-slate-600 font-semibold"> */}
      <th className="bg-slate-100 text-slate-700 font-bold px-6 py-5 text-left">

    Actions

  </th>

</tr>

    </thead>

  <motion.tbody

  initial={{ opacity: 0 }}

  animate={{ opacity: 1 }}

  transition={{ duration: 0.3 }}

>

{filteredPatients.length > 0 ? (

  currentPatients.map((patient) => (

  <motion.tr

  onClick={() => navigate(`/patient/${patient.id}`)}
  key={patient.id}

  initial={{ opacity: 0, y: 10 }}

  animate={{ opacity: 1, y: 0 }}

  transition={{ duration: 0.3 }}

  whileHover={{
    scale: 1.01
  }}

  // className="border-b border-slate-100 hover:bg-slate-50 transition-all"
  className="border-b border-slate-100 hover:bg-cyan-50 transition-all cursor-pointer"

>

      {/* PATIENT ID */}

      <td className="px-8 py-6 font-semibold text-slate-700">

        #{patient.id}

      </td>

      {/* PATIENT */}

      <td className="px-8 py-6">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">

            {patient.name?.charAt(0)}

          </div>

          <div>

            <h3 className="font-semibold text-slate-800 text-lg">

              {patient.name}

            </h3>

            <p className="text-slate-500">

              Lung CT Scan Report

            </p>

          </div>

        </div>

      </td>

      {/* CLASSIFICATION */}

      <td className="px-6 py-6">

        <div
          className={`inline-flex items-center px-4 py-2 rounded-2xl font-semibold text-white

          ${
            patient.classified?.includes("Malignant")
              ? "bg-red-500"

              : patient.classified?.includes("Benign")
              ? "bg-orange-500"

              : "bg-green-500"
          }
          `}
        >

          {patient.classified}

        </div>

      </td>

      {/* CONFIDENCE */}

      <td className="px-6 py-6">

        <div className="w-[180px]">

          <div className="flex justify-between mb-2">

            <span className="text-slate-600 font-medium">

              AI Confidence

            </span>

            <span className="font-bold text-slate-800">

              {patient.confidence_score?.toFixed(1)}%

            </span>

          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

            <div
              style={{
                width: `${patient.confidence_score}%`
              }}

              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
            ></div>

          </div>

        </div>

      </td>

      {/* ACTIONS */}

      <td className="px-6 py-6">

        <button

          onClick={() => navigate(`/patient/${patient.id}`)}

          onClick={(e) => {
            e.stopPropagation();
            navigate(`/patient/${patient.id}`);
          }}

          className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-3 rounded-2xl shadow-lg transition-all hover:scale-105 font-semibold"

        >

          View Details

        </button>

      </td>

    </motion.tr>

  ))

) : (

  <tr>

    <td colSpan="5" className="py-20 text-center">

      <div className="flex flex-col items-center">

        {/* ICON */}

        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">

          <span className="text-5xl">

            🔍

          </span>

        </div>

        {/* TITLE */}

        <p className="text-3xl font-bold text-slate-800 mb-3">

          No Patients Found

        </p>

        {/* DESCRIPTION */}

        <p className="text-slate-500 max-w-lg leading-relaxed">

          No patient records matched your current
          search query or diagnostic filter selection.

        </p>

      </div>

    </td>

  </tr>

)}


    </motion.tbody>

  </table>
  </div>

  {/* PAGINATION */}

{totalPages > 1 && (

  <div className="flex flex-wrap items-center justify-center gap-4 mt-10 mb-1">

    {/* PREVIOUS */}

    <button

      onClick={() =>
        setCurrentPage((prev) => Math.max(prev - 1, 1))
      }

      disabled={currentPage === 1}

      className={`

        px-5 py-3 rounded-2xl font-semibold transition-all

        ${

          currentPage === 1

            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'

            : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'

        }

      `}
    >

      Previous

    </button>

    {/* PAGE NUMBERS */}

    {[...Array(totalPages)].map((_, index) => {

      const page = index + 1;

      return (

        <button

          key={page}

          onClick={() => setCurrentPage(page)}

          className={`

            w-12 h-12 rounded-2xl font-bold transition-all

            ${

              currentPage === page

                ? 'bg-cyan-500 text-white shadow-lg'

                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'

            }

          `}
        >

          {page}

        </button>

      );

    })}

    {/* NEXT */}

    <button

      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(prev + 1, totalPages)
        )
      }

      disabled={currentPage === totalPages}

      className={`

        px-5 py-3 rounded-2xl font-semibold transition-all

        ${

          currentPage === totalPages

            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'

            : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'

        }

      `}
    >

      Next

    </button>

  </div>

)}

</div>
)}

</div>
</div>

     </div>

  );

};

export default Patients;