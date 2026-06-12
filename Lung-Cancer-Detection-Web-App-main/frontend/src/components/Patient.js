import { motion } from "framer-motion";
import toast from "react-hot-toast";

import React from "react";
import './component.scss';
// import 'bootstrap/dist/css/bootstrap.css';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Patientdata.css'
const Patient = () => {


  const navigate = useNavigate();
  const [patientdata, setPatient] = useState(
    {
      name:"",
      email:"",
      dob:"",
      state:"",
      phone_number: "",
      gender:"",
      location:"",
      pimage:null,
    }
  ) 

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false)
  const setVal = (event) => {
    // const {name,value} = e.target;
    const name = event.target.name;
    const value = event.target.value;
    // event.preventDefault();

    // setdata({...data,[name]:value})
    setPatient((prev) => {
      return { ...prev, [name]: value }
    })

    
  }

  const setImage = (event) => {

  const file = event.target.files[0]

  setPatient(prev => ({
    ...prev,
    pimage: file
  }))

  if (file) {

    setPreviewImage(URL.createObjectURL(file))

  }

}

  // const predict = ()=>{
  //   console.log(patientdata)
  // }



  const patientformdata = new FormData();
  patientformdata.append('name', patientdata.name);
  patientformdata.append('email', patientdata.email);
  patientformdata.append('dob', patientdata.dob);
  patientformdata.append('state', patientdata.state);
  patientformdata.append('gender', patientdata.gender);
  patientformdata.append('phone_number', patientdata.phone_number);
  patientformdata.append('location', patientdata.location);
  patientformdata.append('pimage', patientdata.pimage); 

  // const {fname,email,dob,state,location,pimage} = patientdata;
  const predict = async (e) => {
    e.preventDefault();
    setLoading(true)

    console.log(patientdata)

    const userdata = {
      name: patientdata.name,
      email: patientdata.email,
      dob: patientdata.dob,
      phone_number: patientdata.phone_number,
      state: patientdata.state,
      gender: patientdata.gender,
      location: patientdata.location,
      pimage: patientdata.pimage,
    }

    
     try {
      const response = await axios.post('http://127.0.0.1:8000/api/patient/', patientformdata);
      console.log(response.status)
      console.log(response)
      if (response.status===201) {
        console.log("data is ",response.data);
        setLoading(false)
        toast.success("Patient report added successfully")
        navigate('/patientdata')
      }else 
      {
        toast.error("Failed to add patient report")
      } 

       
    } catch (error) {
      setLoading(false)
      toast.error("Invalid Credential")
    }
  }




  console.log(patientdata)

  return (
    <motion.div

  initial={{ opacity: 0, y: 20 }}

  animate={{ opacity: 1, y: 0 }}

  transition={{ duration: 0.6 }}

  className="min-h-screen bg-slate-100 p-6"

>
      {/* HERO */}

<div className="mb-12">

  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

    {/* LEFT */}

    <div>

      <p className="text-cyan-600 font-semibold uppercase tracking-wider mb-3">

        AI Lung Cancer Detection System

      </p>

      <h1 className="text-5xl font-bold text-slate-800 mb-4 leading-tight">

        Upload Patient
        CT Scan Report

      </h1>

      <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">

        Upload lung CT scan imagery and patient metadata
        to generate AI-assisted diagnostic analysis with
        GradCAM explainability visualization.

      </p>

    </div>

    {/* RIGHT */}

    <div className="bg-white rounded-3xl shadow-xl p-8 min-w-[280px]">

      <p className="text-slate-500">

        AI Diagnostic Engine

      </p>

      <div className="flex items-center gap-3">

        <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>

        <h2 className="text-2xl font-bold text-slate-800">

          Active

        </h2>

      </div>

      <p className="text-slate-500">

        Deep learning inference system ready
        for diagnostic processing.

      </p>

    </div>

  </div>

</div>

            <h1 class="text-primary mb-4">Fill Patient Health details</h1>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* <div class="row align-items-center pt-4 pb-3">
                  <div class="col-md-3 ps-5">

                    <h6 class="mb-0">Full name</h6>

                  </div>
                  <div class="col-md-9 pe-5">

                    <input type="text" name="name" className="form-control "  value={patientdata.name}  onChange={setVal}/>

                  </div>
                </div> */}

                <div>

                  <label className="block text-slate-700 font-semibold mb-3">

                    <i>Full Name</i>

                  </label>

                  <input
                    type="text"
                    name="name"
                    value={patientdata.name}
                    onChange={setVal}

                    placeholder="Enter patient full name"

                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-slate-700"
                  />

                </div>

               <div>

                  <label className="block text-slate-700 font-semibold mb-3">

                    <i>Email Address</i>

                  </label>

                  <input
                    type="email"
                    name="email"
                    value={patientdata.email}
                    onChange={setVal}

                    placeholder="Enter patient email"

                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-slate-700"
                  />

                </div>

                <div>

                  <label className="block text-slate-700 font-semibold mb-3">

                    <i>Date of Birth</i>

                  </label>

                  <input
                    type="date"
                    name="dob"
                    value={patientdata.dob}
                    onChange={setVal}

                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-slate-700"
                  />

                </div>
                  


                <div>

                  <label className="block text-slate-700 font-semibold mb-3">

                    <i>State</i>

                  </label>

                  <input
                    type="text"
                    name="state"
                    value={patientdata.state}
                    onChange={setVal}

                    placeholder="Enter state"

                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-slate-700"
                  />

                </div>


                <div>

                  <label className="block text-slate-700 font-semibold mb-3">

                    <i>Phone Number</i>

                  </label>

                  <input
                    type="text"
                    name="phone_number"
                    value={patientdata.phone_number}
                    onChange={setVal}

                    placeholder="Enter phone number"

                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-slate-700"
                  />

                  </div>
    
                <div>

                <label className="block text-slate-700 font-semibold mb-3">

                  <i>Gender</i>

                </label>

                <select
                  name="gender"
                  value={patientdata.gender}
                  onChange={setVal}

                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-slate-700"
                >

                  <option value="">Select Gender</option>

                  <option value="male">Male</option>

                  <option value="female">Female</option>

                  <option value="other">Other</option>

                </select>

              </div>

               
                <div className="mt-10">

                  <label className="block text-slate-700 font-semibold mb-3">

                    Address

                  </label>

                  <textarea
                    rows="2"
                    name="location"
                    value={patientdata.location}
                    onChange={setVal}

                    placeholder="Enter patient address"

                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-slate-700 resize-none"
                  ></textarea>

                </div>
              </div>

                
{/* CT SCAN UPLOAD */}

<div className="mt-20">

  {/* HEADER */}

  <div className="mb-6">

    <p className="text-3xl font-bold text-slate-800 mb-2">CT Scan Upload</p>
                  
     
    {/* <h2 className=""> */}
      {/* <h2 className="text-3xl font-bold text-slate-800 mb-2"></h2> */}

      {/* CT Scan Upload

    </h2> */}

    <p className="text-slate-500">

      <i>Upload lung CT scan imagery for AI-assisted
      diagnostic analysis.</i>
    </p>

  </div>

  {/* UPLOAD CARD */}

  <div className="border-2 border-dashed border-cyan-300 rounded-3xl bg-cyan-50/40 p-10 text-center hover:border-cyan-400 transition-all">

    {/* ICON */}

    <div className="w-24 h-24 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-6">

      <span className="text-5xl">

        🩻

      </span>

    </div>

    {/* TITLE */}

    <h3 className="text-2xl font-bold text-slate-800 mb-3">

      Upload CT Scan Image

    </h3>

    {/* DESCRIPTION */}

    <p className="text-slate-500 mb-8 max-w-2xl mx-auto">

      <i>Supported formats: JPG, PNG, JPEG.</i>

    </p>

    {/* INPUT */}

    <input
      type="file"
      name="pimage"
      onChange={setImage}

      className="hidden"

      id="scanUpload"
    />

    {/* BUTTON */}

    <label

      htmlFor="scanUpload"

      className="inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-2xl shadow-lg transition-all hover:scale-105 font-semibold cursor-pointer"

    >

      Select CT Scan

    </label>

  </div>

  {/* IMAGE PREVIEW */}

  {previewImage && (

    <div className="mt-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">

      {/* TOP */}

      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

        <div>

          <h3 className="text-2xl font-bold text-slate-800">

            Scan Preview

          </h3>

          <p className="text-slate-500">

            Uploaded CT scan ready for AI processing

          </p>

        </div>

        <div className="px-4 py-2 rounded-xl bg-green-100 text-green-600 font-semibold">

          Ready

        </div>

      </div>

      {/* IMAGE */}

      <div className="p-6">

        <img
          src={previewImage}
          alt="preview"

          className="w-full max-h-[500px] object-contain rounded-2xl border border-slate-200"
        />

      </div>

    </div>

  )}

</div>

{/* ACTION BAR */}

<div className="mt-10 flex flex-col  lg:items-center lg:justify-between gap-6">

  {/* INFO */}

  {/* <div>

    <h3 className="text-2xl font-bold text-slate-800 mb-2">

      Ready for AI Analysis

    </h3>

    <p className="text-slate-500">

      Deep learning diagnostic engine will process
      uploaded CT scan and generate GradCAM analysis.

    </p>

  </div> */}

                  {/* BUTTON */}

                  <button

                    type="submit"

                    onClick={predict}

                    disabled={loading}

                    className={`

                      px-10 py-3 rounded-2xl text-white font-bold text-lg shadow-2xl transition-all

                      ${

                        loading

                          ? 'bg-slate-400 cursor-not-allowed'

                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 hover:shadow-cyan-200'

                      }

                    `}
                  >

                    {

                      loading

                        ? 'Analyzing CT Scan...'

                        : 'Run AI Diagnosis'

                    }

                  </button>

                </div>

                

              </div>
            </div>

         
    </motion.div>
  );
  }

export default Patient;
