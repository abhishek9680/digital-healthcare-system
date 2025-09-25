require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require('./config/db');


// Enable CORS for all origins (customize as needed)
app.use(cors());

// Middleware to handle JSON requests
app.use(express.json());

// Routers
const doctorRouter = require('./router/doctorRoute');
const patientRouter = require('./router/patientRoute');
// TODO: Add patientRouter when available

app.use(doctorRouter);
app.use(patientRouter);
// Start server only after DB connection
const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

startServer();
