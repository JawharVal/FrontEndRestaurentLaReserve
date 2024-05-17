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

function UserEditBooking() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState({
        date: '',
        time: '',
        numberOfPersons: '',
        comment: ''
    });
    const [availability, setAvailability] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hover, setHover] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const [restaurants, setRestaurants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [countdown, setCountdown] = useState(3);
    const [categories, setCategories] = useState([]);
    const [bookingDetails, setBookingDetails] = useState({
        firstName: '',
        lastName: '',
        date: '',
        time: '10:00',
        numberOfPersons: 0,
        comment: '',
        categoryId: '',
        restaurantId:''
    });
    const [timeoutId, setTimeoutId] = useState(null);
    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId]);

    useEffect(() => {
        if (bookingData.date) {
            fetchAvailability(bookingData.date);
        }
    }, [bookingData.date]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchRestaurants = () => {
        axios.get('/restaurants') // Adjust this endpoint according to your API structure
            .then(response => {
                setRestaurants(response.data);
            })
            .catch(error => {
                console.error('Error fetching restaurants:', error);
                alert('Failed to load restaurants.');
            });
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);


    const fetchCategories = () => {
        axios.get('/api/categories') // Make sure this endpoint returns all categories
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                alert('Failed to load categories.');
            });
    };

    const handleCategoryChange = (event) => {
        const { value } = event.target;
        setBookingData(prevData => ({
            ...prevData,
            categoryId: value
        }));
    };


    const fetchBookingDetails = () => {
        axios.get(`/api/auth/bookings/${bookingId}`)
            .then(response => {
                setBookingData(response.data);
            })
            .catch(error => {
                console.error('Error fetching booking details:', error);
                alert('Failed to load booking details.');
            });
    };

    const fetchAvailability = (date) => {
        axios.get(`/api/auth/bookings/check-availability?date=${date}`)
            .then(response => {
                setAvailability(response.data);
            })
            .catch(error => {
                console.error('Error fetching availability:', error);
                alert('Failed to fetch availability.');
            });
    };
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
    const inputStyle = {
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%',
        backgroundColor:'white'
    };


    const handleTimeoutNavigation = () => {
        const id = setInterval(() => {
            setCountdown((currentCountdown) => {
                if (currentCountdown <= 1) {
                    clearInterval(id); // Clear the interval to stop the countdown
                    navigate('/profile');
                    return 0;
                }
                return currentCountdown - 1;
            });
        }, 1000);
        setTimeoutId(id);  // Store the interval ID to clear it if needed
    };


    const checkBookingExists = async () => {
        try {
            const url = `/api/auth/bookings/exists?date=${bookingData.date}&excludeBookingId=${bookingId}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.exists;  // Assuming the API returns an object with a boolean property 'exists'
        } catch (error) {
            console.error('Error checking existing booking:', error);
            alert('Error checking booking availability. Please try again.');
            setIsSubmitting(false);
            return false;
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
                    {timeString} - {isAvailable ? `Доступные столы: ${tablesAvailable}` : 'Full'}
                </option>
            );
        }

        return options;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const bookingConflict = await checkBookingExists();
        if (bookingConflict) {
            setErrors({ ...errors, date: 'Another booking already exists on this date.' });
            setIsSubmitting(false);
            return;
        }

        // Your existing validation and update logic
        let valid = true;
        const newErrors = {};
        Object.keys(bookingData).forEach(key => {
            const error = validateInput(key, bookingData[key]);
            if (error) {
                newErrors[key] = error;
                valid = false;
            }
        });

        setErrors(newErrors);
        if (!valid) {
            setIsSubmitting(false);
            alert('Please correct the errors before submitting.');
            return;
        }

        updateBooking();
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

    const updateBooking = () => {
        axios.put(`/api/auth/bookings/${bookingId}`, bookingData)
            .then(response => {
                alert('Booking updated successfully');
                navigate(-1); // Navigate back
            })
            .catch(error => {
                console.error('Error updating booking:', error);
                console.error('Detailed error:', error.response.data); // Log detailed error message if available
                alert('Error updating booking: ' + (error.response.data || "Unknown error"));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const containerWithImage = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        paddingTop: '50px',
        paddingBottom: '50px'
    };

    const imageStyle = {
        width: '50%',
        height: '500px', // for example, give it a fixed height or min-height
        display: 'flex',

        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px',
    };

    const formContainerStyle = {
        width: '50%', // Assuming the form should take the other half
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    };


    const buttonStyle = {
        padding: '10px 20px',
        margin: '10px 0',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: 'white',
        cursor: 'pointer'
    };


    return (
        <div style={styles.container}>
            <h3 style={{ color: 'gold', marginLeft:'800px' ,paddingTop:'50px'}}>Редактировать бронирование</h3>
            <form onSubmit={handleFormSubmit} style={styles.form}>
                <label>Имя:</label>
                <input type="text" name="firstName" value={bookingData.firstName} onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })} />
                <div>{errors.firstName}</div>

                <label>Фамилия:</label>
                <input type="text" name="lastName" value={bookingData.lastName} onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })} />
                <div>{errors.lastName}</div>
                <label>Категория:</label>
                <select value={bookingData.categoryId} onChange={handleCategoryChange} style={styles.select}>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <label>Ресторан:</label>
                <select
                    value={bookingData.restaurantId}
                    onChange={(e) => setBookingData({ ...bookingData, restaurantId: e.target.value })}
                    style={styles.select}
                    required
                >
                    <option value="">Выберите местоположение</option>
                    {restaurants.map(restaurant => (
                        <option key={restaurant.id} value={restaurant.id}>
                            {restaurant.locationName}
                        </option>
                    ))}
                </select>
                <label>Время:</label>
                <select name="time" value={bookingData.time}  style={styles.select} onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}>
                    {renderTimeOptions()}
                </select>
                <div style={styles.error}>{errors.time}</div>
                <label>Количество персон:</label>
                <input type="number" name="numberOfPersons" style={styles.input} value={bookingData.numberOfPersons} onChange={(e) => setBookingData({ ...bookingData, numberOfPersons: e.target.value })} />
                <div style={styles.error}>{errors.numberOfPersons}</div>
                <label>Комментарии:</label>
                <textarea name="comment" value={bookingData.comment} style={styles.textarea} onChange={(e) => setBookingData({ ...bookingData, comment: e.target.value })}></textarea>
                <div style={styles.error}>{errors.comment}</div>
                <button
                    style={styles.button}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Обработка...' : 'Редактировать бронирование'}
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

export default UserEditBooking;