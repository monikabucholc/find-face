import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';



const Login = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [formError, setFormError] = useState('')
    const navigate = useNavigate();
    // eslint-disable-next-line
    const [user, loading] = useAuthState(auth);
    const location = useLocation();
    const defaultUser = {
        name: 'Alex',
        email: 'example@example.com',
        password: process.env.REACT_APP_SAMPLEPASS
    };


    useEffect(() => {
        const isQueryParameters = () => {
            const urlParams = new URLSearchParams(location.search);
            const isDefaultUser = urlParams.get('isDefaultUser');
            if (isDefaultUser) {
                setUserData(defaultUser);
                navigate('/login')
            } else {
                navigate('/login')
            }
        }
        if(user) {
            navigate('/');
        } else {
            isQueryParameters();
        }
       // eslint-disable-next-line
    }, [user]);

    const handleLogin = () => {
    signInWithEmailAndPassword(auth, userData.email, userData.password)
        .then((userCredential) => {
            // eslint-disable-next-line
            const user = userCredential.user;
            navigate('/');
            setUserData({name: '', email: '', password: ''});
        })
        .catch((error) => {
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-email") {
                setFormError('You have entered an invalid username or password');
            }   
            else {
            console.log(error.code);
            console.log(error.message);
            }
        });
    }

    return (
        <main className="login-container">
            <form id="login" method="POST">
                    <legend className="title">Sign In</legend>
                <div className="login-field">
                    <label className="login-label" htmlFor="email-address">Email</label>
                    <input 
                    onChange = {(e) => setUserData({...userData, email: e.target.value})}
                    className="login-input" 
                    value={userData.email}
                    type="email" name="email-address"  id="email" placeholder="example@gmail.com" />
                </div>
                <div className="login-field">
                    <label className="login-label" htmlFor="password">Password</label>
                    <input 
                    onChange = {(e) => setUserData({...userData, password: e.target.value})}
                    value={userData.password}
                    className="login-input" 
                    type="password" name="password"  id="password" placeholder="Input password"/>
                </div>
                <p className="error-text">{formError}</p>
            </form>
            <input onClick={handleLogin} className="login-submit" type="submit" value="Login" />
            <div className="login-route-info">
                <p>Don't have an account?</p>
                <Link to={"/register"}>
                        <p className="login-route">Register</p>
                </Link>
            </div>
            <div className="login-route-info">
                <p>Don't want to create an account?</p>
                <p className="login-sample" onClick={(e) => setUserData(defaultUser)}>Sample Account</p>
            </div>
        </main>
    )
}

export default Login;
