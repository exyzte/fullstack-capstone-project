import React, { useState, useEffect } from 'react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate  } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ incorrectPassword, setIncorrectPassword ] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();
    


    useEffect(() => {
        if(sessionStorage.getItem('auth-token')) {
            navigate('/app');
        };
    }, [navigate]);

    async function handleLogin(e) {
        e.preventDefault();
        
        try {
            const headers = { 
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}`
            };
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    email,
                    password
                }),
            });
            const data = await response.json();
            if(data.error === "User not found") {
                setIncorrectPassword('User not found. Please register first or check the email.');
                setEmail('');
                setPassword('');
                setTimeout(() => {
                    setIncorrectPassword('');
                }, 2000);
                return;
            }
            console.log(data);
            if(data.authToken) {
                sessionStorage.setItem('auth-token', data.authToken);
                sessionStorage.setItem('firstName', data.firstName);
                sessionStorage.setItem('email', data.email);
                setIsLoggedIn(true);
                setUserName(data.firstName);
                navigate('/app');
            } else {
                setIncorrectPassword('Password is incorrect. Please try again.');
                setEmail('');
                setPassword('');
                setTimeout(() => {
                    setIncorrectPassword('');
                }, 2000);
            }
        } catch(error) {
            console.error('Error during login:', error);
            alert('Cannot connect to the server', error);
        }
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div>
                    <div className="login-card p-3 border rounded">
                            <h2 className="mb-4 text-center font-weight-bold login">Login</h2>
                            <form className="form-group mb-3 p-4" onSubmit={handleLogin}>
                                <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={(e) => {setPassword(e.target.value);setIncorrectPassword('')}} />
                                </div>
                                <button onClick={handleLogin} className="btn btn-primary w-100 mb-3">Login</button>
                            </form>
                            <span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrectPassword}</span>
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

export default LoginPage;