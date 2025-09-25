const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor'); 
const Appointment = require('../models/Appointment');


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
    });

    await doctor.save();

    const token = jwt.sign({ doctorId: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Doctor registered successfully',
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

// Update doctor profile (excluding email and password)
exports.updateDoctor = async (req, res) => {
  try {
    const doctorId = req.query.doctorId;
    const updates = { ...req.body };

    // Disallow updating email and password
    delete updates.email;
    delete updates.password;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
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


// Get all patients who booked with current doctor
exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    const doctorId = req.query.doctorId;

    const appointments = await Appointment.find({ doctorId })
      .populate('patientId', 'name email dob gender medicalHistory address') // get patient details
      .sort({ appointmentDate: -1 }); // optional: latest first

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
      .populate('doctorId', 'name email specialty')
      .populate('patientId', 'name email age gender')
      .sort({ appointmentDate: -1 }); // Optional: sort latest first

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

// accecpt and reject appointment
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const doctorId = req.doctorId; // from authMiddleware
    const { appointmentId } = req.params;
    const { status } = req.body;

    // Validate status input
    if (!['booked', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "accepted" or "rejected".' });
    }

    // Find appointment by id
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if logged-in doctor owns the appointment
    if (appointment.doctorId.toString() !== doctorId) {
      return res.status(403).json({ message: 'You are not authorized to update this appointment' });
    }

    // Update status
    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating appointment status' });
  }
};