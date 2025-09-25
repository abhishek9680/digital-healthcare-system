const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Book an appointment (by patient)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.body;
    const patientId = req.query.patientId;

    // Validate input
    if (!doctorId || !appointmentDate) {
      return res.status(400).json({ message: 'Doctor ID and appointment date are required' });
    }

    // Check if doctor exists
    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Optional: Check if patient exists
    const patientExists = await Patient.findById(patientId);
    if (!patientExists) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Optional: Check for overlapping appointments (same doctor & time)
    const isAlreadyBooked = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
    });
    if (isAlreadyBooked) {
      return res.status(409).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = new Appointment({
      doctorId,
      patientId,
      appointmentDate,
      status: 'booked',
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while booking appointment' });
  }
};
