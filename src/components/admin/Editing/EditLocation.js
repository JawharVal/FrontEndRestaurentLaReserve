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
function EditLocation() {
    const { locationId } = useParams();
    const navigate = useNavigate();
    const [locationData, setLocationData] = useState({
        address: '',
        city: { cityId: '' },
        postalCode: ''
    });
    const [cities, setCities] = useState([]);
    const [hover, setHover] = useState(false);
    useEffect(() => {
        const fetchLocationDetails = async () => {
            try {
                const locationResponse = await axios.get(`/api/locations/${locationId}`);
                const cityResponse = await axios.get('/api/cities');
                setCities(cityResponse.data);
                setLocationData({
                    address: locationResponse.data.address,
                    city: { cityId: locationResponse.data.city.cityId },
                    postalCode: locationResponse.data.postalCode
                });
            } catch (error) {
                console.error('Failed to fetch location details:', error);
            }
        };

        fetchLocationDetails();
    }, [locationId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "cityId") {
            setLocationData(prev => ({ ...prev, city: { cityId: value } }));
        } else {
            setLocationData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/locations/${locationId}`, {
                ...locationData,
                city: { cityId: parseInt(locationData.city.cityId, 10) }
            });
            alert('Location updated successfully');
            navigate('/adminpanel');
        } catch (error) {
            console.error('Failed to update location:', error);
            alert('Failed to update location: ' + error.message);
        }
    };
    const styles = {

        container: {

            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundImage: `url(${adming})`,
            backgroundSize: 'cover',
        },
        form: {
            padding: '30px',
            marginTop:'220px',
            borderRadius: '8px',
            marginBottom:'510px',
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
            <h2>Edit Location</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label>Адрес:</label>
                <input
                    type="text"
                    name="address"
                    value={locationData.address}
                    onChange={handleChange}
                    required
                />
                <label>Город:</label>
                <select
                    name="cityId"
                    value={locationData.city.cityId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a City</option>
                    {cities.map(city => (
                        <option key={city.cityId} value={city.cityId}>
                            {city.name}
                        </option>
                    ))}
                </select>
                <label>Почтовый индекс:</label>
                <input
                    type="text"
                    name="postalCode"
                    value={locationData.postalCode}
                    onChange={handleChange}
                    required
                />
                <button type="submit">ОБНОВИТЬ МЕСТОПОЛОЖЕНИЕ</button>
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

export default EditLocation;
