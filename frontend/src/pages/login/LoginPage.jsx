import React, { useState } from 'react';
import { loginPatient, loginDoctor, loginAdmin } from '../../api';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [role, setRole] = useState('doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
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
      } else if (role === 'patient') {
        data = await loginPatient(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.patient));
        navigate('/patient-dashboard');
      } else if (role === 'admin') {
        data = await loginAdmin(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ ...data.admin, role: 'admin' }));
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {role.charAt(0).toUpperCase() + role.slice(1)} Login
        </h2>
        
        {/* Role Selection Tabs */}
        <div className="tabs tabs-boxed mb-4">
          <button
            className={`tab ${role === 'doctor' ? 'tab-active' : ''}`}
            onClick={() => handleRoleChange('doctor')}
          >
            Doctor
          </button>
          <button
            className={`tab ${role === 'patient' ? 'tab-active' : ''}`}
            onClick={() => handleRoleChange('patient')}
          >
            Patient
          </button>
          <button
            className={`tab ${role === 'admin' ? 'tab-active' : ''}`}
            onClick={() => handleRoleChange('admin')}
          >
            Admin
          </button>
        </div>

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

        {/* Only show registration link for doctors and patients */}
        {role !== 'admin' && (
          <div className="text-center mt-4">
            <span>New? </span>
            <a href={`/register?role=${role}`} className="link link-primary">Sign up</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
