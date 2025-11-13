import { useState, useEffect } from 'react';
import { 
    getAllDoctors, 
    getAllPatients, 
    deleteDoctor, 
    deletePatient,
    approveDoctor,
    rejectDoctor,
    getDoctorRegistrationRequests,
    getAdminStats,
    getAdminProfile,
    updateAdminProfile
} from '../../api';

const AdminDashboard = () => {
    // Temporary dummy data for local development / demo. Remove when backend is available.
    const [doctors, setDoctors] = useState([
        // { _id: 'd1', name: 'Dr. Vijay Kumar', email: 'vijay.kumar@example.com', speciality: 'Cardiology', experience: '10 years' },
        // { _id: 'd2', name: 'Dr. Priya Singh', email: 'priya.singh@example.com', speciality: 'Dermatology', experience: '7 years' },
        // { _id: 'd3', name: 'Dr. Rahul Mehta', email: 'rahul.mehta@example.com', speciality: 'Orthopedics', experience: '12 years' },
    ]);
    const [patients, setPatients] = useState([
        // { _id: 'p1', name: 'Asha Patel', email: 'asha.patel@example.com' },
        // { _id: 'p2', name: 'Rohan Sharma', email: 'rohan.sharma@example.com' },
        // { _id: 'p3', name: 'Sneha Kapoor', email: 'sneha.kapoor@example.com' },
    ]);
    const [pendingDoctors, setPendingDoctors] = useState([
        // { _id: 'pd1', name: 'Dr. New One', email: 'new.one@example.com', speciality: 'Pediatrics', experience: '2 years' },
    ]);
    const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, pending: 0 });
    // Read current logged-in admin info from localStorage (if available)
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    const [adminInfo, setAdminInfo] = useState(stored);
    const [editing, setEditing] = useState(false);
    const isAdmin = adminInfo?.role === 'admin';
    const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' or 'patients' or 'pending'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [doctorSearch, setDoctorSearch] = useState('');
    const [patientSearch, setPatientSearch] = useState('');

    // Avatar helpers for name-based gradient avatar
    const getInitials = (name) => {
        if (!name) return 'A';
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const nameToGradient = (name) => {
        const base = (name || 'admin').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
        const hue1 = (base * 37) % 360;
        const hue2 = (hue1 + 45) % 360;
        const c1 = `hsl(${hue1} 75% 50%)`;
        const c2 = `hsl(${hue2} 70% 40%)`;
        return `linear-gradient(135deg, ${c1}, ${c2})`;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const [doctorsData, patientsData, pendingDoctorsData, statsData] = await Promise.all([
                    getAllDoctors(),
                    getAllPatients(token),
                    getDoctorRegistrationRequests(token),
                    getAdminStats(token)
                ]);
                
                setDoctors(doctorsData);
                setPatients(patientsData);
                setPendingDoctors(pendingDoctorsData);
                setStats(statsData);

                // Fetch latest admin profile and sync to localStorage
                try {
                    if (token) {
                        const profile = await getAdminProfile(token);
                        if (profile) {
                            setAdminInfo(profile);
                            localStorage.setItem('user', JSON.stringify({ ...profile, role: 'admin' }));
                        }
                    }
                } catch (e) {
                    // ignore profile fetch errors - already handled by main catch
                    console.warn('Failed to fetch admin profile', e);
                }
            } catch (error) {
                setError(error.message || 'Error fetching data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDeleteDoctor = async (doctorId) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                await deleteDoctor(token, doctorId);
                const updatedDoctors = await getAllDoctors();
                setDoctors(updatedDoctors);
            } catch (error) {
                setError(error.message || 'Failed to delete doctor');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeletePatient = async (patientId) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                await deletePatient(token, patientId);
                const updatedPatients = await getAllPatients(token);
                setPatients(updatedPatients);
            } catch (error) {
                setError(error.message || 'Failed to delete patient');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleApproveDoctor = async (doctorId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await approveDoctor(token, doctorId);
            // Refresh both pending and approved doctors lists
            const [updatedPending, updatedDoctors] = await Promise.all([
                getDoctorRegistrationRequests(token),
                getAllDoctors()
            ]);
            setPendingDoctors(updatedPending);
            setDoctors(updatedDoctors);
        } catch (error) {
            setError(error.message || 'Failed to approve doctor');
        } finally {
            setLoading(false);
        }
    };

    const handleRejectDoctor = async (doctorId) => {
        if (window.confirm('Are you sure you want to reject this doctor?')) {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                await rejectDoctor(token, doctorId);
                const updatedPending = await getDoctorRegistrationRequests(token);
                setPendingDoctors(updatedPending);
            } catch (error) {
                setError(error.message || 'Failed to reject doctor');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-base-100 p-6">
            <h1 className="text-3xl font-bold mb-8 text-primary">Admin Dashboard</h1>

            {/* Admin Profile */}
            {isAdmin && (
                <div className="card bg-base-100 shadow mb-6 p-4">
                    <div className="flex items-start gap-4">
                        <div className="avatar">
                            {/* If an avatar URL is present, show the image; otherwise show initials */}
                            {adminInfo?.avatar ? (
                                <div className="w-16 h-16 rounded-full overflow-hidden">
                                    <img src={adminInfo.avatar} alt="Admin avatar" className="object-cover w-full h-full" />
                                </div>
                            ) : (
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-extrabold select-none uppercase"
                                    style={{
                                        background: nameToGradient(adminInfo?.name || adminInfo?.email || 'Admin'),
                                        boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                                        lineHeight: '4rem',
                                        textAlign: 'center',
                                        fontSize: '20px',
                                        padding: 0,
                                    }}
                                    title={adminInfo?.name || adminInfo?.email || 'Admin'}
                                >
                                    {String(getInitials(adminInfo?.name || adminInfo?.email || '')).slice(0,2)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            {!editing ? (
                                <>
                                    <div className="text-lg font-semibold">{adminInfo?.name || adminInfo?.email || 'Admin'}</div>
                                    <div className="text-sm text-gray-500">{adminInfo?.email || 'No email provided'}</div>
                                    <div className="text-sm mt-2">Role: {adminInfo?.role || 'admin'}</div>
                                    {/* <div className="text-sm">Designation: {adminInfo?.designation || 'Not provided'}</div> */}
                                    <div className="text-sm">Gender: {adminInfo?.gender || 'Not provided'}</div>
                                    <div className="text-sm">DOB: {adminInfo?.dob || 'Not provided'}</div>
                                    <div className="text-sm">Contact: {adminInfo?.contact || 'Not provided'}</div>
                                    <div className="mt-3">
                                        <button className="btn btn-sm btn-primary mr-2" onClick={() => setEditing(true)}>Edit</button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <input className="input input-bordered" value={adminInfo?.name || ''} onChange={(e) => setAdminInfo(prev => ({ ...prev, name: e.target.value }))} placeholder="Full name" />
                                        <input className="input input-bordered" value={adminInfo?.email || ''} onChange={(e) => setAdminInfo(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* <input className="input input-bordered" value={adminInfo?.designation || ''} onChange={(e) => setAdminInfo(prev => ({ ...prev, designation: e.target.value }))} placeholder="Designation" /> */}
                                        <input className="input input-bordered" value={adminInfo?.contact || ''} onChange={(e) => setAdminInfo(prev => ({ ...prev, contact: e.target.value }))} placeholder="Contact number" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <select className="select select-bordered" value={adminInfo?.gender || ''} onChange={(e) => setAdminInfo(prev => ({ ...prev, gender: e.target.value }))}>
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <input type="date" className="input input-bordered" value={adminInfo?.dob || ''} onChange={(e) => setAdminInfo(prev => ({ ...prev, dob: e.target.value }))} />
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button className="btn btn-sm btn-success" onClick={async () => {
                                            setLoading(true);
                                            setError('');
                                            try {
                                                const token = localStorage.getItem('token');
                                                const updated = await updateAdminProfile(token, adminInfo);
                                                setAdminInfo(updated);
                                                localStorage.setItem('user', JSON.stringify({ ...updated, role: 'admin' }));
                                                setEditing(false);
                                            } catch (err) {
                                                setError(err.message || 'Failed to update profile');
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}>Save</button>
                                        <button className="btn btn-sm btn-ghost" onClick={() => {
                                            // revert changes from localStorage
                                            const original = JSON.parse(localStorage.getItem('user') || 'null');
                                            setAdminInfo(original);
                                            setEditing(false);
                                        }}>Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Section */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-lg shadow bg-gradient-to-r from-indigo-500 to-indigo-400 text-white">
                        <div className="text-sm uppercase opacity-90">Total Doctors</div>
                        <div className="text-2xl font-bold mt-1">{Math.max(0, (stats.totalDoctors || 0) - (stats.pending ?? pendingDoctors.length))}</div>
                        <div className="text-xs opacity-80 mt-1">Approved</div>
                    </div>
                    <div className="p-4 rounded-lg shadow bg-gradient-to-r from-emerald-500 to-emerald-400 text-white">
                        <div className="text-sm uppercase opacity-90">Total Patients</div>
                        <div className="text-2xl font-bold mt-1">{stats.totalPatients}</div>
                        <div className="text-xs opacity-80 mt-1">Active</div>
                    </div>
                    <div className="p-4 rounded-lg shadow bg-gradient-to-r from-yellow-400 to-yellow-300 text-white">
                        <div className="text-sm uppercase opacity-90">Pending Approvals</div>
                        <div className="text-2xl font-bold mt-1">{stats.pending ?? pendingDoctors.length}</div>
                        <div className="text-xs opacity-80 mt-1">Needs review</div>
                    </div>
                </div>
            )}

            {/* Error Alert */}
            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="flex justify-center mb-4">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="tabs tabs-boxed mb-6">
                <button 
                    className={`tab ${activeTab === 'doctors' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('doctors')}
                >
                    Manage Doctors
                </button>
                <button 
                    className={`tab ${activeTab === 'patients' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('patients')}
                >
                    Manage Patients
                </button>
                <button 
                    className={`tab ${activeTab === 'pending' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending Approvals
                    {pendingDoctors.length > 0 && (
                        <span className="badge badge-secondary ml-2">{pendingDoctors.length}</span>
                    )}
                </button>
            </div>

            {/* Doctors Section */}
            {activeTab === 'doctors' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Doctors List</h2>
                    <div className="mb-3 flex items-center gap-3">
                        <input type="text" placeholder="Search doctors by name or email" className="input input-bordered flex-1" value={doctorSearch} onChange={(e)=>setDoctorSearch(e.target.value)} />
                        <button className="btn btn-ghost" onClick={() => setDoctorSearch('')}>Clear</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table table-compact w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Speciality</th>
                                    <th>Experience</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.filter(d => !doctorSearch || (d.name||'').toLowerCase().includes(doctorSearch.toLowerCase()) || (d.email||'').toLowerCase().includes(doctorSearch.toLowerCase())).map((doctor) => (
                                    <tr key={doctor._id}>
                                        <td className="font-medium">{doctor.name}</td>
                                        <td className="text-sm text-gray-600">{doctor.email}</td>
                                        <td className="text-sm">{doctor.speciality}</td>
                                        <td className="text-sm">{doctor.experience}</td>
                                        <td>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() => handleDeleteDoctor(doctor._id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Patients Section */}
            {activeTab === 'patients' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Patients List</h2>
                    <div className="mb-3 flex items-center gap-3">
                        <input type="text" placeholder="Search patients by name or email" className="input input-bordered flex-1" value={patientSearch} onChange={(e)=>setPatientSearch(e.target.value)} />
                        <button className="btn btn-ghost" onClick={() => setPatientSearch('')}>Clear</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table table-compact w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.filter(p => !patientSearch || (p.name||'').toLowerCase().includes(patientSearch.toLowerCase()) || (p.email||'').toLowerCase().includes(patientSearch.toLowerCase())).map((patient) => (
                                    <tr key={patient._id}>
                                        <td className="font-medium">{patient.name}</td>
                                        <td className="text-sm text-gray-600">{patient.email}</td>
                                        <td>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() => handleDeletePatient(patient._id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pending Approvals Section */}
            {activeTab === 'pending' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Pending Doctor Approvals</h2>
                    <div className="overflow-x-auto">
                        <table className="table table-compact w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Speciality</th>
                                    <th>Experience</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingDoctors.map((doctor) => (
                                    <tr key={doctor._id}>
                                        <td className="font-medium">{doctor.name}</td>
                                        <td className="text-sm text-gray-600">{doctor.email}</td>
                                        <td className="text-sm">{doctor.speciality}</td>
                                        <td className="text-sm">{doctor.experience}</td>
                                        <td className="flex gap-2">
                                            <button
                                                className="btn btn-success btn-xs flex items-center gap-1"
                                                onClick={() => handleApproveDoctor(doctor._id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-error btn-xs flex items-center gap-1"
                                                onClick={() => handleRejectDoctor(doctor._id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {pendingDoctors.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                No pending approvals
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;