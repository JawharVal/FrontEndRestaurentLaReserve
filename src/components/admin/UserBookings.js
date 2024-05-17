import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import './AdminPanel.css';
import adming from '../../assets/images/admins/admin.jpg';
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink } from "react-router-dom";
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

function UserBookings() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userBookings, setUserBookings] = useState([]);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        fetchUserDetails();
        fetchBookings();
    }, [userId]);

    const fetchUserDetails = () => {
        axios.get(`/api/auth/${userId}`)
            .then(response => setUserDetails(response.data))
            .catch(error => console.error('Error fetching user details:', error));
    };

    const fetchBookings = () => {
        axios.get(`/api/auth/bookings/user/${userId}`)
            .then(response => {
                const sortedBookings = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
                setUserBookings(sortedBookings);
            })
            .catch(error => console.error('Error fetching bookings:', error));
    };

    const deleteBooking = (bookingId) => {
        if (window.confirm('Вы уверены, что хотите удалить это бронирование?')) {
            axios.delete(`/api/auth/bookings/${bookingId}`)  // Ensure this endpoint is set up to delete bookings
                .then(() => {
                    alert('Booking deleted successfully');
                    fetchBookings();  // Refresh bookings list after deletion
                })
                .catch(error => {
                    console.error('Failed to delete booking:', error);
                    alert('Failed to delete booking');
                });
        }
    };

    const navigateToEditBooking = (bookingId) => {
        navigate(`/admin/user/${userId}/edit-booking/${bookingId}`);
    };

    const styles = {
        button: {
            border: '4px solid #ffffff',
            backgroundColor: '#000000',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.3s, color 0.3s, transform 0.3s, border-radius 0.3s'
        },
        buttone: {

            border: '4px solid #ffffff',
            backgroundColor:  'lightblue',
            color: 'black',
            cursor: 'pointer',

            transition: 'background-color 0.3s, color 0.3s, transform 0.3s, border-radius 0.3s'
        },
        buttond: {

            border: '4px solid #ffffff',
            backgroundColor:  'salmon',
            color: 'white',
            cursor: 'pointer',

            transition: 'background-color 0.3s, color 0.3s, transform 0.3s, border-radius 0.3s'
        },
    };

    return (
        <div style={{ backgroundImage: `url(${adming})`}}>
            <div className="admin-panel" style={{ paddingTop: '100px'}}>
                <h3 style={{ color: 'gold', marginLeft: '800px', paddingTop: '50px'}}>Бронирование на: {userDetails.username}</h3>
                <button onClick={() => navigate(`/add-booking/${userId}`)} style={styles.button}>Добавить бронирование</button>
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Дата</th>
                        <th>Время</th>
                        <th>Идентификатор категории</th>  {/* Added Category ID */}
                        <th>Идентификатор ресторана</th>
                        <th>Люди</th>
                        <th>Комментарии</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userBookings.map(booking => (
                        <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.date}</td>
                            <td>{booking.time}</td>
                            <td>{booking.categoryId}</td>  {/* Display Category ID */}
                            <td>{booking.restaurantId}</td>
                            <td>{booking.numberOfPersons}</td>
                            <td>{booking.comment}</td>
                            <td>
                                <button onClick={() => navigateToEditBooking(booking.id)} style={styles.buttone}>Редактировать</button>
                                <button onClick={() => deleteBooking(booking.id)} style={styles.buttond}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <footer className="hoho-footer" style={{ backgroundColor: 'black', color: 'gold', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'250px', height: '80px' }}>
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

export default UserBookings;
