import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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
function EditUser() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        username: '',
        city: '',
        region: '',
        role: ''
    });

    useEffect(() => {
        axios.get(`/admin/user/${userId}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch user details:', error);
                alert('Failed to fetch user details');
            });
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`/admin/user/${userId}`, user)
            .then(response => {
                alert('User updated successfully');
                navigate('/adminpanel');
            })
            .catch(error => {
                console.error('Failed to update user:', error);
                alert('Failed to update user');
            });
    };

    return (
        <div style={{ backgroundImage: `url(${adming})`,paddingTop: '10px'}}>
            <div className="add-user-container"style={{ paddingTop: '50px'}}>
                <h3 style={{ color: 'gold', marginLeft:'180px' ,paddingTop:'50px'}}>Edit User</h3>
                <form onSubmit={handleSubmit} className="user-form">
                    <label style={{ color: 'black' }}>Email:</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} />

                    <label style={{ color: 'black' }}>Username:</label>
                    <input type="text" name="username" value={user.username} onChange={handleChange} />

                    <label style={{ color: 'black' }}>City:</label>
                    <input type="text" name="city" value={user.city} onChange={handleChange} />

                    <label style={{ color: 'black' }}>Region:</label>
                    <input type="text" name="region" value={user.region} onChange={handleChange} />

                    <label style={{ color: 'black' }}>Role:</label>
                    <input type="text" name="role" value={user.role} onChange={handleChange} />

                    <button type="submit">Update User</button>
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

export default EditUser;
