
import React, { useState } from 'react';

function RegisterPage() {
	const [role, setRole] = useState('doctor');
	const [form, setForm] = useState({ name: '', email: '', password: '' });

	const toggleRole = () => {
		setRole((prev) => (prev === 'doctor' ? 'patient' : 'doctor'));
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle registration logic here
		alert(`Registered as ${role}: ${form.name}, ${form.email}`);
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
					<button type="submit" className="btn btn-primary w-full">Register</button>
				</form>
				<button
					className="btn btn-outline btn-secondary mt-4 w-full"
					onClick={toggleRole}
					type="button"
				>
					Switch to {role === 'doctor' ? 'Patient' : 'Doctor'} Registration
				</button>
			</div>
		</div>
	);
}

export default RegisterPage;
