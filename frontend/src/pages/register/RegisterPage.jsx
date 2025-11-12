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
			let res;
			if (role === 'doctor') {
				res = await registerDoctor(form);
			} else if (role === 'patient') {
				const payload = { ...form, gender: 'Not specified' };
				res = await registerPatient(payload);
			}
			//  else if (role === 'admin') {
			// 	// Register admin (ensure backend endpoint exists)
			// 	res = await registerAdmin(form);
			// }
			// Use backend-provided message if available (doctor may get pending-approval notice)
			setSuccess(res?.message || 'Registration successful! Please login.');
			// If registration was for doctor, keep on the page to show pending message but still navigate to login after a short delay
			setTimeout(() => navigate('/login'), 1800);
		} catch (err) {
			setError(err.message || 'Registration failed');
		}
		setLoading(false);
	};

	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
			{/* Left gradient panel */}
			<div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
				<img src="/logo.jpg" alt="logo" className="w-28 h-28 rounded-lg shadow-lg mb-6 object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
				<h2 className="text-3xl font-extrabold mb-2">Join our community</h2>
				<p className="text-sm opacity-90 max-w-sm text-center">Create your account to manage appointments, patient records and more. Doctors may require approval before the profile is active.</p>
				<div className="mt-8 w-full max-w-xs">
					<div className="bg-white/10 rounded-lg p-4">
						<div className="text-xs uppercase tracking-wider text-white/90">Secure & private</div>
						<div className="text-sm">We follow industry best practices to protect your data.</div>
					</div>
				</div>
			</div>

			{/* Right: registration form */}
			<div className="flex items-center justify-center p-8">
				<div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-2xl font-bold">{role.charAt(0).toUpperCase() + role.slice(1)} Registration</h3>
						<img src="/logo.jpg" alt="logo small" className="w-10 h-10 rounded-md object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
					</div>

					{/* Role tabs */}
					<div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
						{['doctor','patient'].map(r => (
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
							<span className="text-sm font-medium text-gray-700">Full name</span>
							<div className="relative mt-1">
								<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A12.072 12.072 0 0112 15c2.5 0 4.807.743 6.879 2.01" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								</span>
								<input name="name" value={form.name} onChange={handleChange} required className="input input-bordered w-full pl-10" placeholder="Your full name" />
							</div>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-gray-700">Email</span>
							<div className="relative mt-1">
								<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 10-8 0m8 0v5m0-5v-1a4 4 0 10-8 0v1" />
									</svg>
								</span>
								<input name="email" type="email" value={form.email} onChange={handleChange} required className="input input-bordered w-full pl-10" placeholder="you@domain.com" />
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
								<input name="password" type="password" value={form.password} onChange={handleChange} required className="input input-bordered w-full pl-10" placeholder="Choose a secure password" />
							</div>
						</label>

						{/* Optional patient-only fields: prefill gender as in original, but keep simple UI */}
						{/* {role === 'patient' && (
							<div className="grid grid-cols-2 gap-2">
								<select name="gender" value={form.gender || ''} onChange={handleChange} className="select select-bordered w-full">
									<option value="">Gender (optional)</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
								<input name="dob" type="date" value={form.dob || ''} onChange={handleChange} className="input input-bordered w-full" />
							</div>
						)} */}

						{/* <div className="flex items-center justify-between">
							<div className="text-sm">
								<input type="checkbox" className="checkbox mr-2" />
								<span>Accept terms</span>
							</div>
							<a href="#" className="text-sm link link-primary">Need help?</a>
						</div> */}

						{error && <div className="text-red-500 text-sm text-center">{error}</div>}
						{success && <div className="text-green-500 text-sm text-center">{success}</div>}

						<button type="submit" disabled={loading} className="btn btn-primary w-full flex items-center justify-center gap-2">
							{loading && (
								<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
								</svg>
							)}
							<span>{loading ? 'Registering...' : 'Register'}</span>
						</button>
					</form>

					<div className="text-center mt-4 text-sm">
						<span>Already have an account? </span>
						<a href="/login" className="link link-primary">Login</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage;
