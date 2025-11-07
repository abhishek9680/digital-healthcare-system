import { useState, useEffect } from 'react';
import { 
    getAllDoctors, 
    getAllPatients, 
    deleteDoctor, 
    deletePatient,
    approveDoctor,
    rejectDoctor,
    getDoctorRegistrationRequests,
    getAdminStats 
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
    const [stats, setStats] = useState({ totalDoctors: 3, totalPatients: 3 });
    const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' or 'patients' or 'pending'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

            {/* Stats Section */}
            {stats && (
                <div className="stats shadow mb-8">
                    <div className="stat">
                        <div className="stat-title">Total Doctors</div>
                        <div className="stat-value">{stats.totalDoctors}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Total Patients</div>
                        <div className="stat-value">{stats.totalPatients}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Pending Approvals</div>
                        <div className="stat-value">{pendingDoctors.length}</div>
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
                    <div className="overflow-x-auto">
                        <table className="table w-full">
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
                                {doctors.map((doctor) => (
                                    <tr key={doctor._id}>
                                        <td>{doctor.name}</td>
                                        <td>{doctor.email}</td>
                                        <td>{doctor.speciality}</td>
                                        <td>{doctor.experience}</td>
                                        <td>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() => handleDeleteDoctor(doctor._id)}
                                            >
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
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient._id}>
                                        <td>{patient.name}</td>
                                        <td>{patient.email}</td>
                                        <td>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() => handleDeletePatient(patient._id)}
                                            >
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
                        <table className="table w-full">
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
                                        <td>{doctor.name}</td>
                                        <td>{doctor.email}</td>
                                        <td>{doctor.speciality}</td>
                                        <td>{doctor.experience}</td>
                                        <td className="flex gap-2">
                                            <button
                                                className="btn btn-success btn-xs"
                                                onClick={() => handleApproveDoctor(doctor._id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() => handleRejectDoctor(doctor._id)}
                                            >
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