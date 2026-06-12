

import React from "react";

import { motion } from "framer-motion";

import {

  FaBrain,
  FaHeartbeat,
  FaXRay,
  FaUserMd

} from "react-icons/fa";

import medical from "../images/medical.jpg";
import { useNavigate } from "react-router-dom";


const features = [

  {
    icon: <FaBrain size={32} />,
    title: "AI Classification",
    description:
      "DenseNet121-powered deep learning model for multi-class lung cancer detection."
  },

  {
    icon: <FaXRay size={32} />,
    title: "GradCAM Explainability",
    description:
      "Visual heatmaps showing exactly where the AI focuses during diagnosis."
  },

  {
    icon: <FaHeartbeat size={32} />,
    title: "Real-Time Analysis",
    description:
      "Instant prediction with confidence scores and analytics dashboard."
  },

  {
    icon: <FaUserMd size={32} />,
    title: "Doctor Dashboard",
    description:
      "Professional medical interface for patient monitoring and reports."
  }

];

const Home = () => {
  const navigate = useNavigate();

  return (

    <div className="bg-slate-50 min-h-screen overflow-hidden">

      {/* HERO SECTION */}

      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">

        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >

            <p className="text-cyan-400 font-semibold mb-4 uppercase tracking-widest">

              AI Powered Medical Diagnostics

            </p>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">

              Lung Cancer Detection
              <span className="text-cyan-400">
                {" "}Using Deep Learning
              </span>

            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-8">

              Advanced AI-assisted platform for early lung cancer diagnosis
              using DenseNet121, GradCAM visualization, and real-time
              medical analytics.

            </p>

            <div className="flex flex-wrap gap-4">

              <button onClick={() => navigate('/patient_form')} 
              className="bg-cyan-500 hover:bg-cyan-400 transition-all px-8 py-4 rounded-xl font-semibold shadow-lg">

                Start Diagnosis

              </button>

              <button className="border border-cyan-400 hover:bg-cyan-500/20 transition-all px-8 py-4 rounded-xl font-semibold">

                Learn More

              </button>

            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >

            <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full"></div>

            <img
              src={medical}
              alt="medical"
              className="relative rounded-3xl shadow-2xl border border-cyan-400/20"
            />

          </motion.div>

        </div>

      </section>

      {/* STATS */}

      <section className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {[
            ["93.3%", "AI Accuracy"],
            ["10+", "CT Scans"],
            ["Real-Time", "Prediction"],
            ["GradCAM", "Explainability"]
          ].map((item, index) => (

            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-xl p-6 text-center"
            >

              <h1 className="text-3xl font-bold text-blue-600 mb-2">

                {item[0]}

              </h1>

              <p className="text-slate-600">

                {item[1]}

              </p>

            </motion.div>

          ))}

        </div>

      </section>

      {/* FEATURES */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-slate-800 mb-4">

            Intelligent AI Diagnostic Features

          </h2>

          <p className="text-slate-600 max-w-2xl mx-right-auto">

            Combining deep learning, medical imaging, and explainable AI
            to assist doctors in rapid lung cancer diagnosis.

          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => (

            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all"
            >

              <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-6">

                {feature.icon}

              </div>

              <h3 className="text-2xl font-semibold mb-4 text-slate-800">

                {feature.title}

              </h3>

              <p className="text-slate-600 leading-relaxed">

                {feature.description}

              </p>

            </motion.div>

          ))}

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="bg-slate-900 text-white py-24">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-16">

            <h2 className="text-4xl font-bold mb-4">

              How The AI System Works

            </h2>

            <p className="text-slate-300">

              Complete AI-powered diagnostic workflow

            </p>

          </div>

          <div className="grid md:grid-cols-4 gap-8">

            {[
              "Upload CT Scan",
              "AI Image Analysis",
              "GradCAM Heatmap",
              "Diagnostic Report"
            ].map((step, index) => (

              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700"
              >

                <div className="w-14 h-14 rounded-full bg-cyan-500 mx-auto mb-6 flex items-center justify-center text-xl font-bold">

                  {index + 1}

                </div>

                <h3 className="text-xl font-semibold">

                  {step}

                </h3>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;