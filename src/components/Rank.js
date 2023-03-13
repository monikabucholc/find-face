import React, { useEffect, useState } from 'react';
import { auth } from "../utils/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';


const Rank = ({ entries }) => {
    // eslint-disable-next-line
    const [user, loading] = useAuthState(auth);
    const [userLoaded, setUserLoaded] = useState(false);

    useEffect(() => {
        if (user.displayName === null || user === null) {
            window.location.reload();
        } else {
            setUserLoaded(true);
        }
    }, [user.displayName, user, userLoaded])
    
    if (!userLoaded) {
        <div>Loading</div>
    } else {
    return (
        <div>
            <div className="rank-user-name">
                Hello 
                <span> {`${user.displayName}! `}</span>
                Your current entry count is  
                <span> {entries}</span>
            </div>
        </div>
    )
    }
}

export default Rank;