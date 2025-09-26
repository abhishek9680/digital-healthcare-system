import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api';


function Navbar() {
    // Get auth state from localStorage
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isLoggedIn = !!token;
    // Identify doctor by presence of 'speciality' or 'speciality' property
    console.log(user);
    const isDoctor = Boolean(user?.speciality || user?.speciality);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Navigation links for all users
    const commonLinks = [
        { to: '/', label: 'Home' },
    ];
    // Dashboard link based on specialization
    const dashboardLinks = [];
    if (isDoctor) {
        dashboardLinks.push({ to: '/doctor-dashboard', label: 'Doctor Dashboard' });
    } else if (user) {
        dashboardLinks.push({ to: '/patient-dashboard', label: 'Patient Dashboard' });
    }
    // Auth links
    const authLinks = [
        !isLoggedIn && { to: '/login', label: 'Login' },
        !isLoggedIn && { to: '/register', label: 'Register' },
    ].filter(Boolean);

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-10">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {commonLinks.map((link) => (
                            <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                        ))}
                        {dashboardLinks.map((link) => (
                            <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                        ))}
                        {authLinks.map((link) => (
                            <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                        ))}
                        {isLoggedIn && (
                            <li><button className="btn btn-error btn-sm mt-2" onClick={handleLogout}>Logout</button></li>
                        )}
                    </ul>
                </div>
                <Link to="/" className="flex items-center gap-2 btn btn-ghost text-xl">
                    <img src="/logo.jpg" alt="Logo" className="h-8 w-8" />
                    
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {commonLinks.map((link) => (
                        <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                    ))}
                    {dashboardLinks.map((link) => (
                        <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                    ))}
                    {authLinks.map((link) => (
                        <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                    ))}
                </ul>
            </div>
            <div className="navbar-end">
                {isLoggedIn ? (
                    <div className="flex items-center gap-2">
                        {/* */}
                        <button className="btn btn-error btn-sm" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                )}
            </div>
        </div>
    );
}

export default Navbar;
