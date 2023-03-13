import React, { useState, useEffect } from 'react'
import FaceRecognition from '../components/FaceRecognition';
import ImageLinkForm from '../components/ImageLinkForm';
import Rank from '../components/Rank';
import defaultPhoto from '../img/ernest-brillo-bO3lEGHbk2M-unsplash1.jpg';
import { auth, db } from "../utils/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom'
import { collection, where, addDoc, serverTimestamp, onSnapshot, query } from 'firebase/firestore';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const[faceEntries, setFaceEntries] = useState([]);
    const [user, loading] = useAuthState(auth);
    const defaultImage = {
        input: '',
        box: [],
        imageUrl: defaultPhoto
    };
    const [imageState, setImageState] = useState(defaultImage);
    const [imagePrediction, setImagePrediction] = useState([]);
    
    let faceNumber = 0;
    const navigate = useNavigate();
    
    
    const readDb = async () => {
        const q = query(collection(db, 'entries'), where("userid", "==", user.uid));
        // const querySnapshot = await getDocs(q);
        const unsub = onSnapshot(q, (snapshot) => {
            setFaceEntries(snapshot.docs.length);     
        })
        return unsub;
    }

    useEffect(() => {
        readDb();
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const checkUser = async () => {
            if(loading) return;
            if(!user) navigate('/login');
        };
        checkUser();
        // eslint-disable-next-line
    }, [user, loading])

    const updateDb = async () => {
        const collectionRef = collection(db, 'entries');
        await addDoc(collectionRef, {
            userid: user.uid,
            username: user.displayName,
            image: imageState.input,
            timestamp: serverTimestamp(),
            faces: faceNumber
        });  
    }

    const calculateFaceLocation = (data) => {
        let faces=data.outputs[0].data.regions.length;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        let boxes = [];
        for (let i = 0; i < faces; i++) {
            let clarifaiFace = data.outputs[0].data.regions[i].region_info.bounding_box;
            boxes.push({
                leftCol: clarifaiFace.left_col * width,
                topRow: clarifaiFace.top_row * height,
                rightCol: width - (clarifaiFace.right_col * width),
                bottomRow: height - (clarifaiFace.bottom_row * height),
                key: i
                });
        };
        return boxes;
    }

    const displayFaceBox = (boxes) => {
        setImageState({
            ...imageState,
            input: '', 
            box: boxes,
            imageUrl: imageState.input,
        });
        faceNumber = boxes.length;
    }
        
    const onInputChange = (event) => {
        setImageState({
        ...imageState, 
        input: event.target.value,
        });
    }

    const onButtonSubmit = (e) => {
        e.preventDefault();
        setImagePrediction([]);
        if (!imageState.input) {
            toast.error("Input link with a picture", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
            });
            setImageState({...imageState, input: '', imageUrl: defaultImage.imageUrl, box: []}); 
            toast.clearWaitingQueue();
        } else {
            setImageState({
                ...imageState, 
                imageUrl: imageState.input
            });
            //START CLARIFAI
            const USER_ID = process.env.REACT_APP_USER_ID;
            const PAT = process.env.REACT_APP_PAT;
            const APP_ID = 'find-face';
            const MODEL_ID_1 = 'face-detection';
            const MODEL_ID_2 = 'general-image-recognition';
            const MODEL_VERSION_ID_1 = '6dc7e46bc9124c5c8824be4822abe105';
            const MODEL_VERSION_ID_2 = 'aa7f35c01e0642fda5cf400f543e7c40';       
            const IMAGE_URL = imageState.input;
            const raw = JSON.stringify({
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "url": IMAGE_URL
                        }
                    }
                }
            ]
        });
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Key ' + PAT
                },
                body: raw
            };


            fetch("https://api.clarifai.com/v2/models/" + MODEL_ID_1 + "/versions/" + MODEL_VERSION_ID_1 + "/outputs", requestOptions)
            .then(response => response.text())
            .then(result => {
                if (JSON.parse(result).outputs[0].data.regions) {(async function() {
                displayFaceBox(calculateFaceLocation(JSON.parse(result)))
                    await updateDb();
                    await readDb();
                })()
                fetch("https://api.clarifai.com/v2/models/" + MODEL_ID_2 + "/versions/" + MODEL_VERSION_ID_2 + "/outputs", requestOptions)
                .then(response => response.text())
                .then(result => {
                    let tempPrediction = [];
                    for (let i=1; i < 6; i++) {
                        tempPrediction.push(JSON.parse(result).outputs[0].data.concepts[i].name)
                    };
                    setImagePrediction(tempPrediction);
                    tempPrediction = [];
                })
                .catch(error => {
                    console.log('error', error)
                });
                } else {
                    toast.error("You didn't input the link with a picture or there are no faces 😧", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 4000,
                      });
                    toast.clearWaitingQueue()
                    return setImageState({...imageState, input: '', imageUrl: defaultImage.imageUrl, box: []})
                } 
            })
            
            .catch(error => {
                console.log('error', error)
                return setImageState({...imageState, input: '', imageUrl: defaultImage.imageUrl, box: []})
            });

            
        }
    }
    //END CLARIFAI

    return (
        <div className="content">
            <ToastContainer limit={1} />
            <Rank entries={faceEntries}/>
            <ImageLinkForm userState={imageState} onButtonSubmit={onButtonSubmit} onInputChange={onInputChange} setImageState={setImageState}/>
            <FaceRecognition box={imageState.box} imageUrl={imageState.imageUrl} imagePrediction={imagePrediction} />
        </div>
    );
}

export default Home;
