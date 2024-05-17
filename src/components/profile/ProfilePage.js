import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import { useAuth } from '../../AuthContext';
import ConfirmationModal from './ConfirmationModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink, Navigate,useNavigate } from "react-router-dom";

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

function ProfilePage() {
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
    const { setToken } = useAuth();
    const [user, setUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentBookingId, setCurrentBookingId] = useState(null);
    const auth = useAuth();
    const handleLogout = () => {
        auth.logout();
        navigate('/login');  // Redirect to login page after logout
    };
    useEffect(() => {
        fetchUserProfile();
    }, [setToken]);

    const navigate = useNavigate();

    const handleEditBooking = (bookingId) => {
        navigate(`/edit-booking/${bookingId}`); // Navigate to the edit booking page
    };


    const fetchUserProfile = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        fetch('/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => response.json())
            .then(data => {
                if (data && data.bookings) {
                    // Sort bookings by date
                    data.bookings.sort((a, b) => new Date(a.date) - new Date(b.date));
                }
                setUser(data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
                localStorage.removeItem('token');
                setToken(null);
                window.location.href = '/login';
            });
    };

    const handleDeleteBooking = bookingId => {
        setCurrentBookingId(bookingId);
        setShowConfirmModal(true);
    };

    const confirmDelete = () => {
        const token = localStorage.getItem('token');
        fetch(`/api/auth/bookings/${currentBookingId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            setShowConfirmModal(false);
            if (response.ok) {
                fetchUserProfile(); // Refresh user data after deletion
            } else {
                alert('Failed to delete booking');
            }
        });
    };
    const headerStyle = {
        color: '#333',  // Set the text color
        textAlign: 'center',  // Center align text
        fontFamily: 'Arial, sans-serif',  // Specify the font family
        fontSize: '24px',  // Set font size
        marginTop: '30px',  // Add top margin
        marginLeft:'20px'
    };
    return (
        <div className="profile-containers" >
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmDelete}
            />
            {user ? (
                <div className="profile-details">
                    <h1>ДОБРО ПОЖАЛОВАТЬ </h1>
                    <h77 style={{lineHeight: '2'}}>{user.username}</h77>
                    <p><strong>EMAIL:</strong> {user.email}</p>
                    <p><strong>ГОРОД:</strong> {user.city}</p>
                    <p><strong>РЕГИОН:</strong> {user.region}</p>
                    <h2 style={headerStyle}>ВАШИ БРОНИРОВАНИЯ</h2>
                    {user.bookings && user.bookings.length > 0 ? (
                        <ul>
                            {user.bookings.map(booking => (
                                <li key={booking.id}>
                                    <div><strong>Фамилия:</strong> {booking.lastName}</div>
                                    <div><strong>Дата:</strong> {booking.date}</div>
                                    <div><strong>Время:</strong> {booking.time}</div>
                                    <div><strong>Количество человек:</strong> {booking.numberOfPersons}</div>
                                    <div><strong>Комментарии:</strong> {booking.comment}</div>
                                    <button  className="edit-btn" onClick={() => handleEditBooking(booking.id)}>РЕДАКТИРОВАТЬ</button>
                                    <button className="delete-btn" onClick={() => handleDeleteBooking(booking.id)}>ОТМЕНА</button>

                                </li>
                            ))}
                        </ul>
                    ) : <p>No bookings made.</p>}
                    <button className="logout-btn" onClick={handleLogout}>ВЫЙТИ</button>
                </div>
            ) : <p>Loading...</p>}
            <footer className="hoho-footer" style={{ backgroundColor: 'black', color: 'gold', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'550px',height: '80px' }}>
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

export default ProfilePage;
