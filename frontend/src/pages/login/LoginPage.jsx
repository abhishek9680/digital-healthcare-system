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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: marketing / logo */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <img src="/logo.jpg" alt="App logo" className="w-28 h-28 rounded-lg shadow-lg mb-6 object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
        <h2 className="text-3xl font-extrabold mb-2">Welcome back</h2>
        <p className="text-sm opacity-90 max-w-sm text-center">Sign in to access your dashboard — manage appointments, patients and profile all in one place.</p>
        <div className="mt-8 w-full max-w-xs">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-xs uppercase tracking-wider text-white/90">Secure</div>
            <div className="text-sm">Your data is protected with industry standard practices.</div>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">{role.charAt(0).toUpperCase() + role.slice(1)} Login</h3>
            <img src="/logo.jpg" alt="logo small" className="w-10 h-10 rounded-md object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
          </div>

          {/* Role tabs */}
          <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
            {['doctor','patient','admin'].map(r => (
              <button key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                className={`flex-1 py-2 rounded-md text-sm font-medium ${role===r ? 'bg-white shadow' : 'text-gray-600'}`}>
                {r.charAt(0).toUpperCase()+r.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 10-8 0m8 0v5m0-5v-1a4 4 0 10-8 0v1" />
                  </svg>
                </span>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="input input-bordered w-full pl-10" placeholder="you@hospital.com" />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3v1H9v-1c0-1.657 1.343-3 3-3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
                  </svg>
                </span>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="input input-bordered w-full pl-10" placeholder="Your password" />
              </div>
            </label>
            
            {/* forget password and remember me */}
            {/* <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-sm link link-primary">Forgot password?</a>
            </div> */}

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button type="submit" disabled={loading} className="btn btn-primary w-full flex items-center justify-center gap-2">
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              )}
              <span>{loading ? 'Logging in...' : 'Login'}</span>
            </button>
          </form>

          <div className="text-center mt-4 text-sm">
            <span>New here? </span>
            <a href={`/register?role=${role}`} className="link link-primary">Create an account</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
