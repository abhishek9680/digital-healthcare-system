import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/login/LoginPage";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/register/RegisterPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Patientdashboard from "./pages/patient_dashboard/Patientdashboard";
import Doctordashboard from "./pages/doctor_dashboard/Doctordashboard";

export default function AppRouter() {
  return (
    <>
      <BrowserRouter>
      <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/patient-dashboard" element={<Patientdashboard />} />
          <Route path="/doctor-dashboard" element={<Doctordashboard />} />



        </Routes>
      </BrowserRouter>
    </>
  );
}
