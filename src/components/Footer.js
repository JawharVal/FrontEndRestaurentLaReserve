import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    const styles = {
        footer: {
            backgroundColor: 'black',
            color: 'gold',
            padding: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '20px',
            marginTop: '212px'
        },
        navLink: {
            color: 'gold',
            textDecoration: 'none',
            fontWeight: 'bolder',
            transition: 'color 0.3s ease'
        }
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

    return (
        <footer style={styles.footer}>
            <SocialIcons />
            <div style={{ textAlign: 'center' }}>
                <a style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bold' }}>© 2024 LA RESERVE. All rights reserved.</a>
            </div>
            <div>
                <ul style={{ listStyleType: 'none', marginRight: '20px', display: 'flex', gap: '40px' }}>
                    <li>
                        <NavLink to="/contact" style={styles.navLink}
                                 onMouseOver={(e) => e.currentTarget.style.color='white'}
                                 onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                            CONTACT
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" style={styles.navLink}
                                 onMouseOver={(e) => e.currentTarget.style.color='white'}
                                 onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                            ABOUT
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/subscribe" style={styles.navLink}
                                 onMouseOver={(e) => e.currentTarget.style.color='white'}
                                 onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                            NEWSLETTER
                        </NavLink>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
