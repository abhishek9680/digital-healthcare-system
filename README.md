
# Digital Healthcare Management System

![Logo](frontend/public/logo.jpg)

A modern MERN stack application for managing healthcare appointments, with separate dashboards for patients and doctors. Built with React, Node.js, Express, MongoDB, Tailwind CSS, and daisyUI.

---

## ✨ Features
- Patient and Doctor registration & login
- Secure JWT authentication
- Book, accept, and reject appointments
- Doctor and Patient dashboards
- Responsive UI with Tailwind CSS & daisyUI
- Role-based navigation and protected routes

---

## 📁 Folder Structure

```
project-root/
│
├── backend/                # Express.js + MongoDB backend
│   ├── config/             # DB config
│   ├── controllers/        # Route controllers (doctor, patient)
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
- MongoDB (Atlas)
- pnpm (npm)
- React.js
### 1. Clone the repository
```sh
# Using HTTPS
git clone https://github.com/abhishek9680/digital-healthcare-system
cd digital-healthcare-system
```

### 2. Setup Backend
```sh
cd backend
cp .env.example .env   # Create your .env file and set MONGO_URI, JWT_SECRET, PORT
pnpm install           # or npm install
pnpm start             # or npm run dev
```

### 3. Setup Frontend
```sh
cd ../frontend
pnpm install           # or npm install
pnpm run dev           # Starts Vite dev server
```

### 4. Open in Browser
Visit [http://localhost:5173](http://localhost:5173) (or the port shown in terminal)

---

## ⚙️ Environment Variables

**Backend (.env):**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

---

## 🖥️ Main Pages & Routes
- `/` — Landing page
- `/login` — Login (patient/doctor)
- `/register` — Register (patient/doctor)
- `/doctor_dashboard` — Doctor dashboard
- `/patient_dashboard` — Patient dashboard

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.



## 💡 Credits
- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
