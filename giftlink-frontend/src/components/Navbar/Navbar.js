import React from 'react';
import { useAppContext } from '../../context/AuthContext'; // Import the store
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { isLoggedIn, firstName, setIsLoggedIn } = useAppContext();
    const navigate = useNavigate();
    async function handleLogout() {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('firstName')
        setIsLoggedIn(false);
        navigate('/app');
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/home">GiftLink</a>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    {isLoggedIn && (
                        <li className="greeting-user navbar-text me-3 d-flex align-items-center">{`Hello, ${firstName}`}</li>
                    )}
                    
                    {/* Task 1: Add links to Home and Gifts below*/}
                    <li className="nav-item">
                        <Link className="nav-link" to="/home">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Gifts</Link>
                    </li>
                    <div className="ms-auto navbar-nav">
                        {isLoggedIn ? (
                        <>
                            <li className="nav-item"><Link className="nav-link" to="/app/search">Search</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/app/profile">Profile</Link></li>
                            <li className='nav-item logout-btn'><button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button></li>
                        </>
                        ) : (
                        <>
                            <li className="nav-item"><Link className="nav-link" to="/app/search">Search</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/app/register">Register</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/app/login">Login</Link></li>
                        </>
                        )}
                    </div>
                </ul>
            </div>
        </nav>
    );
}
