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
import markerIcon from '../../assets/images/location/marker.ico';

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
        const timer = setTimeout(() => {
            setOpacity(1);
        }, 200);

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
        document.getElementById('map').innerHTML = "";

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
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: markerIcon,
                scale: 0.5
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
    const [isLoading, setIsLoading] = useState(true);

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
        <div className="locations-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ flexGrow: 1 }}>
                <div id="location-box">
                    <div id="location-info" style={{
                        backgroundColor: '#fffbf0',
                        padding: '20px',
                        borderRadius: '5px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        maxWidth: '600px',
                        margin: 'auto',
                        marginTop: '-153px'
                    }}>
                        <h1 style={{
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '10px'
                        }}>НАШЕ МЕСТОПОЛОЖЕНИЕ:</h1>
                        <p style={{
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            color: '#555',
                            marginBottom: '50px'
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
                            marginBottom: '30px'
                        }}>Понедельник-Воскресенье, 9am-7pm</p>
                        <h1 style={{
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '10px'
                        }}>Номер телефона:</h1>
                        <p style={{
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            color: '#555',
                            marginBottom: '30px'
                        }}>+7 (961)  615 42-17</p>
                        <img src="https://restaurant-lareserve-rennes.fr/wp-content/uploads/2019/07/RES-0125-1.jpg" style={{
                            marginLeft: '-10px',
                            marginTop: '20px',
                            maxWidth: '100%',
                            height: 'auto',
                            border: '5px solid #000000',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            borderRadius: '5px'
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
