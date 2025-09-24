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
