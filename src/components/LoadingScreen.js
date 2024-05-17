import React, { useEffect, useState } from 'react';
import './Spinner.css';  // Ensure this path is correct based on your project structure

const LoadingScreen = ({ show }) => {
    const [style, setStyle] = useState({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'gold',
        transition: 'opacity 1s ease, visibility 1s ease',
        opacity: 0,
        visibility: 'hidden',
        zIndex: 1000,
        display: 'flex',  // Ensure the spinner is centered
        justifyContent: 'center',  // Center horizontally
        alignItems: 'center'  // Center vertically
    });

    useEffect(() => {
        if (show) {
            setStyle(prevStyle => ({
                ...prevStyle,
                visibility: 'visible',
                opacity: 1
            }));
        } else {
            setStyle(prevStyle => ({
                ...prevStyle,
                opacity: 0
            }));
            // Delay the 'visibility' change until after the fade-out completes
            const timer = setTimeout(() => {
                setStyle(prevStyle => ({
                    ...prevStyle,
                    visibility: 'hidden'
                }));
            }, 500); // Matches the transition duration
            return () => clearTimeout(timer);
        }
    }, [show]);

    return (
        <div style={style}>
            {show && <div className="spinner"></div>}
        </div>
    );
};

export default LoadingScreen;
