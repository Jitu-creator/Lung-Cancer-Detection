import logo from './logo.svg';
import { Toaster } from "react-hot-toast";

import './App.scss';
import Navbar from './Navbar';
import Sidebar from './sidebar';
import Footer from './footer';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Outlet
} from 'react-router-dom';

import Home from './components/Home';
import About from './components/About';
import Patient from './components/Patient';
import Login from './components/Login';
import Signup from './components/Signup';
import Doctor from './components/Doctor';
import Patientdata from './components/Patientdata';
import Search from './components/Search';
import Doctor2 from './components/Doctor2';
import Services from './components/Services';
import Editpatient from './components/Editpatient';
import PatientDetails from './components/PatientDetails'
import Patients from './components/Patients'
import RootGateway from './components/RootGateway';


function NavbarLayout() {
  return (
    <>
      <div class="mb-4"><Navbar/></div>
      <Outlet /> {/* This will render the sub-routes below */}
    </>
  );
}



const  App =()=> {

return (
  
     <>
     <Router>
        <Toaster

          position="top-right"

          toastOptions={{

            duration: 3000,

            style: {

              background: "#ffffff",

              color: "#0f172a",

              borderRadius: "18px",

              padding: "16px",

              fontWeight: "600",

              boxShadow: "0 10px 40px rgba(0,0,0,0.1)"

            }

          }}

        />
     {/* <div class="mb-4"><Navbar/></div> */}
     <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/" element={<RootGateway />} />

        <Route element={<NavbarLayout />}>
            
            {/* <Route path="/" element={<RootGateway />} /> */}
            <Route exact path='home' element={< Home />}></Route>
            <Route exact path='about' element={< About />}></Route>
            <Route exact path='patient_form' element={< Patient />}></Route>
            {/* <Route exact path='login' element={<Login />}></Route> */}
            {/* <Route exact path='register' element={<Signup />}></Route> */}
            <Route exact path='/doctor_profile' element={<Doctor2 />}></Route>
            <Route exact path='/patientdata' element={<Patientdata />}></Route>
            <Route exact path='/search' element={<Search />}></Route>
            <Route exact path='/services' element={<Services/>}></Route>
            <Route exact path='/editpatient/:id' element={<Editpatient/>}></Route>

            <Route exact path='/patient/:id' element={<PatientDetails/>}></Route>

            <Route exact path='/patients' element={<Patients/>}></Route>
        </Route>
          </Routes>
     </Router>

      </>
 
      );
      
  
}

export default App;
