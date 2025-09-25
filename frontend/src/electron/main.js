const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const connectDB = require('../../server/db');

// Connect to MongoDB
connectDB();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadURL('http://localhost:5173'); // Vite dev server
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


// Patient profile IPC handlers
const patientController = require('../../server/controllers/patientController');

// Get patient by email
ipcMain.handle('patient:get', async (event, email) => {
  try {
    const patient = await patientController.getPatientByEmail(email);
    return { success: true, data: patient };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Create new patient
ipcMain.handle('patient:create', async (event, data) => {
  try {
    const patient = await patientController.createPatient(data);
    return { success: true, data: patient };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Update patient by email
ipcMain.handle('patient:update', async (event, email, update) => {
  try {
    const patient = await patientController.updatePatientByEmail(email, update);
    return { success: true, data: patient };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
