import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import adming from '../../../assets/images/admins/admin.jpg';

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
function AddCountry() {
    const [countryName, setCountryName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/countries', { name: countryName });
            alert('Country added successfully');
            navigate('/adminpanel'); // Redirect to the admin panel after successful addition
        } catch (error) {
            console.error('Failed to add country:', error);
            alert('Failed to add country: ' + (error.response?.data.message || error.message));
        }
    };

    return (
        <div style={{ backgroundImage: `url(${adming})`,paddingTop: '110px'}}>
            <div className="add-user-container"style={{ color:'black',justifyContent:'left',backgroundColor: 'white',paddingTop: '0px'}}>
                <h3 style={{color: 'gold', marginLeft:'130px' ,paddingTop:'20px',marginBottom:'-50px', justifyContent: 'space-between', alignItems: 'center' }}>Добавить новую страну</h3>
                <form onSubmit={handleSubmit}  className="user-form" style={{Color: 'black',}}>
                <label htmlFor="name" style={{ color: 'black' }}>Имя страны:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={countryName}
                    onChange={e => setCountryName(e.target.value)}
                    required
                />
                <button type="submit">ДОБАВИТЬ СТРАНУ</button>
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
export default AddCountry;