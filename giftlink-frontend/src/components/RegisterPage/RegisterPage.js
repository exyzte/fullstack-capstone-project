import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './RegisterPage.css'

function RegisterPage() {
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState('');

    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();


    async function handleRegister (e) {
        e.preventDefault(); // prevents form submission behavior and page reload
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                 },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setErrorMessage(data.error);
                throw new Error(data.message || 'Registration failed');
            } else {
                alert('Registration successful!');
                sessionStorage.setItem('auth-token', data.authToken);
                sessionStorage.setItem('firstName', data.firstName);
                sessionStorage.setItem('email', data.email);
                setIsLoggedIn(true);
                setUserName(data.firstName);
                navigate('/app');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Cannot connect to the server', error);
        }
        
        console.log('Registering user:', { firstName, lastName, email });

    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div>
                    {/* Added 'p-4' for internal spacing and 'shadow' for depth */}
                    <div className="register-card border rounded shadow-sm p-4"> 
                        <h3 className="mb-4 text-center fw-bold register">Register</h3>
                
                        <form onSubmit={handleRegister}>
                            {/* Wrap each pair in a mb-3 div for proper spacing */}
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label fw-semibold">First Name</label>
                                <input type="text" className="form-control" id="firstName" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label fw-semibold">Last Name</label>
                                <input type="text" className="form-control" id="lastName" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                            </div>


                            <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            {errorMessage && <div className="text-danger mb-3 text-center">{errorMessage}</div>}
                            <button type="submit" className="btn btn-primary w-100 py-2 shadow-sm">
                                Register
                            </button>
                        </form>

                        <p className="text-center mt-4 mb-0">
                            Already a member? <a href="/app/login" className="text-decoration-none">Login here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;