import React, { useState } from 'react';

function LoginPage() {
  const [role, setRole] = useState('doctor');

  const toggleRole = () => {
    setRole((prev) => (prev === 'doctor' ? 'patient' : 'doctor'));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">{role === 'doctor' ? 'Doctor' : 'Patient'} Login</h2>
        {/* Example login form */}
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email"
            className="input input-bordered"
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered"
          />
          <button type="submit" className="btn btn-primary w-full">Login</button>
        </form>
        <button
          className="btn btn-outline btn-secondary mt-4 w-full"
          onClick={toggleRole}
          type="button"
        >
          Switch to {role === 'doctor' ? 'Patient' : 'Doctor'} Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
