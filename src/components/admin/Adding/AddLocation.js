import React, { useState, useEffect } from 'react';
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
function AddLocation() {
    const [locationData, setLocationData] = useState({
        address: '',
        city: { cityId: '' }, // Changed to cityId to store the ID of the city
        postalCode: ''
    });
    const [cities, setCities] = useState([]); // State to hold list of cities
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('/api/cities');
                setCities(response.data); // Set the cities data
            } catch (error) {
                console.error('Failed to fetch cities:', error);
            }
        };
        fetchCities();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "cityId") {
            // Update the nested city object
            setLocationData(prev => ({ ...prev, city: { cityId: value } }));
        } else {
            setLocationData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // The POST request should send the structured data as expected by the backend
            await axios.post('/api/locations', {
                ...locationData,
                city: { cityId: parseInt(locationData.city.cityId, 10) } // Ensure cityId is sent as a number
            });
            alert('Location added successfully');
            navigate('/adminpanel');
        } catch (error) {
            console.error('Failed to add location:', error);
            alert('Failed to add location: ' + error.message);
        }
    };

    return (
        <div style={{ backgroundImage: `url(${adming})`,paddingTop: '50px'}}>
            <div className="add-user-container"style={{ color:'black',justifyContent:'left',backgroundColor: 'white',paddingTop: '0px'}}>
                <h3 style={{color: 'gold', marginLeft:'100px' ,paddingTop:'20px',marginBottom:'-50px'}}>Добавить новое местоположение</h3>
                <form onSubmit={handleSubmit}  className="user-form" style={{Color: 'black',}}>
                <label style={{ color: 'black' }}>Адрес:</label>
                <input
                    type="text"
                    name="address"
                    value={locationData.address}
                    onChange={handleChange}
                    required
                />
                <label style={{ color: 'black' }}>Город:</label>
                <select
                    name="cityId"
                    value={locationData.city.cityId}
                    onChange={handleChange}
                    required
                >
                    <option value="" style={{ color: 'black' }}>Выберите город</option>
                    {cities.map(city => (
                        <option key={city.cityId} value={city.cityId}>
                            {city.name}
                        </option>
                    ))}
                </select>
                <label style={{ color: 'black' }}>Почтовый индекс:</label>
                <input
                    type="text"
                    name="postalCode"
                    value={locationData.postalCode}
                    onChange={handleChange}
                    required
                />
                <button type="submit">ДОБАВИТЬ МЕСТОПОЛОЖЕНИЕ</button>
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
export default AddLocation;
