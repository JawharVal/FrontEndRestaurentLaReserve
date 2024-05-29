import React, { useEffect, useState } from 'react';
import './Spinner.css';

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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
            const timer = setTimeout(() => {
                setStyle(prevStyle => ({
                    ...prevStyle,
                    visibility: 'hidden'
                }));
            }, 500);
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
