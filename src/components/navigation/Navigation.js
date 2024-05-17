import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Navigation.css';
import Logo from '../../assets/images/homepage/logo.svg';

function Navigation({ onLogout, onBookingClick }) {
    const { currentUser } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('.uk-navbar-container');
            const logo = document.querySelector('.uk-logo img');
            if (header && logo) {
                const smallHeight = 120;
                const largeHeight = 120;
                const scrollPosition = window.pageYOffset;

                // Resize header
                header.style.height = scrollPosition > 0 ? `${smallHeight}px` : `${largeHeight}px`;

                // Adjust logo scaling based on header size
                const scaleRatio = scrollPosition > 0 ? 0.6 : 1;
                const currentTransform = currentUser ? 'translate(-30%, -20%)' : 'translate(-10%, -20%)';
                logo.style.transform = `${currentTransform} scale(${scaleRatio})`;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentUser]); // Include currentUser in the dependency array to rebind the event handler when it changes.

    return (
        <div className="uk-navbar-container">
            <div className="uk-container uk-container-expand">
                <nav className="uk-navbar" uk-navbar="container: .tm-header-mobile">
                    <div className="uk-navbar-left">
                        <div aria-label="Back to home" className={`uk-logo ${currentUser ? 'logged-in' : ''}`}>
                            <img alt="Logo" src={Logo} width="110" height="110" />
                        </div>
                    </div>
                    <div className="uk-navbar-center">
                        <NavLink to="/menus" className="nav-link">МЕНЮ</NavLink>
                        <NavLink to="/locations" className="nav-link">МЕСТА</NavLink>
                        {currentUser ? (
                            <>
                                <NavLink to="/profile" className="nav-link">ПРОФИЛЬ</NavLink>
                                {currentUser.role === 'admin' && (
                                    <NavLink to="/adminpanel" className="nav-link">АДМИН-ПАНЕЛЬ</NavLink>
                                )}
                            </>
                        ) : (
                            <NavLink to="/login" className="nav-link">LOGIN</NavLink>
                        )}
                    </div>
                    <div className="uk-navbar-right">
                        <a uk-toggle="" href="#tm-dialog-mobile" className="uk-navbar-toggle" aria-label="Open menu">
                            <div uk-navbar-toggle-icon="" className="uk-icon uk-navbar-toggle-icon"></div>
                        </a>
                        {currentUser && (
                            <button onClick={onBookingClick} className="booking-button">ЗАБРОНИРОВАТЬ СЕЙЧАС</button>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Navigation;
