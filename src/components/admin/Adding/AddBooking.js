import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import adming from '../../../assets/images/admins/admin.jpg';
 // Adjust the path if necessary
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
function AddBooking() {
    const { userId } = useParams();
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [hover, setHover] = useState(false);
    const [bookingDetails, setBookingDetails] = useState({
        firstName: '',
        lastName: '',
        date: '',
        time: '10:00', // Initialize with the first available time slot
        numberOfPersons: 1,
        comment: '',
        categoryId: '',
        restaurantId:''
    });
    const [availability, setAvailability] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (bookingDetails.date) {
            fetchAvailability(bookingDetails.date);
        }
    }, [bookingDetails.date]);

    const fetchAvailability = async (date) => {
        try {
            const response = await axios.get(`/api/auth/bookings/check-availability?date=${date}`);
            setAvailability(response.data);
        } catch (error) {
            console.error('Error fetching availability:', error);
            alert('Error fetching availability. Please try again.');
        }
    };
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                alert('Failed to load categories.');
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get('/restaurants'); // Ensure this endpoint exists
                setRestaurants(response.data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                alert('Failed to load restaurants.');
            }
        };

        fetchRestaurants();
    }, []);


    const validateInput = (name, value) => {
        let error = '';
        if (name === 'firstName' || name === 'lastName') {
            if (!value) error = 'This field is required.';
            else if (!/^[a-zA-Z ]+$/.test(value)) error = 'Only letters are allowed.';
        } else if (name === 'numberOfPersons') {
            if (value < 1) error = 'At least one person is required.';
            else if (value > 20) error = 'Cannot book for more than 20 people.';
        } else if (name === 'date') {
            const inputDate = new Date(value);
            inputDate.setHours(0, 0, 0, 0); // Set time to midnight
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set time to midnight
            const dayOfWeek = inputDate.getDay();
            if (inputDate <= currentDate) error = 'Date must be at least one day in advance.';
            else if (dayOfWeek === 0 || dayOfWeek === 6) error = 'Booking is only available from Monday to Friday.';
        } else if (name === 'time') {
            if (parseInt(value.split(':')[0]) < 9 || parseInt(value.split(':')[0]) > 16) {
                error = 'Booking time must be between 9 AM and 5 PM.';
            }
            if (availability[value] === 0) {
                error = 'This time slot is fully booked.';
            }
        }
        return error;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        const error = validateInput(name, value);
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
        setBookingDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
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
            padding: '20px',
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) {
            alert('Please wait, your booking is being processed.');
            return;
        }
        setIsSubmitting(true);

        // Add restaurantId to the bookingDetails directly
        const updatedBookingDetails = {
            ...bookingDetails,
            restaurantId: selectedRestaurantId,
            categoryId: selectedCategoryId,
        };

        let valid = true;
        Object.keys(updatedBookingDetails).forEach(key => {
            const error = validateInput(key, updatedBookingDetails[key]);
            if (error) {
                valid = false;
                setErrors(prevErrors => ({ ...prevErrors, [key]: error }));
            }
        });

        if (!valid) {
            alert('Please correct the errors before submitting.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(`/api/auth/bookings/admin/user/${userId}`, updatedBookingDetails);
            alert('Booking created successfully! Booking ID: ' + response.data.id);
            navigate(`/admin/user/${userId}/bookings`);
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Error creating booking: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };


    const renderTimeOptions = () => {
        const startHour = 10; // Booking starts at 10 AM
        const endHour = 16; // Last booking at 4 PM
        const step = 2; // Set the step to 2 hours
        const options = [];

        for (let hour = startHour; hour <= endHour; hour += step) {
            const timeString = `${hour}:00`;
            const tablesAvailable = availability[timeString] || 0; // Handle cases where availability is undefined
            const isAvailable = tablesAvailable > 0;

            options.push(
                <option key={timeString} value={timeString} disabled={!isAvailable}>
                    {timeString} - {isAvailable ? `Доступные столы: ${tablesAvailable}` : 'Полный'}
                </option>
            );
        }

        return options;
    };


    return (
        <div style={styles.container}>
            <h3 style={{ color: 'gold', marginLeft:'630px' ,paddingTop:'50px'}}>Добавить бронирование для пользователя: {userId}</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label>Имя:</label>
                    <input type="text" name="firstName" value={bookingDetails.firstName} onChange={handleChange} required />
                    <div>{errors.firstName}</div>

                <label>Фамилия:</label>
                    <input type="text" name="lastName" value={bookingDetails.lastName} onChange={handleChange} required />
                    <div>{errors.lastName}</div>

                <label>Дата:</label>
                    <input type="date" name="date" value={bookingDetails.date} onChange={handleChange} required />

                <label>Время:</label>
                    <select name="time" value={bookingDetails.time} onChange={handleChange} required>
                        {renderTimeOptions()}
                    </select>
                    <div style={styles.error}>{errors.time}</div>

                <label>Количество персон:</label>
                    <input type="number" name="numberOfPersons" value={bookingDetails.numberOfPersons} onChange={handleChange} required />

                <label>Ресторан:</label>
                <select value={selectedRestaurantId} onChange={(e) => setSelectedRestaurantId(e.target.value)} required>
                    <option value="">Выберите ресторан</option>
                    {restaurants.map((restaurant) => (
                        <option key={restaurant.id} value={restaurant.id}>
                            {restaurant.name}
                        </option>
                    ))}
                </select>
                <label>Категория:</label>
                <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} required>
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <label>Комментарии:</label>
                    <textarea name="comment" value={bookingDetails.comment} onChange={handleChange}></textarea>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Обработка...' : 'Отправить бронирование'}
                </button>
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

export default AddBooking;