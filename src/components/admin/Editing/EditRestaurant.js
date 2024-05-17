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
function EditRestaurant() {
    const { id } = useParams(); // Get the id from the URL
    const navigate = useNavigate();
    const [restaurantData, setRestaurantData] = useState({
        name: '',
        locationName: '',
        cuisine: '',
        capacity: 0,
        locationId: null
    });
    const [locations, setLocations] = useState([]);
    const [hover, setHover] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/restaurants/${id}`);
                console.log("Restaurant data fetched:", res.data);  // Confirming the fetched data structure
                setRestaurantData({
                    name: res.data.name,
                    locationName: res.data.locationName, // Directly using locationName from the fetched data
                    cuisine: res.data.cuisine,
                    capacity: res.data.capacity,
                    locationId: res.data.locationId  // Directly using locationId if it's there
                });
                // Fetch locations to populate the dropdown
                const locRes = await axios.get('/api/locations');
                setLocations(locRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "locationName") {
            const selectedLocation = locations.find(location => location.address === value);
            setRestaurantData(prevState => ({
                ...prevState,
                locationName: value,
                locationId: selectedLocation ? selectedLocation.locationId : null // Assuming `locationId` is what you need
            }));
        } else {
            setRestaurantData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/restaurants/${id}`, restaurantData);
            alert('Restaurant updated successfully');
            navigate('/adminpanel');
        } catch (error) {
            alert('Failed to update restaurant: ' + error.message);
            console.error('Failed to update restaurant:', error);
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
            marginTop:'250px',
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
            <h2>Edit Restaurant</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label>Имя:</label>
                <input type="text" name="name" value={restaurantData.name} onChange={handleChange} required />

                <label>Название местоположения:</label>
                <select name="locationName" value={restaurantData.locationName} onChange={handleChange} required>
                    <option value="">Select Location</option>
                    {locations.map((location, index) => (
                        <option key={index} value={location.address}>{location.address}</option>
                    ))}
                </select>


                <label>Кухня:</label>
                <input type="text" name="cuisine" value={restaurantData.cuisine} onChange={handleChange} required />

                <label>Емкость:</label>
                <input type="number" name="capacity" value={restaurantData.capacity} onChange={handleChange} required />

                <button type="submit">ОБНОВЛЕНИЕ РЕСТОРАНА</button>
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

export default EditRestaurant;
