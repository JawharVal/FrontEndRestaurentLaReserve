
import './Unauthorized.css'; // Import the CSS file you just created
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import './Unauthorized.css'; // Make sure your CSS is correctly imported
import React, { useEffect, useRef, useState, usenavigate } from 'react';
import './Unauthorized.css';
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import ghostImage from '../assets/images/ghost.png'; // Update with the correct path to your image

function SocialIcons() {
    return (
        <div>
            <a href="#" style={{ color: 'gold', marginRight: '20px' }}>
                <FontAwesomeIcon icon={faFacebookSquare} style={{ fontSize: '33px' }} />
            </a>
            <a href="#" style={{ color: 'gold', marginRight: '20px' }}>
                <FontAwesomeIcon icon={faInstagram} style={{ fontSize: '33px' }} />
            </a>
            <a href="#" style={{ color: 'gold' }}>
                <FontAwesomeIcon icon={faVk} style={{ fontSize: '33px' }} />
            </a>
        </div>
    );
}
function Unauthorized() {
    const navigate = useNavigate();
    const keyRef = useRef(null);
    const keyholeRef = useRef(null);
    const ghostRef = useRef(null);

    const [keyVisible, setKeyVisible] = useState(false);
    const [ghostVisible, setGhostVisible] = useState(false);

    useEffect(() => {
        const key = keyRef.current;
        const keyhole = keyholeRef.current;
        const ghost = ghostRef.current;

        const animationDuration = 40000; // 40 seconds in milliseconds
        const keyTimer = animationDuration * 9 / 8;

        const timeoutID = setTimeout(() => {
            setKeyVisible(true);
            setGhostVisible(true);

            const updateKeyPosition = (e) => {
                const x = e.clientX - key.getBoundingClientRect().width / 1.5;
                const y = e.clientY - key.getBoundingClientRect().height / 2;
                key.style.left = `${x}px`;
                key.style.top = `${y}px`;
            };

            const grantAccess = () => {
                navigate('/');
                key.style.display = "none";
                keyhole.style.display = "none";
            };


            return () => {
                clearTimeout(timeoutID);
            };
        }, keyTimer);
    }, [navigate]);

    return (
        <div>
            <div className="unauthorized-container" style={{
                backgroundImage: `url(${ghostImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'contain',
                backgroundPosition: 'center calc(30% - 20px)',
                backgroundSize: '400px',
                marginTop: '80px'
            }}>
            <h1>Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <button className="unauthorized-button" onClick={() => navigate('/')}>
                    Go to Home
                </button>
            </div>

            <footer className="hoho-footer" style={{  }}>
                <SocialIcons />
                <div style={{ textAlign: 'center' }}>
                    <a style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bold' }}>© 2024 LA RESERVE. All rights reserved.</a>
                </div>
                <div>
                    <ul style={{ listStyleType: 'none', marginRight: '20px', display: 'flex', gap: '40px' }}>
                        <li>
                            <NavLink to="/contact" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}
                                     onMouseOver={(e) => e.currentTarget.style.color='white'}
                                     onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                                CONTACT
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}
                                     onMouseOver={(e) => e.currentTarget.style.color='white'}
                                     onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                                ABOUT
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/subscribe" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}
                                     onMouseOver={(e) => e.currentTarget.style.color='white'}
                                     onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                                NEWSLETTER
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default Unauthorized;
