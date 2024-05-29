import React, { useEffect, useState } from 'react';
import './hoho.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink ,useNavigate} from "react-router-dom";
import {useAuth } from '../../AuthContext';

import Modal from '../../components/modal/Modal.js';
import Modalqs from '../../components/modal/Modalqs';
import PhotoGallery from '../../components/photogallery/PhotoGallery';
import azeImage from '../../assets/images/homepage/aze.jpg';
import pizaImage from '../../assets/images/homepage/piza.jpg';
import a1 from '../../assets/images/homepage/1.jpg';
import a2 from '../../assets/images/homepage/2.jpg';
import StarRatingComponent from 'react-star-rating-component';
import axios from 'axios';
import a3 from '../../assets/images/homepage/3.jpg';
import a4 from '../../assets/images/homepage/4.jpg';
import ReviewForm from '../../components/review/ReviewForm';
import a6 from '../../assets/images/homepage/4.jpeg';
import a5 from '../../assets/images/homepage/5.jpg';
import vc from '../../assets/images/homepage/vc.jpg';
import Logo from '../../assets/images/homepage/logo.svg';
function SocialIcons() {
    return (
        <div>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" style={{ color: 'gold', marginRight: '20px' }}>
                <FontAwesomeIcon icon={faFacebookSquare} style={{ fontSize: '33px' }} />
            </a>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" style={{ color: 'gold', marginRight: '20px' }}>
                <FontAwesomeIcon icon={faInstagram} style={{ fontSize: '33px' }} />
            </a>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" style={{ color: 'gold' }}>
                <FontAwesomeIcon icon={faVk} style={{ fontSize: '33px' }} />
            </a>
        </div>
    );
}

function App() {
    const { currentUser } = useAuth();
    const [homePages, setHomePages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [autoSlide, setAutoSlide] = useState(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [approvedReviews, setApprovedReviews] = useState([]);
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        const approveReview = (reviewId) => {
            axios.put(`/reviews/${reviewId}/approve`)
                .then(response => {
                    const approvedReview = response.data;
                    console.log('Approved review data:', approvedReview);
                    if (approvedReview && approvedReview.approved) {
                        const newApprovedReviews = [...approvedReviews, approvedReview];
                        setApprovedReviews(newApprovedReviews);
                        alert('Review approved successfully');

                        const newReviews = reviews.filter(r => r.id !== reviewId);
                        setReviews(newReviews);
                    } else {
                        alert('Failed to approve review: Server did not return an approved status.');
                    }
                })
                .catch(error => {
                    console.error('Failed to approve review:', error);
                    alert('Failed to approve review: ' + error.message);
                });
        };

        fetchApprovedReviews();
    }, []);
    const fetchApprovedReviews = () => {
        axios.get('/reviews/approved')
            .then(response => {
                const sortedReviews = response.data.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
                setApprovedReviews(sortedReviews);
            })
            .catch(error => console.error('Failed to fetch approved reviews:', error));
    };

    const loadImage = src => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = reject;
        img.src = src;
    });
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        // Fade in effect
        const timer = setTimeout(() => {
            setOpacity(3);
        }, 200); // Adjust delay as needed

        // Header resize on scroll
        const handleScroll = () => {
            const header = document.querySelector('header');
            if (header) {
                header.style.height = window.pageYOffset > 500 ? '60px' : '100px';
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const handleReserveClick = () => {
        console.log("Reserve button clicked");
        console.log("Current User:", currentUser);

        if (!currentUser) {
            console.log("No user detected, showing modal...");
            setShowModal(true);
        } else {
            console.log("User detected, navigating to booking...");
            navigate('/booking');
        }
    };
    useEffect(() => {
        console.log('Modal should be visible:', showModal);
    }, [showModal]);

    const goToSpecials = () => {
        navigate('/menus', { state: { section: 'SPECIALS' } });
    };

    const goToMenu = () => {
        navigate('/menus', { state: { section: 'MENU' } });
    };

    const goTonews = () => {
        navigate('/subscribe');
    };

    const goTologin = () => {
        navigate('/login');
    };

    useEffect(() => {
        if (homePages.length > 0) {
            Promise.all(homePages.map(page => loadImage(page.imageUrls[0])))
                .then(() => {
                    setImagesLoaded(true); // Set imagesLoaded to true after all images are loaded
                    console.log('All images preloaded');
                })
                .catch(error => {
                    console.error('Error loading images', error);
                });
        }
    }, [homePages]);

    useEffect(() => {
        fetch('/api/homePages')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data); // Log to check the structure and link values
                setHomePages(data);
                setCurrentIndex(0);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);



    useEffect(() => {
        if (imagesLoaded) { // Start transitions only after images are loaded
            startAutomaticTransition();
        }
    }, [imagesLoaded]); // Dependency on imagesLoaded

    const startAutomaticTransition = () => {
        stopAutomaticTransition();
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % homePages.length);
        }, 6000);
        setAutoSlide(interval);
    };

    const stopAutomaticTransition = () => {
        if (autoSlide) {
            clearInterval(autoSlide);
            setAutoSlide(null);
        }
    };

    const handlePointClick = index => {
        setCurrentIndex(index);
        stopAutomaticTransition();
        startAutomaticTransition();
    };
    const handleButtonClick = (event) => {
        // Accessing the link from the data attribute
        const link = event.currentTarget.dataset.link;
        console.log("Link to navigate:", link);
        navigate(link);
    };



    return (
        <div>
            <div className="hoho-carousel">
                {homePages.map((page, index) => (
                    <div key={page.id} className={`hoho-carousel-image ${currentIndex === index ? 'active' : ''}`}>
                        <img src={page.imageUrls[0]} alt={`Carousel ${index}`} />
                        <div className="hoho-overlay">
                            <h7>{page.title}</h7>
                            <p>{page.descriptions[0]}</p>
                            
                        </div>
                    </div>
                ))}

                <div className="hoho-carousel-points-background"></div>
                <div className="hoho-carousel-points">
                    {homePages.map((_, index) => (
                        <div key={index} className={`hoho-carousel-point ${currentIndex === index ? 'active' : ''}`} onClick={() => handlePointClick(index)} />
                    ))}
                </div>
            </div>
            <div className="hoho-additional-content">
                <div className="hoho-content-item">
                    <img src="https://t4.ftcdn.net/jpg/03/14/02/73/360_F_314027363_l7ryiD9Hp8lKy0CkfIoAtsmTv7GXvY5W.jpg" alt="Specials Image" />
                    <h3>SPECIALS</h3>
                    <p>Исследуйте наше эксклюзивное специальное меню в интернете и побалуйте ваши вкусовые рецепторы уникальными кулинарными шедеврами.</p>
                    <button onClick={goToSpecials}> ПОСМОТРЕТЬ </button>
                </div>
                <div className="hoho-content-item">
                    <img src="https://www.southernliving.com/thmb/XgZwnFHAhZhSlZ_uA_tMGdB4iD8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MamaRicottas11-99fbee5bd7504985822f672fff48de9d.jpg" alt="Reservation Image" />
                    <h3>БРОНИРОВАНИЕ</h3>
                    <p>Посетите веб-сайт ресторана, выберите предпочтительные дату и время, укажите количество гостей и подтвердите ваше бронирование всего несколькими кликами.</p>
                    <button onClick={handleReserveClick}>ЗАБРОНИРОВАТЬ</button>
                    {showModal && (
                        <Modal show={showModal} onClose={() => setShowModal(false)}>
                            <p>Please log in to make a booking.</p>
                            <button onClick={() => navigate('/login')}>Log In</button>
                        </Modal>
                    )}


                </div>
            </div>
            <div className="hoho-content-container">
                <div className="hoho-content-wrapper">
                    <img
                        src="https://img.freepik.com/free-photo/delicious-food-prepared-jewish-hanukkah-celebration_23-2151112396.jpg"
                        alt="Menu Image"
                        className="content-image"
                        style={{
                            width: '1050px', // Image takes up 100% of the width of its parent
                            height: 'auto', // Height is set to auto to maintain aspect ratio
                            marginLeft:'20px',
                            border: '3px solid #000000'

                    }}
                    />
                    <div className="hoho-content-details">
                        <h3 className="hoho-content-title">МЕНЮ</h3>
                        <p className="hoho-content-text">
                            Наслаждайтесь нашим онлайн-меню: великолепный выбор блюд, доведенных до совершенства, готовых к употреблению прямо у вас дома. Закажите прямо сейчас и побалуйте себя кулинарным мастерством всего в нескольких кликах.</p>
                        <div className="hoho-content-item">
                        <button  onClick={goToMenu}>ЗАГЛЯНИТЕ В МЕНЮ</button>
                    </div>
                    </div>
                </div>
            </div>
            <div className="photo-gallery-section">
                <h88 style={{marginLeft: '400px',fontSize: '60px',marginTop:'-400px' }}>Фотогалерея</h88> {/* Optional heading for the section */}
                <p style={{
                    marginLeft: '200px',
                    paddingRight: '1400px',
                    fontSize: '20px',
                    textAlign: 'center',
                    marginTop: '50px',
                    lineHeight: '2.6'  // Adjusts the space between lines
                }}>
                    Здесь представлены фотографии нашего ресторана, демонстрирующие уникальную атмосферу и изысканное оформление интерьера. Просмотрите галерею, чтобы узнать больше о нашем уютном и приветливом пространстве.</p>

                <PhotoGallery photos={[
                    { src: azeImage, alt: "Description 1" },
                    { src: pizaImage, alt: "Description 2" },
                    { src: a1, alt: "Description 2" },

                    { src: a3, alt: "Description 2" },
                    { src: a4, alt: "Description 2" },

                    { src: a5, alt: "Description 2" },
                    { src: vc, alt: "Description 1" },
                    { src: a2, alt: "Description 2" },
                    // More photos can be added here
                ]} />
                <img alt="Logo" src={Logo} width="280" height="280" style={{ marginTop: '-500px', marginLeft:'400px' }} />

            </div>
            <div className="sd"></div>
            < ReviewForm />
            <div className="approved-reviews">
                <h2 style={{color:'black', borderColor: 'black',WebkitTextStrokeWidth: '1px',
                    WebkitTextStrokeColor: 'black',marginLeft: '350px', fontFamily: 'Lobster, sans-serif',fontSize: '64px'}}>ОТЗЫВЫ</h2>

                {approvedReviews.map((review) => (
                    <div className="review" key={review.id}>
                        <div className="review-header">
                            <h4>{review.username}</h4>
                            <small>{new Date(review.reviewDate).toLocaleString()}</small>
                        </div>
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={review.averageRating}
                            editing={false}
                        />
                        <h66>{review.comments}</h66>
                    </div>
                ))}
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
}


export default App;