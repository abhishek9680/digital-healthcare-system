import React, { useState } from 'react';
import { loginPatient, loginDoctor } from '../../api';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [role, setRole] = useState('doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleRole = () => {
    setRole((prev) => (prev === 'doctor' ? 'patient' : 'doctor'));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let data;
      if (role === 'doctor') {
        data = await loginDoctor(email, password);
        localStorage.setItem('token', data.token);
        if (!data.doctor.speciality){
          data.doctor.speciality = "default";
        }
        localStorage.setItem('user', JSON.stringify(data.doctor));
        navigate('/doctor-dashboard');
      } else {
        data = await loginPatient(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.patient));
        navigate('/patient-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">{role === 'doctor' ? 'Doctor' : 'Patient'} Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            className="input input-bordered"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <div className="text-red-500 text-center text-sm">{error}</div>}
        </form>
        <button
          className="btn btn-outline btn-secondary mt-4 w-full"
          onClick={toggleRole}
          type="button"
        >
          Switch to {role === 'doctor' ? 'Patient' : 'Doctor'} Login
        </button>
        <div className="text-center mt-4">
          <span>New? </span>
          <a href="/register" className="link link-primary">Sign up</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
