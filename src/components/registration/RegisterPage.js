import React, { useState, useEffect } from 'react';
import './RegisterPage.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink, useNavigate } from "react-router-dom";

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

function RegisterPage() {
    const [opacity, setOpacity] = useState(0);
    useEffect(() => {
        document.body.style.backgroundColor = '#f6bf02';

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
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        country: '',  // Ensure this is added
        city: '',
        region: ''
    });
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate(); // use useNavigate here
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [cities, setCities] = useState([]);
    const [timeoutId, setTimeoutId] = useState(null);
    const [countdown, setCountdown] = useState(3);


    // Fetch countries on component mount
    // ...

// Fetch countries on component mount
    useEffect(() => {
        fetch(`https://secure.geonames.org/countryInfoJSON?username=shrek123`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Countries:", data.geonames); // Log countries
                setCountries(data.geonames);
            }).catch((error) => {
            console.error('Error fetching countries:', error);
        });
    }, []);
    useEffect(() => {
        return () => {
            if (timeoutId) clearInterval(timeoutId);
        };
    }, [timeoutId]);

    const handleCountryChange = (e) => {
        const countryName = e.target.value;
        const selectedCountry = countries.find(country => country.countryName === countryName);
        if (selectedCountry) {
            setSelectedCountry(selectedCountry.countryName);
            setFormData(prevState => ({
                ...prevState,
                country: selectedCountry.countryName,
                city: '', // Reset city
            }));
            fetchCities(selectedCountry.countryCode); // Fetch cities for the new country
        } else {
            console.error(`Country '${countryName}' not found`);
            setSelectedCountry('');
            setFormData(prevState => ({
                ...prevState,
                country: '',
                city: '',
            }));
        }
    };





    const fetchCities = (countryCode) => {
        fetch(`https://secure.geonames.org/searchJSON?country=${countryCode}&username=shrek123&cities=cities1000`)
            .then((response) => response.json())
            .then((data) => {
                // Assuming 'geonames' is the array of cities
                setCities(data.geonames);
            }).catch((error) => {
            console.error('Error fetching cities:', error);
        });
    };


// Fetch cities when a country is selected
    useEffect(() => {
        if (selectedCountry) {
            const selectedCountryData = countries.find(country => country.countryName === selectedCountry);
            if (selectedCountryData) {
                fetchCities(selectedCountryData.countryCode);
            }
        }
    }, [selectedCountry, countries]); // Dependency on selectedCountry ensures fetchCities is called when it updates


// ...


// ... (rest of your component)


    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!formData.username.match(/^[A-Za-z]+$/)) {
            errors.username = "Имя пользователя должно содержать только буквы";
            formIsValid = false;
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(formData.email)) {
            errors.email = "Формат электронной почты неверен";
            formIsValid = false;
        }

        if (!formData.password) {
            errors.password = "Необходим пароль";
            formIsValid = false;
        }

        if (!formData.country) {
            errors.country = "Укажите страну";
            formIsValid = false;
        }

        if (!formData.city) {
            errors.city = "Укажите город";
            formIsValid = false;
        }

        console.log("Errors on form:", errors);
        setErrors(errors);
        return formIsValid;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name === 'city') {
            const selectedCity = cities.find(city => city.name === value);
            setRegions(selectedCity ? selectedCity.regions : []);
            setFormData(prevState => ({
                ...prevState,
                region: ''
            }));
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const handleTimeoutNavigation = () => {
        const id = setInterval(() => {
            setCountdown((currentCountdown) => {
                if (currentCountdown <= 1) {
                    clearInterval(id); // Clear the interval to stop the countdown
                    navigate('/login');
                    return 0;
                }
                return currentCountdown - 1;
            });
        }, 1000);
        setTimeoutId(id);  // Store the interval ID to clear it if needed
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        const { username, email, password, city, region } = formData;
        // The region and country might need to be handled specifically if there's a mismatch
        const postData = {
            username,
            email,
            password,
            city,
            region: region || selectedCountry, // Ensure this matches backend expectations
            role: 'user' // Explicitly set the role if necessary
        };

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();
            if (response.ok) {
                setShowModal(true);
                handleTimeoutNavigation();  // Setup timeout for navigation
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    email: data.message || 'Email already used, try another one please.'
                }));
            }
        } catch (error) {
            console.error('Failed to register:', error);
        }
    };



    return (
        <div className="register-page-container register-input">
            <form onSubmit={handleSubmit} className="register-form">
                <h1>РЕГИСТРАЦИЯ</h1>
                <div className="form-group">
                    <label htmlFor="username">Имя пользователя:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Введите ваше имя пользователя"
                    />
                    {errors.username && <div className="error">{errors.username}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Электронная почта:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Введите вашу электронную почту"
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Создайте пароль"
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="country">Страна:</label>
                    <select
                        id="country"
                        name="country"
                        value={formData.country}  // This should reflect formData.country to ensure the select shows the correct value
                        onChange={handleCountryChange}
                    >
                        <option value="">Выберите страну</option>
                        {countries.map((country) => (
                            <option key={country.countryCode} value={country.countryName}>
                                {country.countryName}
                            </option>
                        ))}
                    </select>
                </div>
                {/* ... */}
                <div className="form-group">
                    <label htmlFor="city">Город:</label>


                    <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    >
                        <option value="">Выберите город</option>
                        {cities && cities.map((city) => (
                            <option key={city.geonameId} value={city.name}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                    {errors.city && <div className="error">{errors.city}</div>}
                </div>
                <button type="submit" className="button-baseq">Зарегистрироваться</button>

            </form>
            {showModal && (
                <div className="modalss">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        backgroundColor: 'white',
                        padding: '20px',
                        width:'600px',
                        border: '3px solid #000000',
                    }}>

                        <h2 style={{marginLeft:'-50px',marginRight:'-50px'}}>Регистрация прошла успешно!</h2>
                        <p>Перенаправление на страницу входа через {countdown} секунд...</p>
                        <button onClick={() => {
                            clearInterval(timeoutId);
                            navigate('/login');
                        }} style={{ marginTop: '20px', padding: '10px 20px' }}>
                            Перейти к входу сейчас
                        </button>
                    </div>
                </div>

            )}

            <footer className="hoho-footer" style={{ backgroundColor: 'black', color: 'gold', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
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
                                EMAIL-SIGNUP
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default RegisterPage;
