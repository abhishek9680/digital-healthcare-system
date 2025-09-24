import { Link } from 'react-router-dom';


function Navbar() {
    // TODO: Replace with real auth logic and user role
    const isLoggedIn = false; // Set to true if user is logged in
    const userRole = null; // 'doctor' | 'patient' | null

    // Navigation links for all users
    const commonLinks = [
        { to: '/', label: 'Home' },
    ];
    // Dashboard links based on role
    const dashboardLinks = [
        userRole === 'doctor' && { to: '/doctor_dashboard', label: 'Doctor Dashboard' },
        userRole === 'patient' && { to: '/patient_dashboard', label: 'Patient Dashboard' },
    ].filter(Boolean);
    // Auth links
    const authLinks = [
        !isLoggedIn && { to: '/login', label: 'Login' },
        !isLoggedIn && { to: '/register', label: 'Register' },
    ].filter(Boolean);

    return (
        <div className="navbar bg-base-100 shadow-sm">
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
                            <li><button className="btn btn-error btn-sm mt-2">Logout</button></li>
                        )}
                    </ul>
                </div>
                <Link to="/" className="flex items-center gap-2 btn btn-ghost text-xl">
                    <img src="/logo.jpg" alt="Logo" className="h-8 w-8" />
                    DHMS
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
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                                <span>U</span>
                            </div>
                        </div>
                        <button className="btn btn-error btn-sm">Logout</button>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                )}
            </div>
        </div>
    );
}

export default Navbar
