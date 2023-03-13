import React, { useEffect } from 'react';
import logoface from '../img/material-symbols_familiar-face-and-zone-sharp.svg';
import { auth } from "../utils/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
        const [user, loading] = useAuthState(auth);
        const logout = () => {
            auth.signOut();
        };
        const navigate = useNavigate();
        const getData = async () => {
            if(loading) return;
            if(!user) navigate('/login');
        };
        
        useEffect(() => {
            getData();
            // eslint-disable-next-line
        }, [])

        if (user) {
            return (
            <nav>
                <img className="logo" alt='logo' src={logoface}/>
                <Link to={"/login"}>
                    <p onClick={logout}>Sign Out</p>
                </Link>
            </nav>
            )
        } else {
            return (
                <nav>
                    <img className="logo" alt='logo' src={logoface}/>
                    <Link to={"/login"}>
                        <p>Sign In</p>
                    </Link>
                    <Link to={"/register"}>
                        <p>Register</p>
                    </Link>
                </nav>
            )

        }
    }

export default Navigation;
