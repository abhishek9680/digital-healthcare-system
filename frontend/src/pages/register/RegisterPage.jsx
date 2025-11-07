import React, { useState } from 'react';
import { registerPatient, registerDoctor, registerAdmin } from '../../api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
	const [role, setRole] = useState('doctor');
	const [form, setForm] = useState({ name: '', email: '', password: '' });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const navigate = useNavigate();

	const handleRoleChange = (newRole) => {
		setRole(newRole);
		setError('');
		setSuccess('');
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');
		try {
			if (role === 'doctor') {
				await registerDoctor(form);
			} else if (role === 'patient') {
				const payload = { ...form, gender: 'Not specified' };
				await registerPatient(payload);
			} else if (role === 'admin') {
				// Register admin (ensure backend endpoint exists)
				await registerAdmin(form);
			}
			setSuccess('Registration successful! Please login.');
			setTimeout(() => navigate('/login'), 1500);
		} catch (err) {
			setError(err.message || 'Registration failed');
		}
		setLoading(false);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
				<h2 className="text-2xl font-bold mb-4 text-center">{role.charAt(0).toUpperCase() + role.slice(1)} Registration</h2>

				{/* Role selection tabs */}
				<div className="tabs tabs-boxed mb-4">
					<button className={`tab ${role === 'doctor' ? 'tab-active' : ''}`} onClick={() => handleRoleChange('doctor')}>Doctor</button>
					<button className={`tab ${role === 'patient' ? 'tab-active' : ''}`} onClick={() => handleRoleChange('patient')}>Patient</button>
					<button className={`tab ${role === 'admin' ? 'tab-active' : ''}`} onClick={() => handleRoleChange('admin')}>Admin</button>
				</div>

				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<input
						type="text"
						name="name"
						placeholder="Name"
						className="input input-bordered"
						value={form.name}
						onChange={handleChange}
						required
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						className="input input-bordered"
						value={form.email}
						onChange={handleChange}
						required
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						className="input input-bordered"
						value={form.password}
						onChange={handleChange}
						required
					/>
					<button type="submit" className="btn btn-primary w-full" disabled={loading}>
						{loading ? 'Registering...' : 'Register'}
					</button>
					{error && <div className="text-red-500 text-center text-sm">{error}</div>}
					{success && <div className="text-green-500 text-center text-sm">{success}</div>}
				</form>
				<div className="text-center mt-4">
					<span>Already have an account? </span>
					<a href="/login" className="link link-primary">Login</a>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage;
