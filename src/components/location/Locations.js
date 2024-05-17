import React, {useEffect, useState} from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import './Locations.css';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import markerIcon from '../../assets/images/location/marker.ico';  // Ensure this path is correct

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

const Locations = () => {

    useEffect(() => {
        // Fade in effect
        const timer = setTimeout(() => {
            setOpacity(1);
        }, 200); // Adjust delay as needed

        // Header resize on scroll
        const handleScroll = () => {
            const header = document.querySelector('header');
            if (header) {
                header.style.height = window.pageYOffset > 200 ? '60px' : '100px';
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    useEffect(() => {
        document.getElementById('map').innerHTML = ""; // Clear previous map instances if any

        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: fromLonLat([10.810972975259777, 35.7658855389752]),
                zoom: 14.5
            })
        });

        const marker = new Feature({
            geometry: new Point(fromLonLat([10.810972975259777, 35.7658855389752]))
        });

        const iconStyle = new Style({
            image: new Icon({
                anchor: [0.5, 1], // This should be adjusted according to the actual icon image's tip position
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: markerIcon, // Ensure this is correctly imported
                scale: 0.5 // Optional: Scale the icon if it's too large
            })
        });


        marker.setStyle(iconStyle);

        const vectorSource = new VectorSource({
            features: [marker]
        });

        const markerVectorLayer = new VectorLayer({
            source: vectorSource,
        });

        map.addLayer(markerVectorLayer);
    }, []);

    const [opacity, setOpacity] = useState(0);
    const [isLoading, setIsLoading] = useState(true);  // State to control loading

    useEffect(() => {
        // Ensure the content is loaded with proper transitions
        setTimeout(() => {
            setOpacity(1);
            setIsLoading(false);  // Set loading to false after the content is ready
        }, 200);

        // Scroll to top on component mount
        window.scrollTo(0, 0);

        return () => {
            // Clean up if necessary
        };
    }, []);
    return (
        <div className="locations-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ flexGrow: 1 }}>
                <div id="location-box">
                    <div id="location-info" style={{
                        backgroundColor: '#fffbf0', // light background for contrast
                        padding: '20px',
                        borderRadius: '5px', // rounded corners
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // soft shadow
                        maxWidth: '600px', // constrain width for better readability
                        margin: 'auto', // center in parent
                        marginTop: '-153px' // space from the top
                    }}>
                        <h1 style={{
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', // stylish, readable font
                            fontWeight: 'bold',
                            color: '#333', // darker color for heading
                            marginBottom: '10px' // space below heading
                        }}>НАШЕ МЕСТОПОЛОЖЕНИЕ:</h1>
                        <p style={{
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            color: '#555', // slightly lighter color for body text
                            marginBottom: '50px' // space below paragraph
                        }}>C100e, Monastir, Tunisia</p>
                        <h1 style={{
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '10px'
                        }}>ВРЕМЯ РАБОТЫ:</h1>
                        <p style={{
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            color: '#555',
                            marginBottom: '30px' // more space before the image
                        }}>Понедельник-Пятница, 10am-5pm</p>
                        <h1 style={{
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '10px'
                        }}>Номер телефона:</h1>
                        <p style={{
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            color: '#555',
                            marginBottom: '30px' // more space before the image
                        }}>+7 (961)  615 42-17</p>
                        <img src="https://restaurant-lareserve-rennes.fr/wp-content/uploads/2019/07/RES-0125-1.jpg" style={{
                            marginLeft: '-10px',
                            marginTop: '20px',
                            maxWidth: '100%',
                            height: 'auto',
                            border: '5px solid #000000', // maintaining the black border
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // shadow for the image
                            borderRadius: '5px' // rounded corners for the image
                        }} alt="Specials Image" />
                    </div>
                </div>
                <div id="map" style={{ width: '70%', height: '99%', float: 'right' }}></div>
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

export default Locations;
