import React from 'react';

const ImageLinkForm = ({ onInputChange, onButtonSubmit, setImageState, userState: imageState }) => {
    const samplePhoto = 'https://images.unsplash.com/photo-1615332858674-7c78a52a5367?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
    
    return (
        <div>
            <h1 className="image-form-header">FIND A FACE!</h1>
            <div className="image-form-label">
                <span>Input link of your picture to detect faces. You can also try our</span>
                <span className="image-sample-button" onClick={() => {
                    setImageState({
                        ...imageState, 
                        input: samplePhoto,
                        });
                    }}>
                        Sample photo
                </span>
            </div>
            <form className='image-form' method="POST">
                <input className='image-input' type='tex' 
                    onChange={onInputChange}
                    value={imageState.input}
                />
                <button type="submit" className='image-submit' onClick={onButtonSubmit}>
                    Detect
                </button>
            </form>
        </div>
    )
}

export default ImageLinkForm;