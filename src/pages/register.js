import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

const Register = ({ setIsDefaultUser }) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [formError, setFormError] = useState({
        name: '',
        email: '',
        password: '',
    });

    const validMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const navigate = useNavigate();
    // eslint-disable-next-line
    const [user, loading] = useAuthState(auth)
    useEffect(() => {
       if(user) {
            navigate('/');
       } 
       // eslint-disable-next-line
    }, [user])
   

    const handleRegister = () => {
        if (validateForm()) {
            createUserWithEmailAndPassword(auth, userData.email, userData.password)
            .then((userCredential) => {
                // Signed in 
                // eslint-disable-next-line
                const user = userCredential.user
                updateProfile(user, {displayName: userData.name})
                navigate('/')
                setUserData({name: '', email: '', password: ''})
            })
            .catch((error) => {
                if (error.code === "auth/weak-password") {
                    setFormError({...formError, password: 'Password should be at least 6 characters'});
                } else if (error.code === "auth/invalid-email") {
                    setFormError({...formError, email: 'Invalid e-mail format'});
                } else if (error.code === "auth/email-already-in-use") {
                    setFormError({...formError, email: 'This e-mail already exists'});
                }   
                else {
                console.log(error.code);
                console.log(error.message);
                }
            });
        } 
    }

    const validateForm = () => {
        let localError = {
            name: '',
            email: '',
            password: '',
        }
        if (userData.name === "") {
            localError.name = 'Field cannot be empty'; 
        };
        if (!userData.email.match(validMail)) {
            localError.email = 'Invalid e-mail format';
        };
        if (userData.password.length < 5) {
            localError.password = 'Password should be at least 6 characters';
        };
        
        setFormError(localError);
        if (!localError.name && !localError.email && !localError.password) {
            return true;
        } else {
            return false
        }
    }

    const handleName = (e) => {
        setUserData({...userData, name: e.target.value});
        setFormError({...formError, name: ''});
    }

    const handleEmail = (e) => {
        setUserData({...userData, email: e.target.value});
        if (e.target.value.match(validMail)) {
            setFormError({...formError, email: ''});
        };
        
    }

    const handlePassword = (e) => {
        setUserData({...userData, password: e.target.value})
        if (e.target.value.length > 5) {
            setFormError({...formError, password: ''});
        };
    }

    return (
        <main className="login-container">
            <form id="register" method="post">
                    <legend className="title">Register</legend>
                <div className="login-field">
                    <label className="login-label" htmlFor="name">Name</label>
                    <input 
                     onChange = {handleName}
                    className="login-input" 
                    type="text" name="name"  id="name" placeholder="Input your name" />
                    <p className="error-text">{formError.name}</p>
                </div>
                <div className="login-field">
                    <label className="login-label" htmlFor="email-address">Email</label>
                    <input 
                    onChange = {handleEmail}
                    className="login-input" 
                    type="email" name="email"  id="email" placeholder="example@gmail.com" />
                    <p className="error-text">{formError.email}</p>
                </div>
                <div className="login-field">
                    <label className="login-label" htmlFor="password">Password</label>
                    <input 
                    onChange = {handlePassword}
                    className="login-input" 
                    type="password" name="password"  id="password" placeholder="Input password"/>
                    <p className="error-text">{formError.password}</p>
                </div>
                
            </form>
            <input onClick={handleRegister} className="login-submit" type="submit" value="Register" />
            <div className="login-route-info">
                <p>Already have an account?</p>
                <Link to={"/login"}>
                        <p className="login-route">Sign In</p>
                </Link>
            </div>
            <div className="login-route-info">
                <p>Don't want to create an account?</p>
                <Link to={"/login?isDefaultUser=true"}>
                        <p>Sample Account</p>
                </Link>
            </div>

        </main>
    )
}

export default Register;
