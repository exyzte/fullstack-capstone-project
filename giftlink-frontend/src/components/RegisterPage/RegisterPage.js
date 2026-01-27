import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    async function handleRegister (e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON. stringify({
                    firstName,
                    lastName,
                    username,
                    email,
                    password,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.message || 'Registration failed. Please try again');
                throw new Error(data.message || 'Registration failed');
            } else {
                alert('Registration successful!');
                navigate('app/login');
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
                <div className="col-md-6 col-lg-5">
                    {/* Added 'p-4' for internal spacing and 'shadow' for depth */}
                    <div className="card border-0 shadow-sm p-4"> 
                        <h2 className="mb-4 text-center fw-bold">Register</h2>
                
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
                                <label htmlFor="username" className="form-label fw-semibold">Username</label>
                                <input type="text" className="form-control" id="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>

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


