import React, { useState, useEffect } from 'react';
import './About.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import aboutg from '../../assets/images/about/aboutt.png';

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

const About = () => {
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        // Fade in effect
        const timer = setTimeout(() => {
            setOpacity(1);
        }, 200);

        // Header resize on scroll
        const handleScroll = () => {
            const header = document.querySelector('header');
            if (header) {
                header.style.height = window.pageYOffset > 150 ? '60px' : '100px';
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div style={{ opacity: opacity, transition: 'opacity 0.5s ease-out' }}>
            <div className="bobo" style={{
                backgroundImage: `url(${aboutg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 100%',
                backgroundRepeat: 'no-repeat',
                paddingLeft: '250px',
                paddingTop: '20px',
                marginRight: '250px',
                width: '90vw',
                minHeight: '280px',
                paddingBottom: '320px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
            }}>
                <div id="contact-form" style={{
                    color: 'white',
                    textAlign: 'left',
                    maxWidth: '600px',
                    marginLeft: '30px'
                }}>
                    <h1>ВКУСЫ МИРА ПОД ОДНОЙ КРЫШЕЙ.</h1>
                    <p style={{ color: 'black', marginLeft: '-120px', marginTop: '20px', marginRight: '-100px', textAlign: 'justify', fontSize: '25px', lineHeight: '2', fontFamily: 'Vensim Serif' }}>
                        Добро пожаловать в La Reserve – место, где вкусы мира и элегантность встречаются в одном изысканном пространстве.
                        Наш ресторан предлагает уникальное кулинарное путешествие, вдохновленное традициями различных кухонь и современными гастрономическими тенденциями.
                        Мы гордимся использованием только лучших ингредиентов и предоставлением высочайшего уровня сервиса.
                    </p>
                    <p style={{ color: 'black', marginLeft: '-120px', marginTop: '20px', marginRight: '-100px', textAlign: 'justify', fontSize: '25px', lineHeight: '2', fontFamily: 'Vensim Serif' }}>
                        Особенности нашего сервиса: в La Reserve вы платите только за еду — бронирование столов осуществляется абсолютно бесплатно. Эта услуга позволяет вам спланировать свой визит заранее, выбрав удобное для вас время без дополнительных расходов.
                        Откройте для себя неповторимую атмосферу La Reserve и позвольте нам создать для вас незабываемый вечер.
                    </p>
                </div>
            </div>

            <footer className="hoho-footer" style={{ backgroundColor: 'black', color: 'gold', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
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

export default About;
