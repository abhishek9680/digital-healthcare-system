
import React, { useState } from 'react';

// Dummy data for doctors and appointments
const doctorsList = [
	{ id: 1, name: 'Dr. Alice Smith', specialty: 'Cardiologist' },
	{ id: 2, name: 'Dr. Bob Johnson', specialty: 'Dermatologist' },
	{ id: 3, name: 'Dr. Carol Lee', specialty: 'Pediatrician' },
];

function Patientdashboard() {
	const [selectedDoctor, setSelectedDoctor] = useState('');
	const [appointmentDate, setAppointmentDate] = useState('');
	const [appointments, setAppointments] = useState([]);

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
