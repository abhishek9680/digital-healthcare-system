
import  { useState, useEffect } from 'react';
import { getPatientProfile, getPatientAppointments, updatePatientProfile,getAllDoctors } from '../../api';




function Patientdashboard() {
	const [selectedDoctor, setSelectedDoctor] = useState('');
	const [appointmentDate, setAppointmentDate] = useState('');
	const [appointments, setAppointments] = useState([]);
	const [profile, setProfile] = useState(null);
	const [editing, setEditing] = useState(false);
	const [editProfile, setEditProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [doctorsList, setDoctorsList] = useState([]);

	// Fetch patient profile and appointments on mount
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError('');
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					setError('User not authenticated.');
					setLoading(false);
					return;
				}
				// Fetch profile
				const profileRes = await getPatientProfile(token);
				setProfile(profileRes);
				setEditProfile(profileRes);
				// Fetch appointments
				const apptRes = await getPatientAppointments(token);
				console.log("Appointments fetched:", apptRes);
				setAppointments(apptRes);
				const doctors = await getAllDoctors();
				setDoctorsList(doctors);
			} catch (err) {
				setError('Failed to fetch data.');
			}
			setLoading(false);
		};
		fetchData();
	}, []);

		const handleProfileChange = (e) => {
			setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
		};

		const handleEdit = () => {
			setEditProfile(profile);
			setEditing(true);
		};

		// Implement profile update API call
		const handleSave = async () => {
			setLoading(true);
			setError('');
			try {
				const token = localStorage.getItem('token');
				const updated = await updatePatientProfile(token, { ...editProfile, email: profile.email });
				setProfile(updated);
				setEditProfile(updated);
				setEditing(false);
			} catch (err) {
				setError('Failed to update profile.');
			}
			setLoading(false);
		};

	const handleCancel = () => {
		setEditProfile(profile);
		setEditing(false);
	};

	const handleBook = (e) => {
		e.preventDefault();
		if (!selectedDoctor || !appointmentDate) return;
		const doctor = doctorsList.find((d) => d._id === selectedDoctor);
		setAppointments([
			...appointments,
			{
				id: Date.now(),
				doctorEmail: doctor.email,
				specialty: doctor.speciality,
				date: appointmentDate,
			},
		]);
		setSelectedDoctor('');
		setAppointmentDate('');
	};

		return (
			<div className="p-6 max-w-3xl mx-auto">
				<h2 className="text-2xl font-bold mb-6">Patient Dashboard</h2>
				{loading ? (
					<p>Loading...</p>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : (
					<>
						{/* Profile Section */}
						<div className="mb-8 bg-base-100 p-6 rounded-lg shadow">
							<h3 className="text-xl font-semibold mb-4">Profile</h3>
							{editing ? (
								<form className="grid grid-cols-1 gap-3 mb-2" onSubmit={e => { e.preventDefault(); handleSave(); }}>
									<label>
										<span className="font-medium">Name:</span>
										<input
											type="text"
											name="name"
											className="input input-bordered w-full mt-1"
											value={editProfile?.name || ''}
											onChange={handleProfileChange}
											required
										/>
									</label>
									<label>
										<span className="font-medium">Date of Birth:</span>
										<input
											type="date"
											name="dob"
											className="input input-bordered w-full mt-1"
											value={editProfile?.dob ? new Date(editProfile.dob).toISOString().slice(0, 10) : ''}
											onChange={handleProfileChange}
											required
										/>
									</label>
									<label>
										<span className="font-medium">Gender:</span>
										<select
											name="gender"
											className="select select-bordered w-full mt-1"
											value={editProfile?.gender || ''}
											onChange={handleProfileChange}
											required
										>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
											<option value="Other">Other</option>
										</select>
									</label>
									<label>
										<span className="font-medium">Medical History:</span>
										<input
											type="text"
											name="medicalHistory"
											className="input input-bordered w-full mt-1"
											value={editProfile?.medicalHistory || ''}
											onChange={handleProfileChange}
										/>
									</label>
									<label>
										<span className="font-medium">Address:</span>
										<input
											type="text"
											name="address"
											className="input input-bordered w-full mt-1"
											value={editProfile?.address || ''}
											onChange={handleProfileChange}
										/>
									</label>
									<div className="flex gap-2 mt-2">
										<button type="submit" className="btn btn-primary">Save</button>
										<button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
									</div>
								</form>
							) : (
								<div className="grid grid-cols-1 gap-2">
									<div><span className="font-medium">Name:</span> {profile?.name}</div>
									<div><span className="font-medium">Date of Birth:</span> {profile?.dob}</div>
									<div><span className="font-medium">Gender:</span> {profile?.gender}</div>
									<div><span className="font-medium">Medical History:</span> {profile?.medicalHistory}</div>
									<div><span className="font-medium">Address:</span> {profile?.address}</div>
									<button className="btn btn-secondary mt-2 w-fit" onClick={handleEdit}>Edit</button>
								</div>
							)}
						</div>

						{/* Book Appointment */}
						<div className="mb-8 bg-base-100 p-6 rounded-lg shadow">
							<h3 className="text-xl font-semibold mb-4">Book Appointment</h3>
							<form className="flex flex-col gap-4" onSubmit={handleBook}>
								<select
									className="select select-bordered"
									value={selectedDoctor}
									onChange={(e) => setSelectedDoctor(e.target.value)}
									required
								>
									<option value="" disabled>Select Doctor</option>
									{doctorsList.map((doc) => (
										<option key={doc._id} value={doc._id}>
											{doc.name} ({doc.speciality})
										</option>
									))}
								</select>
								<input
									type="date"
									className="input input-bordered"
									value={appointmentDate}
									onChange={(e) => setAppointmentDate(e.target.value)}
									required
								/>
								<button type="submit" className="btn btn-primary">Book Appointment</button>
							</form>
						</div>

						{/* List of Doctors */}
						<div className="mb-8 bg-base-100 p-6 rounded-lg shadow">
							<h3 className="text-xl font-semibold mb-4">Available Doctors</h3>
							<ul className="divide-y">
								{doctorsList.map((doc) => (
									<li key={doc._id} className="py-2 flex flex-col">
										<span className="font-medium">{doc.name}</span>
										<span className="text-sm text-gray-500">Email :{doc.email}</span>
										<span className="text-sm text-gray-500">Speciality :{doc.speciality}</span>
									</li>
								))}
							</ul>
						</div>

						{/* Appointment History */}
						<div className="bg-base-100 p-6 rounded-lg shadow">
							<h3 className="text-xl font-semibold mb-4">Appointment History</h3>
							{appointments.length === 0 ? (
								<p className="text-gray-500">No appointments booked yet.</p>
							) : (
								<ul className="divide-y">
									{appointments.map((appt) => {
										const dateObj = new Date(appt.appointmentDate);
										const formattedDate = dateObj.toLocaleString('en-IN', {
											year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
										});
										return (
											<li key={appt._id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
												<div>
													<div className="font-medium text-lg">Doctor: <span className="text-blue-700">{appt.doctorEmail}</span></div>
													<div className="text-sm text-gray-500">Date: {formattedDate}</div>
													<div className="text-sm text-gray-500">Booked by: {appt.patientEmail}</div>
												</div>
												<div className="mt-2 md:mt-0 flex items-center gap-2">
													<span className={`badge px-3 py-1 rounded-full text-white ${appt.status === 'booked' ? 'bg-green-500' : 'bg-red-500'}`}>{appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}</span>
													<span className="text-xs text-gray-400">Created: {new Date(appt.createdAt).toLocaleDateString()}</span>
													{appt.updatedAt && <span className="text-xs text-gray-400">Updated: {new Date(appt.updatedAt).toLocaleDateString()}</span>}
												</div>
											</li>
										);
									})}
								</ul>
							)}
						</div>
					</>
				)}
			</div>
		);
}

export default Patientdashboard;
