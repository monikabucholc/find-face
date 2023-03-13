
import React from 'react';
import Stats from './Stats';

const FaceRecognition = ({ imageUrl, box, imagePrediction }) => {
    return (
        <div className="face-placement" >
            <div className='face-container'>
                <img id='inputimage' alt='' src={imageUrl}/>
                {box.map((element, index ) => (
                    <div key={index} className='bounding-box' 
                        style={{top: element.topRow, 
                        right: element.rightCol,
                        bottom: element.bottomRow,
                        left: element.leftCol
                        }}>
                    </div>
                ))}
 
            </div>
            <Stats imagePrediction={imagePrediction} faces={box}/>   
        </div>
    )
}

export default FaceRecognition;