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
function EditBooking() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [availability, setAvailability] = useState({});
    const [errors, setErrors] = useState({});

    const [bookingData, setBookingData] = useState({

        date: '',
        time: '',
        numberOfPersons: '',
        comment: ''
    });

    useEffect(() => {
        if (bookingData.date) {
            fetchAvailability(bookingData.date);  // Fetch availability for the selected date
        }
    }, [bookingData.date]);

    const fetchAvailability = (date) => {
        axios.get(`/api/auth/bookings/check-availability?date=${date}`)
            .then(response => {
                setAvailability(response.data);
            })
            .catch(error => {
                console.error('Error fetching availability:', error);
                alert('Error fetching availability. Please try again.');
            });
    };

    const validateInput = (name, value) => {
        let error = '';
        if (name === 'numberOfPersons') {
            if (value < 1) error = 'At least one person is required.';
            else if (value > 20) error = 'Cannot book for more than 20 people.';
        } else if (name === 'date') {
            const inputDate = new Date(value);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            if (inputDate <= currentDate) error = 'Date must be at least one day in advance.';
        } else if (name === 'time') {
            if (availability[value] === 0) {
                error = 'This time slot is fully booked.';
            }
        }
        return error;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        let valid = true;
        Object.keys(bookingData).forEach(key => {
            const error = validateInput(key, bookingData[key]);
            if (error) valid = false;
            setErrors(prevErrors => ({ ...prevErrors, [key]: error }));
        });

        if (!valid) {
            alert('Please correct the errors before submitting.');
            return;
        }

        updateBooking();
    };

    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId]);

    const fetchBookingDetails = () => {
        axios.get(`/api/auth/bookings/${bookingId}`)
            .then(response => {
                setBookingData(response.data);
            })
            .catch(error => console.error('Error fetching booking details:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };

    const updateBooking = () => {
        axios.put(`/api/auth/bookings/${bookingId}`, bookingData)
            .then(() => {
                alert('Booking updated successfully');
                navigate(-1);  // Go back to the previous page
            })
            .catch(error => {
                console.error('Error updating booking:', error);
                alert('Error updating booking');
            });
    };
    const isButtonDisabled = () => {
        // Check if the time is set and not disabled due to being fully booked
        const timeIsSelected = bookingData.time && availability[bookingData.time] && availability[bookingData.time] > 0;
        return !timeIsSelected;  // Return true if the time is not selected or if no tables are available
    };
    const [hover, setHover] = useState(false);
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
                    {timeString} - {isAvailable ? `Tables available: ${tablesAvailable}` : 'Full'}
                </option>
            );
        }

        return options;
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
    return (
        <div style={styles.container}>
            <h1 style={{ color: 'gold', marginLeft:'1000px' ,paddingTop:'50px'}}>Редактировать бронирование</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                updateBooking();
            }}>
                <label>Date:</label>
                <input type="date" name="date" value={bookingData.date} onChange={handleInputChange} />
                <label>Time:</label>
                <select name="time" value={bookingData.time} onChange={handleInputChange}>
                    {renderTimeOptions()}
                </select>
                <label>Number of Persons:</label>
                <input type="number" name="numberOfPersons" value={bookingData.numberOfPersons} onChange={handleInputChange} />
                <label>Comments:</label>
                <textarea name="comment" value={bookingData.comment} onChange={handleInputChange}></textarea>
                <button type="submit" disabled={isButtonDisabled()}>Update Booking</button>
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

export default EditBooking;
