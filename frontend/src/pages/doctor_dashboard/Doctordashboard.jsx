import { useState , useEffect} from "react";
import { getDoctorProfile, updateDoctorProfile, getDoctorAppointments, updateAppointmentStatus, getApprovedPatientsForDoctor, createPrescription, getPrescriptionsByDoctor } from '../../api';


const Doctordashboard = () => {
	const [appointments, setAppointments] = useState([]);
	const [approvedPatients, setApprovedPatients] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [profile, setProfile] = useState(null);
	const [editing, setEditing] = useState(false);
	const [editProfile, setEditProfile] = useState(null);

	const handleProfileChange = (e) => {
		setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
	};

	const handleEdit = () => {
		setEditProfile(profile);
		setEditing(true);
	};

	const handleSave = async () => {
		try {
			const token = localStorage.getItem('token');
			const updated = await updateDoctorProfile(token, {
				...editProfile,
				email: profile.email,
			});
			setProfile({
				name: updated.name,
				speciality: updated.speciality || updated.speciality,
				worksAt: updated.worksAt || '',
				experience: updated.experience || '',
				email: updated.email,
			});
			setEditing(false);
		} catch (err) {
			// Optionally show error to user
		}
	};

	const handleCancel = () => {
		setEditProfile(profile);
		setEditing(false);
	};

	// Fetch appointments and profile on mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem('token');
				// Fetch doctor profile
				const res = await getDoctorProfile(token);
				const doctor = res.data?.doctor || res.data;
				setProfile({
					name: doctor.name,
					speciality: doctor.speciality || doctor.speciality,
					worksAt: doctor.worksAt || '',
					experience: doctor.experience || '',
					email: doctor.email,
				});
				setEditProfile({
					name: doctor.name,
					speciality: doctor.speciality || doctor.speciality,
					worksAt: doctor.worksAt || '',
					experience: doctor.experience || '',
					email: doctor.email,
				});
				// Fetch appointments
				const appointmentsRes = await getDoctorAppointments(token);
				setAppointments(appointmentsRes);

				// Fetch prescriptions sent by this doctor
				try {
					const pres = await getPrescriptionsByDoctor(token);
					setSentPrescriptions(pres || []);
				} catch (err) {
					console.warn('Failed to fetch sent prescriptions', err);
				}

				// Fetch approved patients (patients with booked appointments)
				try {
					const patientsRes = await getApprovedPatientsForDoctor(token);
					setApprovedPatients(patientsRes || []);
				} catch (err) {
					// Non-fatal: show in UI if needed
					console.warn('Failed to fetch approved patients', err);
				}
			} catch (err) {
				// handle error
			}
		};
		fetchData();
	}, []);

	// Approve/Reject appointment
	const handleAction = async (id, action) => {
		try {
			const token = localStorage.getItem('token');
			await updateAppointmentStatus(token, id, action === 'accepted' ? 'booked' : 'rejected');
			// Refresh appointments
			const appointmentsRes = await getDoctorAppointments(token);
			setAppointments(appointmentsRes);
		} catch (err) {
			// handle error
		}
	};

	const pending = appointments.filter((a) => a.status === "pending");
	const scheduled = appointments.filter((a) => a.status === "booked");

	// Prescription modal state
	const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
	const [activeAppointment, setActiveAppointment] = useState(null);
	const [prescriptionForm, setPrescriptionForm] = useState({ medicines: [{ name: '', dosage: '', instructions: '' }], additionalNotes: '' });

	// Doctor's sent prescriptions
	const [sentPrescriptions, setSentPrescriptions] = useState([]);
	const [showSentPrescriptionModal, setShowSentPrescriptionModal] = useState(false);
	const [activeSentPrescription, setActiveSentPrescription] = useState(null);

	const openPrescriptionModal = (appointment) => {
		setActiveAppointment(appointment);
		setPrescriptionForm({ medicines: [{ name: '', dosage: '', instructions: '' }], additionalNotes: '' });
		setShowPrescriptionModal(true);
	};

	const closePrescriptionModal = () => {
		setShowPrescriptionModal(false);
		setActiveAppointment(null);
	};

	const addMedicineRow = () => {
		setPrescriptionForm(prev => ({ ...prev, medicines: [...prev.medicines, { name: '', dosage: '', instructions: '' }] }));
	};

	const removeMedicineRow = (index) => {
		setPrescriptionForm(prev => ({ ...prev, medicines: prev.medicines.filter((_, i) => i !== index) }));
	};

	const handleMedicineChange = (index, field, value) => {
		setPrescriptionForm(prev => {
			const meds = prev.medicines.map((m, i) => i === index ? { ...m, [field]: value } : m);
			return { ...prev, medicines: meds };
		});
	};

	const submitPrescription = async () => {
		if (!activeAppointment) return;
		try {
			const token = localStorage.getItem('token');
			const payload = {
				appointmentId: activeAppointment._id,
				medicines: prescriptionForm.medicines.filter(m => m.name.trim()),
				additionalNotes: prescriptionForm.additionalNotes,
			};
			await createPrescription(token, payload);
			// close and maybe refresh appointments or notify
			closePrescriptionModal();
			// optional: refresh appointments list
			const appointmentsRes = await getDoctorAppointments(localStorage.getItem('token'));
			setAppointments(appointmentsRes);
			
			// refresh sent prescriptions after creating one
			try {
				const pres = await getPrescriptionsByDoctor(localStorage.getItem('token'));
				setSentPrescriptions(pres || []);
			} catch (err) {
				console.warn('Failed to refresh sent prescriptions', err);
			}
		} catch (err) {
			console.error('Failed to create prescription', err);
			alert(err.message || 'Failed to create prescription');
		}
	};

	return (
		<>
		<div className="min-h-screen bg-base-200 py-8">
			<div className="max-w-6xl mx-auto px-4">
				<header className="mb-6">
					<div className="rounded-lg overflow-hidden shadow-lg">
						<div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 flex items-center justify-between text-white">
							<div className="flex items-center gap-4">
								<img src="/logo.jpg" alt="logo" onError={(e)=>{e.currentTarget.src='/doctor.jpg'}} className="w-12 h-12 rounded-md shadow-inner object-cover border-2 border-white/30" />
								<div>
									<h1 className="text-3xl font-extrabold tracking-tight">Doctor Dashboard</h1>
									<p className="text-sm opacity-90">Manage appointments, view approved patients and update your profile</p>
								</div>
							</div>
					{/* Quick Stats */}
					<div className="flex items-center gap-3">
						<div className="bg-white/90 text-gray-800 px-4 py-3 rounded-lg shadow backdrop-blur-sm">
							<div className="text-xs uppercase tracking-wide">Pending</div>
							<div className="text-2xl font-bold text-yellow-600">{pending.length}</div>
						</div>
						<div className="bg-white/90 text-gray-800 px-4 py-3 rounded-lg shadow backdrop-blur-sm">
							<div className="text-xs uppercase tracking-wide">Scheduled</div>
							<div className="text-2xl font-bold text-green-600">{scheduled.length}</div>
						</div>
						<div className="bg-white/90 text-gray-800 px-4 py-3 rounded-lg shadow backdrop-blur-sm">
							<div className="text-xs uppercase tracking-wide">Patients</div>
							<div className="text-2xl font-bold text-blue-600">{approvedPatients.length}</div>
						</div>
					</div>
					</div>
				</div>
			</header>

				{/* Main grid: Profile + lists */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Profile card */}
					<div className="col-span-1 bg-white rounded-lg shadow p-6">
						<div className="flex items-center gap-4">
							{/* Name-based avatar: generated gradient with initials when no profile photo */}
							{profile?.avatarUrl ? (
								<img src={profile.avatarUrl} alt="doctor avatar" onError={(e)=>{e.currentTarget.src='/logo.jpg'}} className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md" />
							) : (
								<div
									aria-label={profile?.name || 'Doctor avatar'}
									title={profile?.name || 'Doctor'}
									className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-md"
									style={{
										background: (() => {
											const name = profile?.name || 'Doctor';
											let hash = 0;
											for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
											const colors = [
												['#6EE7B7','#3B82F6'],
												['#FDE68A','#F97316'],
												['#A78BFA','#F472B6'],
												['#60A5FA','#34D399'],
												['#FCA5A5','#F59E0B'],
											];
											const pair = colors[Math.abs(hash) % colors.length];
											return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
										})(),
									}}
								>
									{(profile?.name || 'DR').split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}
								</div>
							)}
							<div>
								<h3 className="text-xl font-semibold">{profile?.name}</h3>
								<p className="text-sm text-gray-500">{profile?.email}</p>
								<p className="mt-2 text-sm"><span className="font-medium">Speciality:</span> {profile?.speciality || '-'}</p>
								<p className="text-sm"><span className="font-medium">Works At:</span> {profile?.worksAt || '-'}</p>
								<p className="text-sm"><span className="font-medium">Experience:</span> {profile?.experience || '-'}</p>
								<div className="mt-3">
									<button className="btn btn-sm btn-outline mr-2" onClick={handleEdit}>Edit</button>
								</div>
							</div>
						</div>
						{/* Edit form rendered inline */}
						{editing && (
							<div className="mt-4">
								<form onSubmit={e=>{e.preventDefault(); handleSave();}} className="space-y-3">
									<input name="name" value={editProfile?.name||''} onChange={handleProfileChange} className="input input-bordered w-full" placeholder="Full name" />
									<input name="speciality" value={editProfile?.speciality||''} onChange={handleProfileChange} className="input input-bordered w-full" placeholder="Speciality" />
									<input name="worksAt" value={editProfile?.worksAt||''} onChange={handleProfileChange} className="input input-bordered w-full" placeholder="Works At" />
									<input name="experience" value={editProfile?.experience||''} onChange={handleProfileChange} className="input input-bordered w-full" placeholder="Experience" />
									<div className="flex gap-2">
										<button className="btn btn-primary btn-sm" type="submit">Save</button>
										<button className="btn btn-ghost btn-sm" type="button" onClick={handleCancel}>Cancel</button>
									</div>
								</form>
							</div>
						)}
					</div>

					{/* Appointments list (spans 2 columns on large screens) */}
					<div className="col-span-1 lg:col-span-2 space-y-6">
						{/* Pending Requests */}
						<div className="bg-white rounded-lg shadow p-4">
							<div className="flex items-center justify-between mb-3">
								<h3 className="font-semibold">Appointment Requests</h3>
								<span className="text-sm text-gray-500">{pending.length} pending</span>
							</div>
							{pending.length === 0 ? (
								<div className="alert alert-info">No pending appointment requests.</div>
							) : (
								<table className="table table-zebra w-full">
									<thead>
										<tr>
											<th>Patient</th>
											<th>Date</th>
											<th>Time</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{pending.map((appt) => (
											<tr key={appt._id}>
												<td>{appt.patientEmail}</td>
												<td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
												<td>{new Date(appt.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
												<td className="flex gap-2">
													<button className="btn btn-success btn-xs flex items-center gap-1" onClick={() => handleAction(appt._id, 'accepted')}>
														<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
														</svg>
														<span>Accept</span>
													</button>
													<button className="btn btn-error btn-xs flex items-center gap-1" onClick={() => handleAction(appt._id, 'rejected')}>
														<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
														</svg>
														<span>Reject</span>
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>

						{/* Scheduled Appointments */}
						<div className="bg-white rounded-lg shadow p-4">
							<div className="flex items-center justify-between mb-3">
								<h3 className="font-semibold">Scheduled Appointments</h3>
								<span className="text-sm text-gray-500">{scheduled.length} scheduled</span>
							</div>
							{scheduled.length === 0 ? (
								<div className="alert alert-info">No scheduled appointments.</div>
							) : (
								<table className="table table-zebra w-full">
									<thead>
										<tr>
											<th>Patient</th>
											<th>Date</th>
											<th>Time</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{scheduled.map((appt) => (
											<tr key={appt._id}>
												<td>{appt.patientEmail}</td>
												<td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
												<td>{new Date(appt.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
												<td>
													<button className="btn btn-sm btn-outline" onClick={() => openPrescriptionModal(appt)}>Send Prescription</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>
				{/* Approved Patients card below grid */}
				<div className="mt-6 bg-white rounded-lg shadow p-4 col-span-3">
					<div className="flex items-center justify-between mb-3">
						<h3 className="font-semibold">Approved Patients</h3>
						<div className="w-full max-w-sm">
							<input type="text" placeholder="Search approved patients" className="input input-bordered w-full" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
						</div>
					</div>
					{approvedPatients.length === 0 ? (
						<div className="alert alert-info">No approved patients yet.</div>
					) : (
						<table className="table table-zebra w-full">
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									<th>DOB</th>
									<th>Gender</th>
									<th>Medical History</th>
								</tr>
							</thead>
							<tbody>
								{approvedPatients.filter(p => !searchQuery || (p.name||'').toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
									<tr key={p._id}>
										<td>{p.name}</td>
										<td>{p.email}</td>
										<td>{p.dob ? new Date(p.dob).toLocaleDateString() : '-'}</td>
										<td>{p.gender || '-'}</td>
										<td>{p.medicalHistory || '-'}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>

				{/* Sent Prescriptions */}
				<div className="bg-white rounded-lg shadow p-4 mt-6">
					<div className="flex items-center justify-between mb-3">
						<h3 className="font-semibold">Sent Prescriptions</h3>
						<span className="text-sm text-gray-500">{sentPrescriptions.length} total</span>
					</div>
					{sentPrescriptions.length === 0 ? (
						<div className="alert alert-info">No prescriptions sent yet.</div>
					) : (
						<table className="table table-zebra w-full">
							<thead>
								<tr>
									<th>Patient</th>
									<th>Date</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{sentPrescriptions.map(p => (
									<tr key={p._id}>
										<td>{p.patientEmail}</td>
										<td>{new Date(p.createdAt).toLocaleString()}</td>
										<td>
											<button className="btn btn-sm btn-outline" onClick={() => { setActiveSentPrescription(p); setShowSentPrescriptionModal(true); }}>View</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
			</div>

			{/* Prescription Modal */}
			{showPrescriptionModal && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
						<h3 className="text-lg font-semibold mb-3">Send Prescription</h3>
						<div className="mb-3 text-sm text-gray-600">Appointment: {activeAppointment?.patientEmail} — {new Date(activeAppointment?.appointmentDate).toLocaleString()}</div>
						<div className="space-y-3 max-h-72 overflow-y-auto">
							{prescriptionForm.medicines.map((m, idx) => (
								<div key={idx} className="grid grid-cols-12 gap-2 items-center">
									<input className="col-span-5 input input-bordered" placeholder="Medicine name" value={m.name} onChange={(e)=>handleMedicineChange(idx,'name', e.target.value)} />
									<input className="col-span-3 input input-bordered" placeholder="Dosage" value={m.dosage} onChange={(e)=>handleMedicineChange(idx,'dosage', e.target.value)} />
									<input className="col-span-3 input input-bordered" placeholder="Instructions" value={m.instructions} onChange={(e)=>handleMedicineChange(idx,'instructions', e.target.value)} />
									<div className="col-span-1">
										<button className="btn btn-sm btn-ghost" onClick={()=>removeMedicineRow(idx)}>✕</button>
									</div>
								</div>
							))}
						</div>
						<div className="mt-3">
							<button className="btn btn-outline btn-sm" onClick={addMedicineRow}>+ Add medicine</button>
						</div>
						<div className="mt-4">
							<label className="block">
								<span className="text-sm">Additional notes</span>
								<textarea className="textarea textarea-bordered w-full mt-1" rows={3} value={prescriptionForm.additionalNotes} onChange={(e)=>setPrescriptionForm(prev=>({...prev, additionalNotes: e.target.value}))} />
							</label>
						</div>
						<div className="mt-4 flex justify-end gap-2">
							<button className="btn btn-ghost" onClick={closePrescriptionModal}>Cancel</button>
							<button className="btn btn-primary" onClick={submitPrescription}>Send</button>
						</div>
					</div>
				</div>
			)}

				{/* Sent Prescription detail modal */}
				{showSentPrescriptionModal && activeSentPrescription && (
					<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
							<h3 className="text-lg font-semibold mb-2">Prescription sent to {activeSentPrescription.patientEmail}</h3>
							<div className="text-sm text-gray-500 mb-4">Date: {new Date(activeSentPrescription.createdAt).toLocaleString()}</div>
							<div className="space-y-3 max-h-72 overflow-y-auto">
								{activeSentPrescription.medicines.map((m, i) => (
									<div key={i} className="p-3 border rounded">
										<div className="font-semibold">{m.name}</div>
										<div className="text-sm">Dosage: {m.dosage || '—'}</div>
										<div className="text-sm">Instructions: {m.instructions || '—'}</div>
									</div>
								))}
							</div>
							<div className="mt-4">
								<div className="font-medium">Notes</div>
								<div className="text-sm text-gray-700">{activeSentPrescription.additionalNotes || '—'}</div>
							</div>
							<div className="mt-4 text-right">
								<button className="btn btn-ghost" onClick={() => { setShowSentPrescriptionModal(false); setActiveSentPrescription(null); }}>Close</button>
							</div>
						</div>
					</div>
				)}
			</>
		);
};

export default Doctordashboard;
