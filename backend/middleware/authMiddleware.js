const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Set req.user and role based on payload
    if (decoded.doctorId) {
      req.user = { id: decoded.doctorId, role: 'doctor' };
    } else if (decoded.patientId) {
      req.user = { id: decoded.patientId, role: 'patient' };
    } else if (decoded.adminId) {
      req.user = { id: decoded.adminId, role: 'admin' };
    } else {
      return res.status(401).json({ message: 'Invalid token payload' });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
