import './contact.css';
import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faInstagram, faVk } from "@fortawesome/free-brands-svg-icons";

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

const ContactForm = () => {
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
    const [isHovered, setIsHovered] = useState(false);
    const [opacity, setOpacity] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        subject: '',
        message: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        // Remove error for a field when user starts to type again.
        if (formErrors[name]) {
            setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!formData.name.trim()) errors.name = 'Требуется имя.';
        if (!formData.email) {
            errors.email = 'Требуется электронная почта.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Формат электронной почты неправильный.';
        }
        if (formData.phone && !/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/.test(formData.phone)) {
            errors.phone = 'Неправильный формат телефона. Пожалуйста, используйте только цифры и типичные символы, такие как тире или круглые скобки.';
        }
        if (!formData.subject.trim()) errors.subject = 'Тема обязательна.';
        if (!formData.message.trim()) errors.message = 'Требуется сообщение.';
        // Add more validations as needed

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };

        // Include the Authorization header only if the token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Form submitted successfully:', await response.text());
            // Clear form and errors after successful submission
            setFormData({
                name: '',
                email: '',
                phone: '',
                location: '',
                subject: '',
                message: ''
            });
            setFormErrors({});
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            setFormErrors({ submitError: 'Failed to submit the form. Please try again later.' });
        }
    };


    const buttonStyle = isHovered
        ? {
            backgroundColor: 'black',
            color: 'desired-hover-text-color', // You may want to replace this with an actual color value like 'white' or 'gold'

        }
        : {
            backgroundColor: 'white',
            marginLeft: '30px',
            paddingRight: '250px',
            paddingLeft: '190px',
            width: '5px',
            fontSize: '20px' , // Ensure consistent font size between styles
            border: '2px solid white'
        };

    useEffect(() => {
        setTimeout(() => {
            setOpacity(1);
            setIsLoading(false);
        }, 200);

        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <div id="contact-form" style={{ paddingBottom: '120px' }}>
                <h1>СВЯЗАТЬСЯ С НАМИ</h1>
                <p>Отправьте нам сообщение, и мы свяжемся с вами как можно скорее. С нетерпением жду Вашего ответа.</p>
                <div style={{ color: 'red' }}>{formErrors.submitError}</div>
                <div style={{ color: 'red' }}>{formErrors.name}</div>
                <input type="text" name="name" placeholder="ИМЯ" required onChange={handleChange} value={formData.name} />
                <div style={{ color: 'red' }}>{formErrors.email}</div>
                <input type="email" name="email" placeholder="Э-ПОЧТА" required onChange={handleChange} value={formData.email} />
                <div style={{ color: 'red' }}>{formErrors.phone}</div>
                <input type="tel" name="phone" placeholder="ТЕЛЕФОН" onChange={handleChange} value={formData.phone} />
                <div style={{ color: 'red' }}>{formErrors.location}</div>
                <input type="text" name="location" placeholder="МЕСТОПОЛОЖЕНИЕ" onChange={handleChange} value={formData.location} />
                <div style={{ color: 'red' }}>{formErrors.subject}</div>
                <input type="text" name="subject" placeholder="ТЕМА" required onChange={handleChange} value={formData.subject} />
                <div style={{ color: 'red' }}>{formErrors.message}</div>
                <textarea name="message" placeholder="СООБЩЕНИЕ" required onChange={handleChange} value={formData.message}></textarea>
                <button

                    className="button-basess"
                    onClick={handleSubmit}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    ОТПРАВИТЬ
                </button>
            </div>
            <footer className="hoho-footer" style={{ backgroundColor: 'black', color: 'gold', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px', marginTop: '212px' }}>
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
};

export default ContactForm;
