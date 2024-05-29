import './newsl.css';
import React, {useEffect, useState} from 'react';
import emailjs from 'emailjs-com';
import chef from '../../assets/images/newsletter/new.jpg';
import  backkhoho from '../../assets/images/homepage/backkhoho.png';
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookSquare, faInstagram, faVk} from "@fortawesome/free-brands-svg-icons";
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

const NewsletterForm = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            setOpacity(1);
        }, 200);

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
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [emailError, setEmailError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));

        if (name === 'email') {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            setEmailError(!isValidEmail);
            if (!isValidEmail) {
                setErrorMessage('Пожалуйста, введите действительный адрес электронной почты.');
            } else {
                setErrorMessage('');
            }
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError) {
            return;
        }
        if (isSubmitting) {
            alert("Пожалуйста, подождите, ваше бронирование обрабатывается.");
            return;
        }
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await fetch('http://localhost:8081/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email
                })
            });

            if (response.status === 400) {
                setErrorMessage(await response.text());
            } else if (response.status === 200) {
                const result = await response.json();
                const promoCode = result.promoCode;
                emailjs.send('service_ulut', 'template_bem', {
                    to_name: formData.firstName + ' ' + formData.lastName,
                    to_email: formData.email,
                    message: 'Congratulations! Your unique promo code is: ' + promoCode
                }, 'UT5KAivb7al')

                    .then(function (response) {
                        console.log('SUCCESS!', response.status, response.text);
                    }, function (error) {
                        console.error('FAILED...', error);
                    });
            }
            setIsSubmitting(false);
        } catch (error) {
            setIsSubmitting(false);
        }
    };
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [opacity, setOpacity] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const buttonStyle = isHovered
        ? {
            backgroundColor: 'black',
            color: 'desired-hover-text-color',
            marginLeft: '35px',
            paddingRight: '250px',
            paddingLeft: '180px',
            width: '5px',
            fontSize: '20px'
        }
        : {
            backgroundColor: 'white',
            marginLeft: '35px',
            paddingRight: '248px',
            paddingLeft: '180px',
            width: '5px',
            fontSize: '20px',
            border: '2px solid white'
        };
    useEffect(() => {
        setTimeout(() => {
            setOpacity(1);
            setIsLoading(false);
        }, 200);

        window.scrollTo(0, 0);

        return () => {
        };
    }, []);
    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Image Section at the top */}
            <div style={{
                height: '50%',
                backgroundColor: 'gold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '150px',
                boxSizing: 'border-box'
            }}>
                <h3 style={{marginLeft:'810px', fontSize: '5rem', color: 'white' }}>Подпишитесь на нашу рассылку</h3>

            </div>
            <div style={{ marginLeft:'800px',display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h77 style={{ fontSize: '1.5rem', color: 'black', textAlign: 'center' , marginLeft:'250px', marginRight:'250px',marginBottom:'-90px', marginTop:'-90px'}}>
                    Получайте последние обновления и эксклюзивные предложения от "La Reserve"! Подпишитесь на нашу рассылку и никогда не пропустите вкусную новинку.
                    Получите актуальные новости и уникальные предложения от "La Reserve"! Подпишитесь на нашу рассылку и будьте в курсе всех событий.
                </h77>

            </div>

            <div style={{
                height: '50%',
                backgroundImage: `url(${backkhoho})`,
                display: 'flex',
                backgroundSize: 'cover',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0px',
                boxSizing: 'border-box',
                marginTop:'-10px',
                marginBottom: '-25px',
                paddingBottom:'55px'
            }}>
                <form onSubmit={handleSubmit} style={{ textAlign: 'center',marginLeft:'1350px', width: '100%', maxWidth: '400px' }}>
                    <h3 style={{ marginBottom: '-10px' }}>НОВОСТНАЯ РАССЫЛКА</h3>
                    <input type="text" placeholder="Имя" name="firstName" onChange={handleChange} value={formData.firstName} style={{ padding: '10px', marginBottom: '10px', width: '100%' }} /><br />
                    <input type="text" placeholder="Фамилия" name="lastName" onChange={handleChange} value={formData.lastName} style={{ padding: '10px', marginBottom: '10px', width: '100%' }} /><br />
                    <input type="email" placeholder="Электронная почта" name="email" onChange={handleChange} value={formData.email} style={{ padding: '10px', marginBottom: '-10px', width: '100%',paddingTop:'20px' }} /><br />
                    <div style={{ color: 'red' }}>{errorMessage}</div>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Обработка...' : 'ОТПРАВИТЬ'}
                    </button>
                </form>

                <img src={chef} alt="Decorative" style={{
                    position: 'absolute',
                    right: '60%',
                    top: '2.2%',
                    height: '86.5%',
                    width: '850px',
                    border: '6px solid white',
                }} />
            </div>
            <footer className="hoho-footer" style={{ backgroundColor: 'black', color: 'gold', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'25px',height: '70px' }}>
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

export default NewsletterForm;