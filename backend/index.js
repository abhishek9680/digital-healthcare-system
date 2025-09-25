require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle JSON requests
app.use(express.json());


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
