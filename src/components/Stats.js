import React, { useState, useEffect } from 'react'
import { auth, db } from "../utils/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, limit, where, orderBy, onSnapshot, query } from 'firebase/firestore';



const Stats = ({imagePrediction, faces}) => {
    const[lastEntries, setLastEntries] = useState([]);
    const [user] = useAuthState(auth);

    const readDb = async () => {
        const q = query(collection(db, 'entries'), where("userid", "==", user.uid), orderBy("timestamp", "desc", limit(3)));
        const unsub = onSnapshot(q, (snapshot) => {
            setLastEntries(snapshot.docs.slice(0, 3).map((doc)=>({timestamp: doc.data().timestamp, faces: doc.data().faces, key: doc.id})));    
             
        })
        return unsub;
    }

    useEffect(() => {
        readDb();
        // eslint-disable-next-line
    }, [])
    
    
    return (
        <div className="stats">
            <div className="stats-title">Your picture shows:</div>
            <div className="stats-category">
                <span>FACES: </span>
                {faces.length===0 ? <span ></span> : <span className="stats-data"> {`${faces.length}`} </span>}
            </div>
            <div className="stats-category">
                <span>TAGS:</span>
                <ul>
                {imagePrediction?.map((prediction, index) => 
                    (<li key={index} className="stats-data">
                        {`${prediction}`}  
                    </li>)
                )}
                </ul>
            </div>
            <div className="stats-title">Last 3 detections:</div>
            <ul>
                {lastEntries?.map((entry, index) => 
                    (<li key={index} className="stats-name">
                        FACES:
                        <span className="stats-data">{entry.faces}</span> 
                        DATE:
                        <span className="stats-data">{entry.timestamp ?  entry.timestamp.toDate().toLocaleString() : ''}</span> 
                    </li>
                    )
                )}
            </ul>
        </div>
    )
    
}
export default Stats;