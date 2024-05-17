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
function AddCity() {
    const [cityData, setCityData] = useState({
        name: '',
        countryId: ''
    });
    const [countries, setCountries] = useState([]); // List of countries for the dropdown
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch countries to populate the dropdown options
        const fetchCountries = async () => {
            try {
                const response = await axios.get('/api/countries');
                setCountries(response.data);
            } catch (error) {
                console.error('Failed to fetch countries:', error);
            }
        };
        fetchCountries();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCityData({ ...cityData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(cityData);
            // Append the countryId as a query parameter in the URL
            const url = `/api/cities?countryId=${encodeURIComponent(cityData.countryId)}`;
            await axios.post(url, { name: cityData.name });
            alert('City added successfully');
            navigate('/admin-panel'); // Redirect to admin panel or city list
        } catch (error) {
            console.error('Failed to add city:', error);
            alert('Failed to add city: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ backgroundImage: `url(${adming})`,paddingTop: '100px'}}>
            <div className="add-user-container"style={{ color:'black',justifyContent:'left',backgroundColor: 'white',paddingTop: '0px'}}>
                <h3 style={{color: 'gold', marginLeft:'100px' ,paddingTop:'20px',marginBottom:'-50px'}}>Добавить новый город</h3>
                <form onSubmit={handleSubmit}  className="user-form" style={{Color: 'black',}}>
                <label style={{ color: 'black' }}>Имя:</label>
                <input
                    type="text"
                    name="name"
                    value={cityData.name}
                    onChange={handleChange}
                    required
                />

                <label style={{ color: 'black' }}>Страна:</label>
                <select
                    name="countryId"
                    value={cityData.countryId}
                    onChange={handleChange}
                    required
                >
                    <option value="" style={{ color: 'black' }}>Выберите страну</option>
                    {countries.map(country => (
                        <option key={country.countryId} value={country.countryId}>
                            {country.name}
                        </option>
                    ))}
                </select>

                <button type="submit">ДОБАВИТЬ ГОРОД</button>
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
export default AddCity;
