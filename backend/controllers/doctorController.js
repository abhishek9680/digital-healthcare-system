const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor'); 
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');


// Register new doctor
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      speciality: "default" // default speciality if not provided
    });

    await doctor.save();
    // Do NOT issue token yet — doctor must be approved by an admin first.
    // Save returns doctor with `approved` defaulting to false per schema.
    res.status(201).json({
      message: 'Doctor registered successfully. Your account is pending admin approval.',
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        speciality: doctor.speciality || null,
        approved: doctor.approved
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Login doctor
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Ensure doctor has been approved by an admin before allowing login
    if (!doctor.approved) {
      return res.status(403).json({ message: 'Account pending admin approval' });
    }

    const token = jwt.sign({ doctorId: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update doctor profile (find by email in body, exclude email/password from update)
exports.updateDoctor = async (req, res) => {
  try {
    const { email, ...updates } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required to update doctor profile.' });
    }

    // Disallow updating email and password
    delete updates.email;
    delete updates.password;

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from response

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get all appointments for current doctor (by email)
exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    const doctorEmail = req.query.doctorEmail;
    if (!doctorEmail) {
      return res.status(400).json({ message: 'doctorEmail query parameter is required.' });
    }
    const appointments = await Appointment.find({ doctorEmail })
      .sort({ appointmentDate: -1 });
    res.status(200).json({
      message: 'Appointments fetched successfully',
      total: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
};



// Get all appointments with status 'booked'
exports.getBookedAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'booked' })
      .sort({ appointmentDate: -1 });
    res.status(200).json({
      message: 'Booked appointments fetched successfully',
      total: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching booked appointments' });
  }
};


// Accept and reject appointment (by doctor email)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const doctorEmail = req.body.doctorEmail; // should be provided in body
    const { appointmentId } = req.params;
    const { status } = req.body;

    // Validate status input
    if (!['booked', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "booked" or "rejected".' });
    }

    // Find appointment by id
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if logged-in doctor owns the appointment (by email)
    if (appointment.doctorEmail !== doctorEmail) {
      return res.status(403).json({ message: 'You are not authorized to update this appointment' });
    }

    // Update status
    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      message: `Appointment ${status} successfully`,
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating appointment status' });
  }
};


// Get all doctors (unprotected)
exports.getAllDoctors = async (req, res) => {
  try {
    // Only return doctors that have been approved by admin
    const doctors = await Doctor.find({ approved: true }).select('-password');
    res.status(200).json({
      message: 'Doctors fetched successfully',
      total: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching doctors' });
  }
};


exports.getProfile = async (req, res) => {
  const email = req.query.email;
  try {
    const doctor = await Doctor.findOne({email}).select('-password');

    res.status(200).json({
      message: 'Doctor profile fetched successfully',
      doctor,
     });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching doctor profile' });
  }
}

// Get approved patients for a doctor (patients who have at least one 'booked' appointment with this doctor)
exports.getApprovedPatients = async (req, res) => {
  try {
    const doctorEmail = req.query.doctorEmail;
    if (!doctorEmail) {
      return res.status(400).json({ message: 'doctorEmail query parameter is required.' });
    }

    // Find booked appointments for this doctor and extract unique patient emails
    const appointments = await Appointment.find({ doctorEmail, status: 'booked' }).select('patientEmail -_id');
    const patientEmails = [...new Set(appointments.map(a => a.patientEmail))];

    // Fetch patient records
    const patients = await Patient.find({ email: { $in: patientEmails } }).select('-password');

    res.status(200).json({ message: 'Approved patients fetched', total: patients.length, patients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching approved patients' });
  }
};