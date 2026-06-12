import { motion } from "framer-motion";

import {

  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer

} from "recharts";


import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import CountUp from "react-countup";

const Patientdata = () => {

  const [patients, setPatientsdata] = useState([]);

  const [stats, setStats] = useState({

    total: 0,

    malignant: 0,

    benign: 0,

    normal: 0,

    averageConfidence: 0

  })
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/list/')
      .then(response => {
        setPatientsdata(response.data.candidates);

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
        console.log(error);
      });
  }, []);


  // console.log("hello1")

  // function EditPatient(id){
  //   alert("Editing...")
  //   navigate(`editpatient/${id}`)
    

  // }

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };
  console.log(patients)

  


  const chartData = [

    {
      name: "Malignant",
      value: stats.malignant
    },

    {
      name: "Benign",
      value: stats.benign
    },

    {
      name: "Normal",
      value: stats.normal
    }

  ];

  const COLORS = [

    "#ef4444",
    "#f59e0b",
    "#22c55e"

  ];

  return (
    //<>

    <div className="min-h-screen bg-slate-100 p-6">


<div className="mb-10">

  <h1 className="text-5xl font-bold text-slate-800 mb-3">

    AI Diagnostic Dashboard

  </h1>

  <p className="text-slate-500 text-lg">

    Real-time lung cancer detection analytics
    and patient monitoring system.

  </p>

</div>



<div className="grid md:grid-cols-5 gap-6 mb-12">



  {/* Total */}

 

  <motion.div

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

  {/* GLOW EFFECT */}

  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

  {/* CONTENT */}

  <div className="relative z-10">

    <p className="text-cyan-100 text-lg font-medium mb-3">

      Total Patients

    </p>

    <h1 className="text-6xl font-bold text-white mb-4">

      <CountUp
        end={stats.total}
        duration={2}
      />

    </h1>

    <div className="flex items-center gap-2">

      <div className="w-3 h-3 rounded-full bg-green-300 animate-pulse"></div>

      <p className="text-cyan-100">

        Real-time monitoring active

      </p>

    </div>

  </div>

</motion.div>

  {/* Malignant */}


  <motion.div

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

  {/* GLOW */}

  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

  {/* CONTENT */}

  <div className="relative z-10">

    <p className="text-red-100 text-lg font-medium mb-3">

      Malignant Cases

    </p>

    <h1 className="text-6xl font-bold text-white mb-4">

      <CountUp
        end={stats.malignant}
        duration={2}
      />

    </h1>

    <div className="flex items-center gap-2">

      <div className="w-3 h-3 rounded-full bg-yellow-300 animate-pulse"></div>

      <p className="text-red-100">

        High-risk detections

      </p>

    </div>

  </div>

</motion.div>

  {/* Benign */}


  <motion.div

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

  {/* GLOW */}

  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

  {/* CONTENT */}

  <div className="relative z-10">

    <p className="text-amber-100 text-lg font-medium mb-3">

      Benign Cases

    </p>

    <h1 className="text-6xl font-bold text-white mb-4">

      <CountUp
        end={stats.benign}
        duration={2}
      />

    </h1>

    <div className="flex items-center gap-2">

      <div className="w-3 h-3 rounded-full bg-yellow-200 animate-pulse"></div>

      <p className="text-amber-100">

        Low-risk abnormalities

      </p>

    </div>

  </div>

</motion.div>

  {/* Normal */}

  {/* <div
    style={{
      ...cardStyle,
      backgroundColor: '#e8f5e9'
    }}
  >

    <h3>Normal Cases</h3>

    <h1 style={{ color: '#43a047' }}>
      {stats.normal}
    </h1>

  </div> */}

  <motion.div

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

  {/* GLOW */}

  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

  {/* CONTENT */}

  <div className="relative z-10">

    <p className="text-green-100 text-lg font-medium mb-3">

      Normal Cases

    </p>

    <h1 className="text-6xl font-bold text-white mb-4">

      {/* {stats.normal} */}
      <CountUp
        end={stats.normal}
        duration={2}
      />

    </h1>

    <div className="flex items-center gap-2">

      <div className="w-3 h-3 rounded-full bg-green-200 animate-pulse"></div>

      <p className="text-green-100">

        Healthy scan reports

      </p>

    </div>

  </div>

</motion.div>

  {/* Confidence */}

  

  <motion.div

  whileHover={{
    y: -10,
    scale: 1.02
  }}

  transition={{
    type: "spring",
    stiffness: 200
  }}

  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-8 shadow-2xl"

>

  {/* GLOW EFFECT */}

  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

  {/* CONTENT */}

  <div className="relative z-10">

    <p className="text-indigo-100 text-lg font-medium mb-3">

      AI Confidence

    </p>

    <h1 className="text-6xl font-bold text-white mb-4">

      <CountUp
        end={stats.averageConfidence}
        duration={2}
        decimals={1}
        suffix="%"
      />

    </h1>

    {/* MINI PROGRESS BAR */}

<div className="mt-2 w-full h-3 bg-white/20 rounded-full overflow-hidden"></div>

    {/* MINI STATUS */}

    <div className="flex items-center gap-2">

      <div className="w-3 h-3 rounded-full bg-cyan-200 animate-pulse"></div>

      <p className="text-indigo-100">

        

      </p>

    </div>

   

  </div>

</motion.div>

</div>


<motion.div

  initial={{ opacity: 0, y: 30 }}

  animate={{ opacity: 1, y: 0 }}

  transition={{ duration: 0.8 }}

  className="bg-white rounded-3xl shadow-2xl p-8 mb-12"

>

  {/* HEADER */}

  <div className="mb-8">

    <p className="text-3xl font-bold text-slate-800 mb-2">

      Cancer Distribution Analytics

    </p>

    <p className="text-slate-500">

      Real-time AI classification distribution
      across uploaded CT scan reports.

    </p>

  </div>

  {/* CHART */}

  <div className="h-[420px]">

    <ResponsiveContainer width="100%" height="100%">

      <PieChart>

        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={200}
          dataKey="value"
          label
        >

          {chartData.map((entry, index) => (

            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />

          ))}

        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>

  </div>

</motion.div>


        {modalImage && (

        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
          }}
        >

          <img
            src={modalImage}
            alt="heatmap"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '12px'
            }}
          />

        </div>

      )}
       
    </div>
  )
}

export default Patientdata