import React, { useState, useEffect } from 'react';
import {NavLink} from "react-router-dom";
import './LoginPage.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { AuthProvider, useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';


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

function LoginPage() {
    const [opacity, setOpacity] = useState(0);
    useEffect(() => {
        document.body.style.backgroundColor = 'white';

        return () => {
            document.body.style.backgroundColor = ''; // Reset the background when the component unmounts
        };
    }, []);
    useEffect(() => {
        // Fade in effect
        const timer = setTimeout(() => {
            setOpacity(1);
        }, 200); // Adjust delay as needed

        // Header resize on scroll
        const handleScroll = () => {
            const header = document.querySelector('header');
            if (header) {
                header.style.height = window.pageYOffset > 0 ? '60px' : '100px';
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [emailHistory, setEmailHistory] = useState([]);

    useEffect(() => {
        // Load email history from local storage on component mount
        const storedEmails = JSON.parse(localStorage.getItem('emailHistory')) || [];
        setEmailHistory(storedEmails);
    }, []);
    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!username) {
            errors.username = "Email is required";
            formIsValid = false;
        }

        if (!password) {
            errors.password = "Password is required";
            formIsValid = false;
        }

        setErrors(errors);
        return formIsValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedEmails = [...new Set([username, ...emailHistory])]; // Prevent duplicates
        localStorage.setItem('emailHistory', JSON.stringify(updatedEmails));
        setEmailHistory(updatedEmails);
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password })
            });

            const data = await response.json();

            if (response.ok && data.accessToken) {
                setToken(data.accessToken);
                navigate('/profile'); // Use navigate instead of window.location.href
            } else {
                if (response.status === 401) {
                    alert('Incorrect email or password');
                } else {
                    alert('Login failed: ' + (data.message || 'Unknown Error'));
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrors({ unexpectedError: 'Incorrect Email or Password, Please verify and retry.' }); // Set the error message
        }
    };





    return (
        <div className="login-page-container"   style={{ paddingtop:'300px'}}> {/* Wrapper div for background */}
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Логин</h1> {/* Added styled title */}
                {errors.unexpectedError && <div className="error">{errors.unexpectedError}</div>} {/* Render the error message */}

                <div className="form-group">
                    <label>Электронная почта:</label>
                    <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="email" list="email-history" />
                    <datalist id="email-history">
                        {emailHistory.map((e, index) => (
                            <option key={index} value={e} />
                        ))}
                    </datalist>
                    {errors.username && <div className="error">{errors.username}</div>}
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>

                <button type="submit" >ЛОГИН</button>
                <NavLink to="/register" className="register-link">Нет аккаунта? Зарегистрируйтесь.</NavLink>
                <NavLink to="/contact" style={{ textDecoration: 'none',textShadow: `
          1px 1px 0 gold,  
          1px 1px 0 gold,
          1px 1px 0 gold,
          1px 1px 0 gold`,marginTop:'20px', fontWeight: 'bolder',fontSize:'15px', transition: 'color 0.3s ease' }}
                         onMouseOver={(e) => e.currentTarget.style.color='gray'}
                         onMouseOut={(e) => e.currentTarget.style.color='black'}>Проблемы со входом в систему? Связаться с нами.</NavLink>
            </form>
            {/* Footer */}
            <footer className="hoho-footer" style={{ backgroundColor: 'black', color: 'gold', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px',marginTop:'212px' }}>
                <SocialIcons />
                <div style={{ textAlign: 'center' }}>
                    <a style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bold' }}>© 2024 LA RESERVE. Все права защищены.</a>
                </div>
                <div>
                    <ul style={{ listStyleType: 'none', marginRight: '20px', display: 'flex', gap: '40px' }}>
                        <li>
                            <NavLink to="/contact" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}
                                     onMouseOver={(e) => e.currentTarget.style.color='white'}
                                     onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                                КОНТАКТ
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}
                                     onMouseOver={(e) => e.currentTarget.style.color='white'}
                                     onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                                О НАС
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/subscribe" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}
                                     onMouseOver={(e) => e.currentTarget.style.color='white'}
                                     onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                                НОВОСТНАЯ РАССЫЛКА
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default LoginPage;