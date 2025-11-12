
import { useState, useEffect } from 'react';
import { getPatientProfile, getPatientAppointments, updatePatientProfile, getAllDoctors, bookAppointment } from '../../api';

function Patientdashboard() {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctorsList, setDoctorsList] = useState([]);

  // Helpers for avatar
  const getInitials = (name) => {
    if (!name) return 'P';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const nameToColors = (name) => {
    // deterministic color pair based on name
    const hash = Array.from(name || 'patient').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const hue1 = (hash * 53) % 360;
    const hue2 = (hue1 + 40) % 360;
    const c1 = `hsl(${hue1} 75% 55%)`;
    const c2 = `hsl(${hue2} 70% 45%)`;
    return [c1, c2];
  };

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
        setAppointments(apptRes);
        const doctors = await getAllDoctors();
        setDoctorsList(doctors);
        // no booked slots initially
        setBookedSlots([]);
      } catch (err) {
        setError('Failed to fetch data.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fetch booked slots whenever doctor or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      setBookedSlots([]);
      if (!selectedDoctor || !appointmentDate) return;
      try {
        const doctor = doctorsList.find(d => d._id === selectedDoctor);
        if (!doctor) return;
        const date = appointmentDate; // YYYY-MM-DD
        // Placeholder: backend helper not implemented here, keep bookedSlots empty
        setBookedSlots([]);
      } catch (err) {
        console.warn('Failed to fetch booked slots', err);
      }
    };
    fetchSlots();
  }, [selectedDoctor, appointmentDate, doctorsList]);

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

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentDate || !appointmentTime) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const doctor = doctorsList.find((d) => d._id === selectedDoctor);
      const patientEmail = profile.email;
      // combine date and time into an ISO datetime string
      const dateTimeISO = new Date(`${appointmentDate}T${appointmentTime}`).toISOString();
      const newAppointment = await bookAppointment(token, doctor.email, dateTimeISO, patientEmail);
      setAppointments([newAppointment, ...appointments]);
      setSelectedDoctor('');
      setAppointmentDate('');
      setAppointmentTime('');
    } catch (err) {
      setError('Failed to book appointment.');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!</h1>
            <p className="mt-1 text-indigo-100">Manage your profile, appointments and find available doctors.</p>
          </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm">Next appointment</div>
                <div className="font-semibold">{appointments[0] ? new Date(appointments[0].appointmentDate).toLocaleString() : 'No upcoming'}</div>
              </div>
              <div>
                {(() => {
                  const initials = getInitials(profile?.name);
                  const [c1, c2] = nameToColors(profile?.name || 'patient');
                  return (
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}
                    >
                      {initials}
                    </div>
                  );
                })()}
              </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Profile & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              {(() => {
                const initials = getInitials(profile?.name);
                const [c1, c2] = nameToColors(profile?.name || 'patient');
                return (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}
                  >
                    {initials}
                  </div>
                );
              })()}
              <div>
                <div className="text-lg font-semibold">{profile?.name || 'Patient'}</div>
                <div className="text-sm text-gray-500">{profile?.email}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-400">Appointments</div>
                <div className="font-semibold text-lg">{appointments.length}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-400">Doctors</div>
                <div className="font-semibold text-lg">{doctorsList.length}</div>
              </div>
            </div>

            {/* Profile details or edit form */}
            {editing ? (
              <form className="mt-4 grid grid-cols-1 gap-3" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <label>
                  <span className="font-medium">Name:</span>
                  <input type="text" name="name" className="input input-bordered w-full mt-1" value={editProfile?.name || ''} onChange={handleProfileChange} required />
                </label>
                <label>
                  <span className="font-medium">Date of Birth:</span>
                  <input type="date" name="dob" className="input input-bordered w-full mt-1" value={editProfile?.dob ? new Date(editProfile.dob).toISOString().slice(0,10) : ''} onChange={handleProfileChange} />
                </label>
                <label>
                  <span className="font-medium">Gender:</span>
                  <select name="gender" className="select select-bordered w-full mt-1" value={editProfile?.gender || ''} onChange={handleProfileChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  <span className="font-medium">Medical History:</span>
                  <input type="text" name="medicalHistory" className="input input-bordered w-full mt-1" value={editProfile?.medicalHistory || ''} onChange={handleProfileChange} />
                </label>
                <label>
                  <span className="font-medium">Address:</span>
                  <input type="text" name="address" className="input input-bordered w-full mt-1" value={editProfile?.address || ''} onChange={handleProfileChange} />
                </label>
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="mt-4">
                <div className="text-sm"><span className="font-medium">Date of Birth:</span> {profile?.dob ? new Date(profile.dob).toLocaleDateString() : '—'}</div>
                <div className="text-sm"><span className="font-medium">Gender:</span> {profile?.gender || '—'}</div>
                <div className="text-sm"><span className="font-medium">Medical History:</span> {profile?.medicalHistory || '—'}</div>
                <div className="text-sm"><span className="font-medium">Address:</span> {profile?.address || '—'}</div>
                <div className="mt-3">
                  <button className="btn btn-outline btn-sm mr-2" onClick={handleEdit}>Edit Profile</button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions removed for cleaner UI */}
        </div>

        {/* Middle column: Booking */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Book an Appointment</h3>
          <form className="flex flex-col gap-3" onSubmit={handleBook}>
            <select className="select select-bordered" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
              <option value="">Select doctor</option>
              {doctorsList.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.name} — {doc.speciality}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input type="date" className="input input-bordered flex-1" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
              <select className="select select-bordered w-36" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required>
                <option value="">Time</option>
                {['09:00','10:00','11:00','12:00','16:00','17:00','18:00'].map(t => (
                  <option key={t} value={t} disabled={bookedSlots.includes(t)}>{t}{bookedSlots.includes(t) ? ' (booked)' : ''}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Confirm Booking</button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </form>
        </div>

        {/* Right column: Doctors list */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Available Doctors</h3>
          <div className="grid grid-cols-1 gap-3 max-h-64 md:max-h-96 overflow-y-auto pr-2">
            {doctorsList.map(doc => (
              <div key={doc._id} className="p-3 border rounded hover:shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{doc.name}</div>
                    <div className="text-sm text-gray-500">{doc.speciality}</div>
                    <div className="text-xs text-gray-400">{doc.email}</div>
                  </div>
                  <div>
                    <button className="btn btn-sm btn-outline" onClick={() => { setSelectedDoctor(doc._id); }}>Select</button>
                  </div>
                </div>
              </div>
            ))}
            {doctorsList.length === 0 && (
              <div className="text-gray-500">No doctors available right now.</div>
            )}
          </div>
        </div>
      </div>

      {/* Appointment history */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Appointment History</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments booked yet.</p>
        ) : (
          <div className="grid gap-3">
            {appointments.map(appt => {
              const dateObj = new Date(appt.appointmentDate);
              const formattedDate = dateObj.toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              return (
                <div key={appt._id} className="p-4 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{appt.doctorEmail}</div>
                    <div className="text-sm text-gray-500">{formattedDate}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${appt.status === 'booked' ? 'bg-green-500' : 'bg-red-500'}`}>{appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}</span>
                    <div className="text-xs text-gray-400">{new Date(appt.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Patientdashboard;

