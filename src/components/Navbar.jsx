import React from 'react';
import { Link } from 'react-router-dom';


function Navbar() {
    // TODO: Replace with real auth logic
    const isLoggedIn = false; // Set to true if user is logged in
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
                        <li><Link to="/">Home</Link></li>
                        {isLoggedIn && <li><Link to="/dashboard">Dashboard</Link></li>}
                        {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
                        {!isLoggedIn && <li><Link to="/register">Register</Link></li>}
                        {isLoggedIn && <li><button className="btn btn-error btn-sm mt-2">Logout</button></li>}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl">DHMS</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
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
