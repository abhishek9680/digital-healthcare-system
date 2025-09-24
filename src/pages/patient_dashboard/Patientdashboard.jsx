
import React, { useState } from 'react';

// Dummy data for doctors and appointments
const doctorsList = [
	{ id: 1, name: 'Dr. Abhishek Mehra', specialty: 'Cardiologist' },
	{ id: 2, name: 'Dr. Shubham Mishra', specialty: 'Dermatologist' },
	{ id: 3, name: 'Dr. Anurag Bhargav', specialty: 'Pediatrician' },
];


function Patientdashboard() {
	const [selectedDoctor, setSelectedDoctor] = useState('');
	const [appointmentDate, setAppointmentDate] = useState('');
	const [appointments, setAppointments] = useState([]);
	// Dummy profile data

	const [profile, setProfile] = useState({
		name: 'Santosh Kumar',
		dob: '1990-01-01',
		gender: 'Male',
		medicalHistory: 'Diabetes, Hypertension',
		address: '12-Sardarpura, Jodhpur',
	});
	const [editing, setEditing] = useState(false);
	const [editProfile, setEditProfile] = useState(profile);

	const handleProfileChange = (e) => {
		setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
	};

	const handleEdit = () => {
		setEditProfile(profile);
		setEditing(true);
	};

	const handleSave = () => {
		setProfile(editProfile);
		setEditing(false);
	};

	const handleCancel = () => {
		setEditProfile(profile);
		setEditing(false);
	};

	const handleBook = (e) => {
		e.preventDefault();
		if (!selectedDoctor || !appointmentDate) return;
		const doctor = doctorsList.find((d) => d.id === parseInt(selectedDoctor));
		setAppointments([
			...appointments,
			{
				id: Date.now(),
				doctor: doctor.name,
				specialty: doctor.specialty,
				date: appointmentDate,
			},
		]);
		setSelectedDoctor('');
		setAppointmentDate('');
	};

	return (
		<div className="p-6 max-w-3xl mx-auto">
			<h2 className="text-2xl font-bold mb-6">Patient Dashboard</h2>


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
											value={editProfile.name}
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
											value={editProfile.dob}
											onChange={handleProfileChange}
											required
										/>
									</label>
									<label>
										<span className="font-medium">Gender:</span>
										<select
											name="gender"
											className="select select-bordered w-full mt-1"
											value={editProfile.gender}
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
											value={editProfile.medicalHistory}
											onChange={handleProfileChange}
										/>
									</label>
									<label>
										<span className="font-medium">Address:</span>
										<input
											type="text"
											name="address"
											className="input input-bordered w-full mt-1"
											value={editProfile.address}
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
									<div><span className="font-medium">Name:</span> {profile.name}</div>
									<div><span className="font-medium">Date of Birth:</span> {profile.dob}</div>
									<div><span className="font-medium">Gender:</span> {profile.gender}</div>
									<div><span className="font-medium">Medical History:</span> {profile.medicalHistory}</div>
									<div><span className="font-medium">Address:</span> {profile.address}</div>
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
							<option key={doc.id} value={doc.id}>
								{doc.name} ({doc.specialty})
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
						<li key={doc.id} className="py-2 flex flex-col">
							<span className="font-medium">{doc.name}</span>
							<span className="text-sm text-gray-500">{doc.specialty}</span>
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
						{appointments.map((appt) => (
							<li key={appt.id} className="py-2">
								<span className="font-medium">{appt.doctor}</span> ({appt.specialty})<br />
								<span className="text-sm text-gray-500">Date: {appt.date}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

export default Patientdashboard;
