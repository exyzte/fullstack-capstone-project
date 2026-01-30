import React from 'react';
import { useAppContext } from '../../context/AuthContext'; // Import the store
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { isLoggedIn, userName, setIsLoggedIn } = useAppContext();
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
                        <li className="greeting-user navbar-text me-3">{`Hello, ${userName}`}</li>
                    )}
                    
                    {/* Task 1: Add links to Home and Gifts below*/}
                    <li className="nav-item">
                        <a className="nav-link" href="/home">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/app">Gifts</a>
                    </li>
                    <div className="ms-auto navbar-nav">
                        {isLoggedIn ? (
                        <>
                            <li className="nav-item"><a className="nav-link" href="/app/search">Search</a></li>
                            <li className='nav-item logout-btn'><a className="nav-link btn btn-link" onClick={handleLogout}>Logout</a></li>
                        </>
                        ) : (
                        <>
                            <li className="nav-item"><a className="nav-link" href="/app/search">Search</a></li>
                            <li className="nav-item"><a className="nav-link" href="/app/register">Register</a></li>
                            <li className="nav-item"><a className="nav-link" href="/app/login">Login</a></li>
                        </>
                        )}
                    </div>
                </ul>
            </div>
        </nav>
    );
}
