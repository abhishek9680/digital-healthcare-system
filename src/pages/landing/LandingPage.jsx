import Navbar from '../../components/Navbar'

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Hero Section */}
      <section className="hero py-12 bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10">
          <img
            src="https://picsum.photos/400/300"
            className="max-w-sm rounded-lg shadow-2xl"
            alt="Healthcare Illustration"
          />
          <div>
            <h1 className="text-5xl font-bold text-primary mb-4">Digital Healthcare Management System</h1>
            <p className="py-4 text-lg text-base-content">
              Seamlessly schedule, view, and manage your healthcare appointments. Empowering patients and doctors with a secure, easy-to-use platform.
            </p>
            <a href="/register" className="btn btn-primary btn-lg mt-4">Book an Appointment</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-base-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body items-center text-center">
                <span className="text-4xl">📅</span>
                <h3 className="card-title mt-2">Easy Appointment Scheduling</h3>
                <p>Book appointments with just a few clicks and manage your schedule effortlessly.</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-md">
              <div className="card-body items-center text-center">
                <span className="text-4xl">👨‍⚕️</span>
                <h3 className="card-title mt-2">View & Manage Appointments</h3>
                <p>See all your upcoming appointments and take action to accept or reject them.</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-md">
              <div className="card-body items-center text-center">
                <span className="text-4xl">🔒</span>
                <h3 className="card-title mt-2">Secure & Private</h3>
                <p>Your health data is protected with industry-standard security and privacy measures.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-6 bg-base-200 text-base-content mt-auto">
        <aside>
          <p>© {new Date().getFullYear()} Digital Healthcare System. All rights reserved.</p>
        </aside>
      </footer>
    </div>
  );
};

export default LandingPage;
