import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddUser.css'; // Importing CSS for styling
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

function AddUser() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        city: '',
        region: '',
        role: ''
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/admin/user', formData)
            .then(() => {
                alert('User added successfully');
                navigate('/adminpanel');  // Navigate back to the admin panel
            })
            .catch(error => alert('Failed to add user: ' + error.message));
    };

    
    return (
        <div style={{ backgroundImage: `url(${adming})`,paddingTop: '10px'}}>
        <div className="add-user-container"style={{ backgroundColor: 'white',paddingTop: '0px'}}>
            <h3 style={{color: 'gold', marginLeft:'130px' ,paddingTop:'20px',marginBottom:'-50px'}}>Add New User</h3>
            <form onSubmit={handleSubmit}  className="user-form" style={{Color: 'black'}}>
                <label style={{ color: 'black' }}>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />

                <label style={{ color: 'black' }}>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} />

                <label style={{ color: 'black' }}>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} />

                <label style={{ color: 'black' }}>City:</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} />

                <label style={{ color: 'black' }}>Region:</label>
                <input type="text" name="region" value={formData.region} onChange={handleChange} />

                <label style={{ color: 'black' }}>Role:</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} />


                <button type="submit">Add User</button>
            </form>
        </div>
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

export default AddUser;
