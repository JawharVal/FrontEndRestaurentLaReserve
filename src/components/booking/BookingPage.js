import React, { useState, useEffect } from 'react';
import reserveImage from '../../assets/images/booking/reserve.jpg';
import backgg from '../../assets/images/booking/backg.JPG'; // Adjust the path if necessary
import "./ReservationForm.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

function BookingPage() {
    const [opacity, setOpacity] = useState(0);
    useEffect(() => {
        document.body.style.backgroundColor = 'black';

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
    const [bookingDetails, setBookingDetails] = useState({
        firstName: '',
        lastName: '',
        date: '',
        time: '10:00', // Initialize with the first available time slot
        numberOfPersons: 0,
        comment: '',
        restaurantId: '' // Added to manage the restaurant ID
    });
    const [categories, setCategories] = useState([]);
    const [showTermsError, setShowTermsError] = useState(false);
    const [hover, setHover] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const [availability, setAvailability] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [countdown, setCountdown] = useState(3);
    const navigate = useNavigate(); // use useNavigate here
    const [timeoutId, setTimeoutId] = useState(null);
    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []); // Empty dependen

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await fetch('/restaurants');
                const data = await res.json();
                setRestaurants(data);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
            }
        };

        fetchRestaurants();
    }, []);
    useEffect(() => {
        if (bookingDetails.date) {
            const fetchAvailability = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`/api/auth/bookings/check-availability?date=${bookingDetails.date}`);
                    if (!response.ok) throw new Error('Failed to fetch availability');
                    const data = await response.json();
                    setAvailability(data);
                } catch (error) {
                    console.error('Error fetching availability:', error);
                    alert('Error fetching availability. Please try again.');
                } finally {
                    setLoading(false);
                }
            };

            fetchAvailability();
        }
    }, [bookingDetails.date]);

    const styles = {
        container: {
            paddingTop: "10px",
            justifyContent: 'center',
            paddingLeft:'500px',
            alignItems: 'center',
            width: '100%',
            minHeight: '100vh',
            background: '#f5f5f5',
            position: 'relative', // Used as an anchor for the absolutely positioned pageContainer
            background: `url(${backgg}) no-repeat center center fixed`, // Updated this line
            backgroundSize: 'cover',
        },
        pageContainer: {
            display: 'flex',
            marginLeft: '300px', // Change this value as needed
            maxWidth: '920px',
            width: '100%',
paddingTop:'50px',
            paddingBottom:'50px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            borderRadius: '8px',
            overflow: 'hidden',
        },
        imageSection: {
            backgroundImage: `url(${reserveImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            width: '500px',
            minHeight: '400px',
        },
        formSection: {
            width: '400px',
            paddingRight:'30px',
            marginLeft:'10px',
            marginRight:'5px',
            padding: '0px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'white',

        },
        input: {

            padding: '0px',
            margin: '10px 0',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: 'calc(100% - 20px)', // subtract padding
        },
        button: {
            padding: '10px 20px',
            margin: '10px 0',
            borderRadius: hover ? '5px' : '4px',
            border: '4px solid #ffffff',
            backgroundColor: hover ? '#8cfd41' : '#4CAF50',
            color: hover ? '#ffffff' : 'white',
            cursor: 'pointer',
            transform: hover ? 'scale(1.05)' : 'none',
            transition: 'background-color 0.3s, color 0.3s, transform 0.3s, border-radius 0.3s'
        },

        heading: {
            textAlign: 'center',
            color: '#d35400',
            marginBottom: '-100px',
        },

        form: {
            display: 'grid',
            gridGap: '10px',
            padding: '20px',
        },

        select: {
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
        },
        textarea: {
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
            height: '100px',
            resize: 'vertical',
        },
        error: {
            color: 'red',
            fontSize: '0.8rem',
            height: '20px', // Ensure the layout doesn't jump when errors appear
        }
    };

    const validateInput = (name, value) => {
        let error = '';
        if (name === 'firstName' || name === 'lastName') {
            if (!value) error = 'This field is required.';
            else if (!/^[a-zA-Z ]+$/.test(value)) error = 'Разрешены только буквы.';
        } else if (name === 'numberOfPersons') {
            if (value < 1) error = 'At least one person is required.';
            else if (value > 6) error = 'Невозможно забронировать более чем на 6 человек.';
        } else if (name === 'date') {
            const inputDate = new Date(value);
            inputDate.setHours(0, 0, 0, 0); // Set time to midnight
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set time to midnight
            const dayOfWeek = inputDate.getDay();
            if (inputDate <= currentDate) error = 'Дата должна быть как минимум за один день вперед.';
            else if (dayOfWeek === 0 || dayOfWeek === 6) error = 'Бронирование доступно только с пон по пятн.';
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        const error = validateInput(name, value);
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
        setBookingDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const renderCategoryOptions = () => {
        return categories.map(category => (
            <option key={category.id} value={category.id}>
                {category.name}
            </option>
        ));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!agreedToTerms) {  // Check if the terms are agreed to
            setShowTermsError(true);
            return; // Prevent the form from submitting
        }
        if (isSubmitting) {
            alert("Please wait, your booking is being processed.");
            return;
        }
        setIsSubmitting(true);


        // Check if the booking exists for the selected date
        const checkBookingExists = async () => {
            try {
                const response = await fetch(`/api/auth/bookings/exists?date=${bookingDetails.date}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                return data; // Should return true or false
            } catch (error) {
                console.error('Error checking existing booking:', error);
                alert('Error checking booking availability. Please try again.');
                setIsSubmitting(false); // Reset submission state
                return false;
            }
        };

        const exists = await checkBookingExists();
        if (exists) {
            setErrors(prev => ({ ...prev, date: 'Вы уже сделали бронирование на эту дату.' }));
            setIsSubmitting(false); // Reset submission state
            return;
        }

        let valid = true;
        Object.keys(bookingDetails).forEach(key => {
            const error = validateInput(key, bookingDetails[key]);
            if (error) valid = false;
            setErrors(prevErrors => ({ ...prevErrors, [key]: error }));
        });

        if (!valid) {
            setIsSubmitting(false); // Reset submission state
            return;
        }

        // Existing booking check passed, proceed with creating a new booking
        try {
            const response = await fetch('/api/auth/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(bookingDetails)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create booking');
            }

            // Update availability state immediately after successful booking creation
            const updatedAvailability = { ...availability };
            updatedAvailability[bookingDetails.time] = Math.max(0, (availability[bookingDetails.time] || 2) - 1);
            setAvailability(updatedAvailability);

            const result = await response.json();
            setModalMessage(`Booking created successfully! Booking ID: ${result.id}`);
            setShowModal(true);
            handleTimeoutNavigation();
        } catch (error) {
            console.error('Error creating booking:', error);
            setModalMessage(`Error creating booking: ${error.message}`);
            setShowModal(true);
        } finally {
            setIsSubmitting(false); // Reset submission state regardless of outcome
        }
    };



    // Inside renderTimeOptions function
    // Inside renderTimeOptions function
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
        backgroundImage: `url(${reserveImage})`,
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

    const inputStyle = {
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%'
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
    const labelTranslations = {
        firstName: 'Имя',
        lastName: 'Фамилия',
        date: 'Дата',
        numberOfPersons: 'Количество человек',
        comment: 'Комментарий'
    };
    return (
        <div style={styles.container}>
            <div style={styles.pageContainer}>
                <div style={styles.imageSection} />
                <div style={styles.formSection}>
                    <h77 style={styles.heading}>Бронирование Форма</h77>
                    {/* The rest of your form goes here, apply styles.input to each input and styles.button to your button */}
                    <form onSubmit={(handleSubmit)} style={{ width: '80%' }}>
                        {['firstName', 'lastName', 'date', 'numberOfPersons', 'comment'].map(field => (
                            <label key={field}>
                                {labelTranslations[field]}:
                                <input
                                    type={field === 'date' ? 'date' : field === 'numberOfPersons' ? 'number' : 'text'}
                                    name={field}
                                    value={bookingDetails[field]}
                                    onChange={(handleChange) => setBookingDetails({
                                        ...bookingDetails,
                                        [handleChange.target.name]: handleChange.target.value
                                    })}
                                    required={field !== 'comment'}
                                    min={field === 'numberOfPersons' ? 1 : undefined}
                                    max={field === 'numberOfPersons' ? 20 : undefined}
                                    style={inputStyle}
                                />
                                <div style={styles.error}>{errors[field]}</div>
                            </label>
                        ))}
                        <div>
                            <label>Время:


                                <select name="time" value={bookingDetails.time} onChange={handleChange} required
                                        style={inputStyle}
                                >
                                    {renderTimeOptions()}
                                </select>
                                <div style={inputStyle,styles.error}>{errors.time}</div>


                            </label>
                            <label>Категории:
                            <select name="categoryId" value={bookingDetails.categoryId || ''} onChange={handleChange} style={inputStyle}>
                                <option value="">Выберите категорию меню (необязательно)</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </label>
                            <label>Ресторан:</label>
                            <select
                                value={bookingDetails.restaurantId}
                                onChange={(e) => setBookingDetails({ ...bookingDetails, restaurantId: e.target.value })}
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

                        </div>
                        <div>
                            <input
                                id="termsCheckbox"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                style={{ marginRight: '10px' }}
                            />
                            <label htmlFor="termsCheckbox">
                                Я принимаю <span onClick={() => setTermsModalVisible(true)} style={{fontSize:'20px', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>условия пользовательского соглашения</span>
                            </label>
                        </div>
                        <button
                            style={styles.button}
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            onClick={() => {
                                if (!agreedToTerms) {
                                    setShowTermsError(true);
                                    setTimeout(() => setShowTermsError(false), 5000); // Optional: Auto-hide error after 5 seconds
                                }
                            }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Обработка...' : 'Бронировать'}
                        </button>
                        {showTermsError && !agreedToTerms && (
                            <p style={{ color: 'red' }}>Чтобы продолжить, вы должны согласиться с Условиями использования.</p>
                        )}
                        {termsModalVisible && (
                            <>
                                <div style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    zIndex: 999
                                }} onClick={() => setTermsModalVisible(false)} />

                                <div style={{
                                    position: 'fixed',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backgroundColor: 'white',
                                    padding: '20px',
                                    zIndex: 1000,
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                                    width: '80%',
                                    maxHeight: '90%',
                                    overflowY: 'auto'
                                }}>
                                    <h2 style={{
                                        marginLeft:'650px'}}>Принятие Условий использования</h2>
                                    <p>
                                        Продолжая бронирование, вы соглашаетесь со следующими условиями использования:<br/><br/>
                                        <strong>Политика бронирования:</strong> Вы можете забронировать один или несколько столов в зависимости от наличия. Каждое бронирование сохраняется максимум на 30 минут после запланированного времени, после чего стол может быть предоставлен посетителям без бронирования, если вы не прибыли.<br/><br/>
                                        <strong>Политика отмены бронирования:</strong> Хотя за отмену бронирования плата не взимается, мы просим вас отменить ваше бронирование как минимум за 3 часов до изменения ваших планов. Это вежливость помогает нам управлять нашими местами и эффективно обслуживать других гостей.<br/><br/>
                                        <strong>Политика неприхода:</strong> Повторное неявление на бронирование без предварительной отмены может привести к ограничениям в вашей способности делать будущие бронирования.<br/><br/>
                                        <strong>Использование данных и конфиденциальность:</strong> Ваши личные данные, собранные в процессе бронирования, будут использоваться исключительно для управления вашим бронированием и улучшения нашего сервиса. Мы уважаем вашу конфиденциальность и обязуемся защищать ваши личные данные в соответствии с нашей политикой конфиденциальности.<br/><br/>
                                        <strong>Ответственность:</strong> Ресторан не несет ответственности за личные вещи, потерянные или украденные на территории заведения.<br/><br/>
                                        <strong>Изменение условий:</strong> Ресторан оставляет за собой право изменять данные условия и положения без предварительного уведомления. Актуальные условия всегда доступны на нашем веб-сайте.
                                    </p>
                                    <button onClick={() => setTermsModalVisible(false)} style={{ marginTop: '20px' }}>
                                        Закрыть
                                    </button>
                                </div>
                            </>
                        )}

                        {termsModalVisible && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                zIndex: 999
                            }} onClick={() => setTermsModalVisible(false)} />
                        )}
                    </form>
                </div>

            </div>
            {showModal && (
                <div className="modalss">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        backgroundColor: 'white',
                        padding: '10px',
                        width:'600px',
                        border: '3px solid #000000',
                    }}>
                        <h2 style={{marginLeft: '-20px'}}>Бронирование успешно! </h2>
                        <p>Перенаправление на страницу профиля в {countdown} секунды...</p>
                        <button onClick={() => {
                            clearInterval(timeoutId);
                            navigate('/profile');
                        }} style={{ marginTop: '20px', padding: '10px 10px' }}>
                            Посмотреть бронирования сейчас
                        </button>
                    </div>
                </div>

            )}
            <footer className="hoho-footer" style={{ backgroundColor: 'black', color: 'gold', marginLeft: '-500px',marginRight: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
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


export default BookingPage;
