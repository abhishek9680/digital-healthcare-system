// Update patient profile (find by email, exclude email/password from update)
exports.updatePatient = async (req, res) => {
  try {
    const { email, ...updates } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required to update patient profile." });
    }

    // Disallow updating email and password
    delete updates.email;
    delete updates.password;

    const updatedPatient = await Patient.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password from response

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Register new patient
exports.register = async (req, res) => {
  try {
    const { name, email, password, dob, gender, medicalHistory, address } =
      req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res
        .status(400)
        .json({ message: "Patient with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = new Patient({
      name,
      email,
      password: hashedPassword,
      dob: dob || null,
      gender: gender || null,
      medicalHistory: medicalHistory || "",
      address: address || "",
    });

    await patient.save();

    const token = jwt.sign({ patientId: patient._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Patient registered successfully",
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        dob: patient.dob,
        gender: patient.gender,
        medicalHistory: patient.medicalHistory,
        address: patient.address,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login patient
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ patientId: patient._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        dob: patient.dob,
        gender: patient.gender,
        medicalHistory: patient.medicalHistory,
        address: patient.address,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// Book an appointment (by patient, using emails)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorEmail, appointmentDate, patientEmail } = req.body;

    // Validate input
    if (!doctorEmail || !appointmentDate || !patientEmail) {
      return res
        .status(400)
        .json({
          message:
            "Doctor email, patient email, and appointment date are required",
        });
    }

    // Check if doctor exists
    const doctorExists = await Doctor.findOne({ email: doctorEmail });
    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if patient exists
    const patientExists = await Patient.findOne({ email: patientEmail });
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check for overlapping appointments (same doctor & time)
    const isAlreadyBooked = await Appointment.findOne({
      doctorEmail,
      appointmentDate: new Date(appointmentDate),
    });
    if (isAlreadyBooked) {
      return res
        .status(409)
        .json({ message: "This time slot is already booked" });
    }

    // Create appointment
    const appointment = new Appointment({
      doctorEmail,
      patientEmail,
      appointmentDate,
      status: "booked",
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while booking appointment" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const patientEmail = req.query.patientEmail;
    const patient = await Patient.findOne({email : patientEmail});
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }else{
      return res.status(200).json({ patient });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all appointments for a patient (by email, protected)
exports.getAppointmentsForPatient = async (req, res) => {
  try {
    const patientEmail = req.query.patientEmail;
    console.log("Fetching appointments for:", patientEmail);
    if (!patientEmail) {
      return res.status(400).json({ message: 'patientEmail query parameter is required.' });
    }
    const appointments = await Appointment.find({ patientEmail });
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
