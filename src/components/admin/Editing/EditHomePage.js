import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import adming from '../../../assets/images/admins/admin.jpg';

import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SocialIcons() {
    return (
        <div>
            <a href="#" style={{color: 'gold', marginRight: '20px'}}>
                <FontAwesomeIcon icon={faFacebookSquare} style={{fontSize: '33px'}}/>
            </a>
            <a href="#" style={{color: 'gold', marginRight: '20px'}}>
                <FontAwesomeIcon icon={faInstagram} style={{fontSize: '33px'}}/>
            </a>
            <a href="#" style={{color: 'gold'}}>
                <FontAwesomeIcon icon={faVk} style={{fontSize: '33px'}}/>
            </a>
        </div>
    );
}
function EditHomePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [homePage, setHomePage] = useState({
        title: '',
        imageUrls: [],
        descriptions: [],
        buttonTexts: [],
        link: ''
    });

    useEffect(() => {
        axios.get(`/api/homePage/${id}`)
            .then(response => {
                setHomePage(response.data);
            })
            .catch(error => console.error('Failed to fetch home page:', error));
    }, [id]);


    const handleSubmit = (event) => {
        event.preventDefault();
        axios.put(`/api/homePage/${id}`, homePage)
            .then(() => {
                alert('Home page updated successfully!');
                navigate('/adminpanel'); // assuming you have an admin dashboard to return to
            })
            .catch(error => {
                alert('Failed to update home page:', error.message);
                console.error('Error:', error);
            });
    };

    const handleChange = (event) => {
        if (event.target.name === 'imageUrls') {
            // Assuming imageUrls are submitted as a comma-separated string
            setHomePage(prevState => ({
                ...prevState,
                imageUrls: event.target.value.split(',').map(url => url.trim()) // Converts string to array when changing
            }));
        } else {
            setHomePage({
                ...homePage,
                [event.target.name]: event.target.value
            });
        }
    };
    const [hover, setHover] = useState(false);
    const styles = {

        container: {

            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundImage: `url(${adming})`,
            backgroundSize: 'cover',
        },
        form: {
            padding: '50px',
            marginTop:'250px',
            marginBottom:'400px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: "#ffffff",
            width: '100%',
            maxWidth: '500px',
        },
        input: {
            width: '95.5%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
        },
        select: {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
        },
        textarea: {
            width: '95.5%',
            height: '100px',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            resize: 'none'
        },
        button: {
            padding: '10px 20px',
            margin: '10px 0',
            borderRadius: hover ? '5px' : '4px',
            border: '4px solid #ffffff',
            backgroundColor: hover ? '#000000' : 'gold',
            color: hover ? '#ffffff' : 'white',
            cursor: 'pointer',
            transform: hover ? 'scale(1.05)' : 'none',
            border: '1px solid green',
            transition: 'background-color 0.3s, color 0.3s, transform 0.3s, border-radius 0.3s'
        },
        label: {
            fontWeight: 'bold',
        },
        error: {
            color: 'red',
            fontSize: '0.8rem',
            height: '20px', // Ensure the layout doesn't jump when errors appear
        }
    };
    return (
        <div style={styles.container}>
            <h2>'</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label>
                    Title:
                    <input type="text" name="title" value={homePage.title || ''} onChange={handleChange} />
                </label>
                <label>
                    Image URLs:
                    <input
                        type="text"
                        name="imageUrls"
                        value={homePage.imageUrls.join(', ')}  // Join array into a string for editing
                        onChange={handleChange}
                    />
                </label>
                {/* Add input fields for descriptions, buttonTexts, and link as needed */}
                <button type="submit">Submit</button>
            </form>
            <footer className="hoho-footer" style={{ backgroundColor: 'black', color: 'gold', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'250px',height: '80px' }}>
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

export default EditHomePage;
