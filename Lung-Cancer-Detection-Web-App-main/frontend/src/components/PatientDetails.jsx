import jsPDF from "jspdf";

import html2canvas from "html2canvas";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {

  FaDownload,
  FaPrint,
  FaShareAlt,
  FaFilePdf,
  FaTrash

} from "react-icons/fa";
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { ImageZoom } from "../image-zoom.tsx";

const PatientDetails = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const reportRef = useRef()
  const [selectedImage, setSelectedImage] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {

    axios
      .get(`http://127.0.0.1:8000/api/patient_details/?id=${id}`)

      .then(response => {

        setPatient(response.data.data)

      })

      .catch(error => {

        console.log(error)

      })

  }, [id])

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const generatePDF = async () => {

  const input = reportRef.current;

  if (!input) return;

  try {

    const canvas = await html2canvas(input, {

      scale: 2,

      useCORS: true,

      logging: false,

      scrollY: -window.scrollY,

      backgroundColor: "#ffffff"

    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();

        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;

        const imgHeight =
          (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pdfHeight;

        while (heightLeft > 10) {

          position = heightLeft - imgHeight;

          pdf.addPage();

          pdf.addImage(
            imgData,
            "PNG",
            0,
            position,
            imgWidth,
            imgHeight
          );

          heightLeft -= pdfHeight;

        }

        pdf.save(

          `Patient_Report_${patient?.name || "Report"}.pdf`
        );
        toast.success("Medical report exported successfully");

  } catch (error) {

    console.log(error);
    toast.error("Failed to export medical report");

  }

}

const handlePrint = () => {

      window.print();

}

const handleShare = async () => {

  const shareData = {

    title: "AI Lung Cancer Diagnostic Report",

    text: `Diagnostic report for ${patient?.name}`,

    url: window.location.href

  };

  try {

    /* MOBILE / MODERN SHARE */

    if (navigator.share) {

      await navigator.share(shareData);

    }

    /* FALLBACK */

    else {

      await navigator.clipboard.writeText(
        window.location.href
      );

      toast.success("Report link copied to clipboard");

    }

  } catch (error) {

    console.log(error);

  }

}

  const confirmDelete = async () => {

  try {

    setShowDeleteModal(false)

    await axios.delete(

      `http://127.0.0.1:8000/api/delete_patient/${id}/`
    )


    navigate('/patients')

  } catch (error) {

    console.log(error)

    toast.error("Failed to delete patient")

  }

}

  if (!patient) {

  return (

    // <div className="min-h-screen bg-slate-100 p-6 animate-pulse">

    <motion.div

  initial={{ opacity: 0, y: 20 }}

  animate={{ opacity: 1, y: 0 }}

  transition={{ duration: 0.6 }}

  className="min-h-screen bg-slate-100 p-6"

>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

        <div>

          <div className="h-5 w-48 bg-slate-300 rounded mb-4"></div>

          <div className="h-12 w-96 bg-slate-300 rounded mb-4"></div>

          <div className="h-5 w-[500px] bg-slate-300 rounded"></div>

        </div>

        <div className="w-48 h-24 bg-slate-300 rounded-3xl"></div>

      </div>

      {/* INFO GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        {[...Array(6)].map((_, index) => (

          <div
            key={index}
            className="bg-white rounded-3xl p-6 h-36"
          >

            <div className="h-4 w-24 bg-slate-200 rounded mb-4"></div>

            <div className="h-8 w-40 bg-slate-300 rounded"></div>

          </div>

        ))}

      </div>

      {/* ANALYTICS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {[...Array(3)].map((_, index) => (

          <div
            key={index}
            className="bg-white rounded-3xl p-6 h-52"
          >

            <div className="h-4 w-32 bg-slate-200 rounded mb-6"></div>

            <div className="h-10 w-40 bg-slate-300 rounded mb-6"></div>

            <div className="h-3 w-full bg-slate-200 rounded"></div>

          </div>

        ))}

      </div>

    </motion.div>

  )

}

  return (

    <div className="min-h-screen bg-slate-100 p-6" ref={reportRef}>
      
      <div className="mb-10">

  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

    {/* LEFT */}

    <div>

      <p className="text-cyan-600 font-semibold uppercase tracking-wider mb-2">

        AI Medical Diagnostic Report

      </p>

      <h1 className="text-5xl font-bold text-slate-800 mb-3">

        Patient Analysis Overview

      </h1>

      <p className="text-slate-500 text-lg">

        Deep learning assisted lung cancer diagnostic
        report with GradCAM explainability.

      </p>

    </div>

    {/* RIGHT */}

    <div className="bg-white rounded-3xl shadow-xl px-8 py-6">

      <p className="text-slate-500 mb-2">

        AI Prediction

      </p>

      <div
        className={`inline-flex items-center px-5 py-3 rounded-2xl text-white font-bold text-lg

        ${
          patient.classified?.includes('Malignant')
            ? 'bg-red-500'

            : patient.classified?.includes('Benign')
            ? 'bg-orange-500'

            : 'bg-green-500'
        }
        `}
      >

        {patient.classified}

      </div>

    </div>

  </div>

</div>

     

      <div className="bg-white rounded-3xl shadow-2xl p-8">

       

<div className="mb-12">

  <div className="flex items-center justify-between mb-8">

    <div>

      <h2 className="text-3xl font-bold text-slate-800 mb-2">

        Patient Information

      </h2>

      <p className="text-slate-500">

        Personal and diagnostic metadata associated
        with the uploaded CT scan report.

      </p>

    </div>

  </div>

  {/* GRID */}

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {/* NAME */}

    <div className="bg-slate-50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <p className="text-slate-500 mb-2">

        Patient Name

      </p>

      <h3 className="text-2xl font-bold text-slate-800">

        {patient.name}

      </h3>

    </div>

    {/* EMAIL */}

    <div className="bg-slate-50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <p className="text-slate-500 mb-2">

        Email Address

      </p>

      <h3 className="text-xl font-semibold text-slate-800 break-all">

        {patient.email}

      </h3>

    </div>

    {/* PHONE */}

    <div className="bg-slate-50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <p className="text-slate-500 mb-2">

        Phone Number

      </p>

      <h3 className="text-2xl font-bold text-slate-800">

        {patient.phone_number}

      </h3>

    </div>

    {/* DOB */}

    <div className="bg-slate-50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <p className="text-slate-500 mb-2">

        Date of Birth

      </p>

      <h3 className="text-2xl font-bold text-slate-800">

        {patient.dob}

      </h3>

    </div>

    {/* GENDER */}

    <div className="bg-slate-50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <p className="text-slate-500 mb-2">

        Gender

      </p>

      <h3 className="text-2xl font-bold text-slate-800">

        {patient.gender}

      </h3>

    </div>

    {/* LOCATION */}

    <div className="bg-slate-50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <p className="text-slate-500 mb-2">

        Address

      </p>

      <h3 className="text-2xl font-bold text-slate-800">

        {patient.location}

      </h3>

    </div>

  </div>

</div>

        {/* AI Result */}

        {/* AI ANALYSIS */}

        {/* AI ANALYSIS */}

<div className="mb-12">

  {/* HEADER */}

  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-8">

  {/* LEFT */}

  <div>

    <h2 className="text-3xl font-bold text-slate-800 mb-2">

      AI Diagnostic Analysis

    </h2>

    <p className="text-slate-500">

      Deep learning generated diagnostic prediction
      based on uploaded CT scan imagery.

    </p>

  </div>

  {/* ACTIONS */}

  {/* <div className="flex flex-wrap gap-3"> */}
  <div className="flex flex-wrap gap-3 lg:mt-">

    <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-3 rounded-2xl shadow-lg transition-all hover:scale-105 font-semibold"

    onClick={generatePDF}>

      <FaDownload />

      Download

    </button>

    {/* <button className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-5 py-3 rounded-2xl shadow-lg transition-all hover:scale-105 font-semibold">

      <FaFilePdf />

      PDF

    </button> */}

    <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-2xl shadow-lg transition-all hover:scale-105 font-semibold"

    onClick={handlePrint}
    >

      <FaPrint />

      Print

    </button>

    <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-3 rounded-2xl shadow-lg transition-all hover:scale-105 font-semibold"

    onClick={handleShare}>

      <FaShareAlt />

      Share

    </button>

    <button

  onClick={() => setShowDeleteModal(true)}

  className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-5 py-3 rounded-2xl shadow-lg transition-all hover:scale-105 font-semibold"

>

  <FaTrash />

  Remove

</button>

  </div>

</div>

  {/* ANALYSIS STRIP */}

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* DIAGNOSIS */}

    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <p className="text-slate-500 mb-3">

        Diagnosis

      </p>

      <div
        className={`inline-flex items-center px-4 py-2 rounded-xl text-white font-semibold

        ${
          patient.classified?.includes('Malignant')
            ? 'bg-red-500'

            : patient.classified?.includes('Benign')
            ? 'bg-orange-500'

            : 'bg-green-500'
        }
        `}
      >

        {patient.classified}

      </div>

    </div>

    {/* CONFIDENCE */}

    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <p className="text-slate-500 mb-3">

        Confidence Score

      </p>

      <h1 className="text-4xl font-bold text-slate-800 mb-4">

        {patient.confidence_score?.toFixed(2)}%

      </h1>

      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">

        <div
          style={{
            width: `${patient.confidence_score}%`
          }}

          className="h-full bg-cyan-500 rounded-full"
        ></div>

      </div>

    </div>

    {/* AI STATUS */}

    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <p className="text-slate-500 mb-3">

        AI Status

      </p>

      <div className="flex items-center gap-3 mb-3">

        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

        <h3 className="text-xl font-bold text-slate-800">

          Active

        </h3>

      </div>

      <p className="text-slate-500 text-sm leading-relaxed">

        AI diagnostic engine processed scan
        successfully with stable prediction output.

      </p>

    </div>

    

  </div>

  

</div>




<div>

  {/* HEADER */}

  <div className="mb-8">

    <div className="text-3xl font-bold text-slate-800 mb-2">

      CT Scan Visualization

    </div>

    <p className="text-slate-500">

      Original CT scan alongside AI-generated
      GradCAM heatmap visualization for explainable diagnosis.

    </p>

  </div>

  {/* GRID */}

  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

    {/* ORIGINAL SCAN */}

    {/* <div className="bg-white rounded-3xl shadow-xl  overflow-hidden border border-slate-200"> */}
    <motion.div

  whileHover={{ y: -5 }}

  transition={{ duration: 0.3 }}

  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200"

>

      {/* TOP BAR */}

      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

        <div>

          <h3 className="text-2xl font-bold text-slate-800">

            Original CT Scan

          </h3>

          <p className="text-slate-500">

            Uploaded patient scan image

          </p>

        </div>

        <div className="px-4 py-2 rounded-xl bg-cyan-100 text-cyan-700 font-semibold">

          Raw Input

        </div>

      </div>

      {/* IMAGE */}

      <div className="p-6">  
        <img
          src={patient.pimage}
          alt="scan"
          className="w-full rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:scale-[1.02] transition-all duration-300"
          onClick={() => setSelectedImage(patient.pimage)}
        />

      </div>

    </motion.div>

    {/* HEATMAP */}

    {/* <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200"> */}
    <motion.div

  whileHover={{ y: -5 }}

  transition={{ duration: 0.3 }}

  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200"

>

      {/* TOP BAR */}

      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

        <div>

          <h3 className="text-2xl font-bold text-slate-800">

            AI Heatmap Analysis

          </h3>

          <p className="text-slate-500">

            GradCAM explainability visualization

          </p>

        </div>

        <div className="px-4 py-2 rounded-xl bg-red-100 text-red-600 font-semibold">

          AI Focus

        </div>

      </div>

      {/* IMAGE */}

      <div className="p-6">
        <img
          src={patient.heatmap_url}
          alt="heatmap"
          onClick={() => setSelectedImage(patient.heatmap_url)}
          className="w-full rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:scale-[1.02] transition-all duration-300"
        />

      </div>

   
    </motion.div>

       {/* DELETE MODAL */}

{showDeleteModal && (

  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">

    <motion.div

      initial={{ opacity: 0, scale: 0.9 }}

      animate={{ opacity: 1, scale: 1 }}

      exit={{ opacity: 0, scale: 0.9 }}

      className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"

    >

      {/* ICON */}

      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">

        <FaTrash className="text-red-500 text-3xl" />

      </div>

      {/* TITLE */}

      <h2 className="text-3xl font-bold text-slate-800 text-center mb-4">

        Delete Patient?

      </h2>

      {/* DESCRIPTION */}

      <p className="text-slate-500 text-center leading-relaxed mb-8">

        This action will permanently remove the patient
        record and associated diagnostic data.

      </p>

      {/* BUTTONS */}

      <div className="flex gap-4">

        {/* CANCEL */}

        <button

          onClick={() => setShowDeleteModal(false)}

          className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-2xl font-semibold transition-all"

        >

          Cancel

        </button>

        {/* DELETE */}

        <button

          onClick={confirmDelete}

          className="flex-1 bg-red-500 hover:bg-red-400 text-white py-4 rounded-2xl font-semibold shadow-lg transition-all hover:scale-105"

        >

          Delete

        </button>

      </div>

    </motion.div>

  </div>

)}


  </div>

</div>

      </div>

      {/* IMAGE MODAL */}

{selectedImage && (

  <div

    onClick={() => setSelectedImage(null)}

    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"

  >

    <img
      src={selectedImage}
      alt="preview"

      className="max-w-full max-h-full rounded-3xl shadow-2xl border-4 border-white"
    />

  </div>

)}

    </div>

  )

}

export default PatientDetails
