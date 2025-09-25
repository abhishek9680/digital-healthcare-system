import React, { useState } from 'react';
import { registerPatient, registerDoctor } from '../../api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
	const [role, setRole] = useState('doctor');
	const [form, setForm] = useState({ name: '', email: '', password: '' });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const navigate = useNavigate();

	const toggleRole = () => {
		setRole((prev) => (prev === 'doctor' ? 'patient' : 'doctor'));
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
			} else {
				await registerPatient(form);
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
				<h2 className="text-2xl font-bold mb-4 text-center">{role === 'doctor' ? 'Doctor' : 'Patient'} Registration</h2>
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
				<button
					className="btn btn-outline btn-secondary mt-4 w-full"
					onClick={toggleRole}
					type="button"
				>
					Switch to {role === 'doctor' ? 'Patient' : 'Doctor'} Registration
				</button>
				<div className="text-center mt-4">
					<span>Already have an account? </span>
					<a href="/login" className="link link-primary">Login</a>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage;
