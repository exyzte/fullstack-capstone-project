import React, { useState, useEffect } from 'react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate  } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ incorrectPassword, setIncorrectPassword ] = useState('');
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');
    const { setIsLoggedIn, setUserName } = useAppContext();

    useEffect(() => {
        if(sessionStorage.getItem('auth-token')) {
            navigate('/app');
        };
    }, [navigate]);

    useEffect(() => {
        if(incorrectPassword) {
            document.getElementById('').value = 'Incorrect password. Please try again'
        }
    }, [handleLogin]);

    async function handleLogin(e) {
        e.preventDefault();
        
        const navigate = useNavigate();
        const { setIsLoggedIn, setUserName } = useAppContext();
        
        try {
            const response = await fetch(`${urlConfig.backendUrl}/auth/login`, {
                method: 'POST',
                headers: { 
                    'content-type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : ','
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });
            const data = await res.json();
            if(data.authToken) {
                sessionStorage.setItem('auth-token', data.authToken);
                sessionStorage.setItem('name', data.userName);
                sessionStorage.setItem('email', data.email);
                setIsLoggedIn(true);
                navigate('/App');
            } else {
                setErrorMessage('Password is incorrect. Please try again.');
                document.getElementById('email').value='';
                document.getElementById('password').value='';
                setTimeout(() => {
                    setIncorrectPassword('Wrong password, please try again later.');
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
                <div className="col-md-6 col-lg-5">
                    <div className="login-card p-3 border rounded">
                            <h2 className="mb-4 text-center font-weight-bold login">Login</h2>
                            <form className="form-group mb-3 p-4" onSubmit={handleLogin}>
                                <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={setPassword(e.target.value)} />
                                </div>
                                <button onClick={handleLogin} className="btn btn-primary w-100 mb-3">Login</button>
                            </form>
                            <span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrect}</span>
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

export default LoginPage();