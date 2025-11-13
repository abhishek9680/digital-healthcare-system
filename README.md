
git clone https://github.com/abhishek9680/digital-healthcare-system
## Digital Healthcare Management System

![Logo](frontend/public/logo.jpg)

A modern MERN stack application for managing healthcare appointments, with separate dashboards for patients, doctors and admins. Built with React, Node.js, Express, MongoDB, Tailwind CSS, and daisyUI.

---

## ✨ What’s new / Key features
- Patient and Doctor registration & login
- Secure JWT authentication
- Book, accept, and reject appointments
- Doctor, Patient and Admin dashboards
- Role-based navigation and protected routes
- Responsive UI with Tailwind CSS & daisyUI

New / updated functionality in this branch:
- Admin-managed doctor approvals: new doctor accounts are created in a pending state and require explicit admin approval before they can log in.
- Admin dashboard: review pending doctor registrations, approve or reject, delete doctor/patient accounts.
- Improved Patient dashboard UI: modern layout with gradient header, profile card, booking panel and scrollable doctors list.
- Deterministic generated avatars (initials + gradient) for users when no photo is present.

---

## 📁 Folder Structure (high level)

```
project-root/
│
├── backend/                # Express.js + MongoDB backend
│   ├── config/             # DB config
│   ├── controllers/        # Route controllers (doctor, patient, admin...)
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── router/             # Express routers
│   ├── .env                # Environment variables
│   └── index.js            # Backend entry point
│
├── frontend/               # React + Vite frontend
│   ├── public/             # Static assets (logo, images)
│   ├── src/
│   │   ├── api.js          # API utility functions
│   │   ├── components/     # Navbar, ProtectedRoute, etc.
│   │   ├── pages/          # Page components (dashboard, login, etc.)
│   │   ├── styles/         # Tailwind CSS
│   │   └── AppRoutes.jsx   # App routing
│   ├── index.html          # Main HTML
│   └── ...
│
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Atlas or local)
- pnpm (or npm)

### 1. Clone the repository
```bash
git clone https://github.com/abhishek9680/digital-healthcare-system
cd digital-healthcare-system
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env   # Create your .env file and set MONGO_URI, JWT_SECRET, PORT
pnpm install           # or npm install
pnpm start             # or npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
pnpm install           # or npm install
pnpm run dev           # Starts Vite dev server
```

### 4. Open in Browser
Visit http://localhost:5173 (or the port shown in terminal)

---

## ⚙️ Environment Variables

**Backend (.env):**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

---

## 🧭 Admin workflow (doctor verification)

- New doctor registrations are created with `approved: false` by default. Doctors will NOT receive an authentication token at registration and cannot log in until approved by an admin.
- Admin API (protected) to manage doctors:
	- GET  /api/admin/doctors           -> fetch all doctors (approved + pending)
	- GET  /api/admin/doctors/pending   -> fetch only pending doctor registrations
	- PUT  /api/admin/doctors/:id/approve -> approve a doctor (sets approved=true)
	- PUT  /api/admin/doctors/:id/reject  -> reject (delete) a doctor

Use the Admin Dashboard (when logged in as an admin) to review and approve/reject doctor registrations.

If you need to make existing doctor records usable immediately, either approve them via the admin UI/API or run a one-time DB migration to set `approved: true`.

---

## 🧩 Frontend notes & improvements

- Patient dashboard redesigned: responsive 3-column layout (profile, booking, doctors). The doctors panel is scrollable to avoid long pages when many doctors exist.
- Avatars are generated deterministically from user names (initials + gradient) when a profile photo is not available.
- Doctor registration now returns a "pending approval" message; doctor login will return 403 if account is not approved.
- Admin dashboard now has tabs for managing doctors, patients and pending approvals.

---

## 🧪 Quick API checks (examples)

You can test admin endpoints with curl (replace <ADMIN_TOKEN> and <DOCTOR_ID>):

```bash
# list pending doctors
curl -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:5000/api/admin/doctors/pending

# approve doctor
curl -X PUT -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:5000/api/admin/doctors/<DOCTOR_ID>/approve
```

---

## 🖥️ Main Pages & Routes
- `/` — Landing page
- `/login` — Login (patient/doctor/admin)
- `/register` — Register (patient/doctor/admin)
- `/doctor_dashboard` — Doctor dashboard
- `/patient_dashboard` — Patient dashboard
- `/admin/*` — Admin protected routes (dashboard and APIs)

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 💡 Credits
- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)


