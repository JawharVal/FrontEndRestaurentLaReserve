import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddUser.css';
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
function AddRestaurant() {
    const [restaurantData, setRestaurantData] = useState({
        name: '',
        locationName: '',
        cuisine: '',
        capacity: 0,
        locationId: null
    });

    const navigate = useNavigate();
    const [locationNames, setLocationNames] = useState([]); // State to store location names
    const [locations, setLocations] = useState([]); // State to store location data

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "locationName") {
            // Find the location by address and extract the locationId
            const selectedLocation = locations.find(location => location.address === value);
            console.log("Selected location ID:", selectedLocation ? selectedLocation.locationId : "None");
            setRestaurantData(prevState => ({
                ...prevState,
                locationName: value,
                locationId: selectedLocation ? selectedLocation.locationId : null
            }));
        } else {
            setRestaurantData(prevState => ({ ...prevState, [name]: value }));
        }
    };



    useEffect(() => {
        const fetchLocationNames = async () => {
            try {
                const response = await axios.get('/api/locations');
                console.log("Locations fetched:", response.data); // Log the fetched locations
                setLocationNames(response.data.map(location => location.address));
                setLocations(response.data);
            } catch (error) {
                console.error('Failed to fetch location names:', error);
            }
        };

        fetchLocationNames();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting data with location ID:", restaurantData.locationId);
        try {
            const response = await axios.post('/restaurants', {
                ...restaurantData,
                locationId: restaurantData.locationId
            });
            console.log('Server response:', response);
            alert('Restaurant added successfully');
            navigate('/admin-panel');
        } catch (error) {
            console.error('Failed to add restaurant:', error);
            alert('Failed to add restaurant: ' + error.message);
        }
    };

    return (
        <div style={{ backgroundImage: `url(${adming})`,paddingTop: '10px'}}>
            <div className="add-user-container"style={{ color:'black',justifyContent:'left',backgroundColor: 'white',paddingTop: '0px'}}>
                <h3 style={{color: 'gold', marginLeft:'100px' ,paddingTop:'20px',marginBottom:'-50px'}}>Добавить новый ресторан</h3>
                <form onSubmit={handleSubmit}  className="user-form" style={{Color: 'black',}}>
                    <label style={{ color: 'black' }}>Имя:</label>
                    <input type="text" name="name" value={restaurantData.name} onChange={handleChange} required />

                    <label style={{ color: 'black' }}>Название местоположения:</label>
                    <select name="locationName" value={restaurantData.locationName} onChange={handleChange} required>
                        <option value="">Выберите местоположение</option>
                        {locationNames.map((locationName, index) => (
                            <option key={index} value={locationName}>{locationName}</option>
                        ))}
                    </select>

                    <label style={{ color: 'black' }}>Кухня:</label>
                    <input type="text" name="cuisine" value={restaurantData.cuisine} onChange={handleChange} required />

                    <label style={{ color: 'black' }}>Емкость:</label>
                    <input type="number" name="capacity" value={restaurantData.capacity} onChange={handleChange} required />

                    <button type="submit">ДОБАВИТЬ РЕСТОРАН</button>
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

export default AddRestaurant;
