import React, { useState } from "react";

// Mock data for demonstration
const mockAppointments = [
	{
		id: 1,
		patient: "John Doe",
		date: "2025-09-27",
		time: "10:00 AM",
		status: "pending",
		reason: "General Checkup",
	},
	{
		id: 2,
		patient: "Jane Smith",
		date: "2025-09-28",
		time: "2:30 PM",
		status: "pending",
		reason: "Consultation",
	},
	{
		id: 3,
		patient: "Bob Brown",
		date: "2025-09-29",
		time: "11:15 AM",
		status: "accepted",
		reason: "Follow-up",
	},
];


const Doctordashboard = () => {
	const [appointments, setAppointments] = useState(mockAppointments);
	// Dummy profile data

	const [profile, setProfile] = useState({
		name: 'Dr. Alice Smith',
		specialty: 'Cardiologist',
		worksAt: 'Springfield General Hospital',
		experience: '10 years',
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

	const handleAction = (id, action) => {
		setAppointments((prev) =>
			prev.map((appt) =>
				appt.id === id ? { ...appt, status: action } : appt
			)
		);
	};

	const pending = appointments.filter((a) => a.status === "pending");
	const scheduled = appointments.filter((a) => a.status === "accepted");

	return (
		<div className="min-h-screen bg-base-100 p-6">
			<h1 className="text-3xl font-bold mb-8 text-primary">Doctor Dashboard</h1>


						{/* Profile Section */}
						<div className="mb-10 bg-white p-6 rounded-lg shadow max-w-xl mx-auto">
							<h2 className="text-2xl font-semibold mb-4">Profile</h2>
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
										<span className="font-medium">Specialty:</span>
										<input
											type="text"
											name="specialty"
											className="input input-bordered w-full mt-1"
											value={editProfile.specialty}
											onChange={handleProfileChange}
											required
										/>
									</label>
									<label>
										<span className="font-medium">Works At:</span>
										<input
											type="text"
											name="worksAt"
											className="input input-bordered w-full mt-1"
											value={editProfile.worksAt}
											onChange={handleProfileChange}
											required
										/>
									</label>
									<label>
										<span className="font-medium">Experience:</span>
										<input
											type="text"
											name="experience"
											className="input input-bordered w-full mt-1"
											value={editProfile.experience}
											onChange={handleProfileChange}
											required
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
									<div><span className="font-medium">Specialty:</span> {profile.specialty}</div>
									<div><span className="font-medium">Works At:</span> {profile.worksAt}</div>
									<div><span className="font-medium">Experience:</span> {profile.experience}</div>
									<button className="btn btn-secondary mt-2 w-fit" onClick={handleEdit}>Edit</button>
								</div>
							)}
						</div>

			{/* Pending Appointments */}
			<div className="mb-10">
				<h2 className="text-2xl font-semibold mb-4">Appointment Requests</h2>
				{pending.length === 0 ? (
					<div className="alert alert-info">No pending appointment requests.</div>
				) : (
					<div className="overflow-x-auto">
						<table className="table w-full">
							<thead>
								<tr>
									<th>Patient</th>
									<th>Date</th>
									<th>Time</th>
									<th>Reason</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{pending.map((appt) => (
									<tr key={appt.id}>
										<td>{appt.patient}</td>
										<td>{appt.date}</td>
										<td>{appt.time}</td>
										<td>{appt.reason}</td>
										<td className="flex gap-2">
											<button
												className="btn btn-success btn-xs"
												onClick={() => handleAction(appt.id, "accepted")}
											>
												Accept
											</button>
											<button
												className="btn btn-error btn-xs"
												onClick={() => handleAction(appt.id, "rejected")}
											>
												Reject
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Scheduled Appointments */}
			<div>
				<h2 className="text-2xl font-semibold mb-4">Scheduled Appointments</h2>
				{scheduled.length === 0 ? (
					<div className="alert alert-info">No scheduled appointments.</div>
				) : (
					<div className="overflow-x-auto">
						<table className="table w-full">
							<thead>
								<tr>
									<th>Patient</th>
									<th>Date</th>
									<th>Time</th>
									<th>Reason</th>
								</tr>
							</thead>
							<tbody>
								{scheduled.map((appt) => (
									<tr key={appt.id}>
										<td>{appt.patient}</td>
										<td>{appt.date}</td>
										<td>{appt.time}</td>
										<td>{appt.reason}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default Doctordashboard;
