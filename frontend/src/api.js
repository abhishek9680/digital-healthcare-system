import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Login API
export const loginPatient = async (email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/patients/login`, { email, password });
    return res.data; // { token, patient }
  } catch (err) {
    throw err.response?.data || { message: 'Login failed' };
  }
};

export const loginDoctor = async (email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/doctors/login`, { email, password });
    return res.data; // { token, doctor }

  } catch (err) {
    throw err.response?.data || { message: 'Login failed' };
  }
};

// Register API
export const registerPatient = async (patientData) => {
  try {
    const res = await axios.post(`${BASE_URL}/patients/register`, patientData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Registration failed' };
  }
};

export const registerDoctor = async (doctorData) => {
  try {
    const res = await axios.post(`${BASE_URL}/doctors/register`, doctorData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Registration failed' };
  }
};

// Get patient profile
export const getPatientProfile = async (token) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const patientEmail = user?.email;
  const res= await axios.get(`${BASE_URL}/patients/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { patientEmail },
  });
  const patient = res.data.patient;
  return patient;
};

// Get doctor profile
export const getAllDoctors = async () => {
  const res = await axios.get(`${BASE_URL}/doctors/all`);
  return res.data.doctors;
};
export const getDoctorProfile = async (token) => {
  const email = JSON.parse(localStorage.getItem('user'))?.email;
  return axios.get(`${BASE_URL}/doctors/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { email },
  });
};

// Get patient appointments
export const getPatientAppointments = async (token) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const patientEmail = user?.email;
  const res= await axios.get(`${BASE_URL}/patients/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { patientEmail },
  });
  const appointments = res.data.appointments;

  return appointments;
};

// Book appointment
export const bookAppointment = async (token, doctorEmail, appointmentDate, patientEmail) => {
  const res = await axios.post(`${BASE_URL}/appointments/book`, {
    doctorEmail,
    appointmentDate,
    patientEmail,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.appointment;
};

// Get all appointments for doctor
export const getDoctorAppointments = async (token) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const doctorEmail = user?.email;
  const res = await axios.get(`${BASE_URL}/appointments/doctor`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { doctorEmail },
  });
  return res.data.appointments;
};

// Update patient profile
export const updatePatientProfile = async (token, profileData) => {
  const res = await axios.put(`${BASE_URL}/patients/update`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.patient;
};

// Update doctor profile
export const updateDoctorProfile = async (token, profileData) => {
  const res = await axios.put(`${BASE_URL}/doctors/update`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.doctor;
};

// Update appointment status (approve/reject)
export const updateAppointmentStatus = async (token, appointmentId, status) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const doctorEmail = user?.email;
  const res = await axios.patch(
    `${BASE_URL}/appointments/${appointmentId}/status`,
    { status, doctorEmail },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.appointment;
};

// Logout utility
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};