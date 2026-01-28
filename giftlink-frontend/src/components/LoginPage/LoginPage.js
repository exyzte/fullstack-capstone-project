import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        // login logic here
        try {

        } catch(error) {
            console.error('Error during login:', error);
            alert('Cannot connect to the server', error);
        }
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="login-card p-3 border rounded">
                            <h2 className="mb-4 text-center font-weight-bold">Login</h2>
                            <form className="form-group mb-3 p-4" onSubmit={handleLogin}>
                                <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <button onClick={handleLogin} className="btn btn-primary w-100 mb-3">Login</button>
                            </form>
                            <br></br>
                            <p className="text-center mt-4">
                                Don't have an account?<br></br><br></br> <a href="/app/register">Register here</a>
                            </p>
                    </div>
                </div>
            </div>
        </div>
    )
}