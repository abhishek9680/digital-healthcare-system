import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/login/LoginPage";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/register/RegisterPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Patientdashboard from "./pages/patient_dashboard/Patientdashboard";
import Doctordashboard from "./pages/doctor_dashboard/Doctordashboard";
import AdminDashboard from "./pages/admin_dashboard/AdminDashboard";

export default function AppRouter() {
  return (
    <>
      <BrowserRouter>
      <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/patient-dashboard" element={
            <ProtectedRoute>
              <Patientdashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute>
              <Doctordashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />



        </Routes>
      </BrowserRouter>
    </>
  );
}
