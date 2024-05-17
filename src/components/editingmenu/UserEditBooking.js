import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import editp from '../../assets/images/editbooking/editt.png';
function UserEditBooking() {
    const [opacity, setOpacity] = useState(0);
    useEffect(() => {
        document.body.style.backgroundColor = 'white';

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
                header.style.height = window.pageYOffset > 100 ? '60px' : '100px';
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
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

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [countdown, setCountdown] = useState(3);
    const [bookingDetails, setBookingDetails] = useState({
        firstName: '',
        lastName: '',
        date: '',
        time: '10:00',
        numberOfPersons: 0,
        comment: ''
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
            else if (value > 7) error = 'Невозможно забронировать более чем на 6 человек.';
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
            minHeight: '100vh',  // Set minimum height for the container
            backgroundImage: `url(${editp})`,  // Set background image
            backgroundSize: 'cover',  // Contain the image within the container without cropping
            backgroundRepeat: 'no-repeat',  // Do not repeat the background image
            backgroundPosition: 'right center',  // Align the background image to the right
        },

        form: {
            padding: '50px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: 'white',
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
            border: '1px solid gold',
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
            .then(() => {
                alert('Booking updated successfully');
                navigate(-1); // Go back to the previous page
            })
            .catch(error => {
                console.error('Error updating booking:', error);
                alert('Error updating booking');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div style={styles.container}>
            <h3 style={{ color: 'gold', marginLeft:'800px' ,paddingTop:'50px'}}>Редактировать бронирование</h3>
            <form onSubmit={handleFormSubmit} style={styles.form}>

                <label>Время:</label>
                <select name="time" value={bookingData.time}  style={styles.select} onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}>
                    {renderTimeOptions()}
                </select>
                <div style={styles.error}>{errors.time}</div>
                <label>Количество человек:</label>
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
                    {isSubmitting ? 'Обработка...' : 'Редактировать'}
                </button>
            </form>
            <footer className="hoho-footer" style={{ backgroundColor: 'black', color: 'gold', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'350px',height: '80px' }}>
                <SocialIcons />
                <div style={{ textAlign: 'center' }}>
                    <a style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bold' }}>© 2024 LA RESERVE. Все права защищены.</a>
                </div>
                <div>
                    <ul style={{ listStyleType: 'none', marginRight: '20px', display: 'flex', gap: '40px' }}>
                        <li>
                            <NavLink to="/contact" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}
                                     onMouseOver={(e) => e.currentTarget.style.color='white'}
                                     onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                                КОНТАКТ
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}
                                     onMouseOver={(e) => e.currentTarget.style.color='white'}
                                     onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                                О НАС
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/subscribe" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}
                                     onMouseOver={(e) => e.currentTarget.style.color='white'}
                                     onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                                НОВОСТНАЯ РАССЫЛКА
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default UserEditBooking;