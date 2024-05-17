import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import adming from '../../../assets/images/admins/admin.jpg';

import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SocialIcons() {
    return (
        <div>
            <a href="#" style={{color: 'gold', marginRight: '20px'}}>
                <FontAwesomeIcon icon={faFacebookSquare} style={{fontSize: '33px'}}/>
            </a>
            <a href="#" style={{color: 'gold', marginRight: '20px'}}>
                <FontAwesomeIcon icon={faInstagram} style={{fontSize: '33px'}}/>
            </a>
            <a href="#" style={{color: 'gold'}}>
                <FontAwesomeIcon icon={faVk} style={{fontSize: '33px'}}/>
            </a>
        </div>
    );
}
function EditMenuItem() {
    const { menuItemId } = useParams();  // Get the menu item ID from the URL
    const [menuItem, setMenuItem] = useState({
        name: '',
        description: '',
        imageUrl: '',
        price: '',
        section: '',
        categoryId: ''
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories and menu item details
        fetchCategories();
        fetchMenuItemDetails();
    }, []);
    const [hover, setHover] = useState(false);
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchMenuItemDetails = async () => {
        try {
            const response = await axios.get(`/api/menuItems/${menuItemId}`);
            setMenuItem(response.data);
        } catch (error) {
            console.error('Failed to fetch menu item details:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMenuItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/menuItems/${menuItemId}`, menuItem);
            alert('Menu item updated successfully!');
            navigate('/adminpanel');
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating menu item.');
        }
    };
    const styles = {
        container: {
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundImage: `url(${adming})`,
            backgroundSize: 'cover',
        },
        form: {
            padding: '30px',
            marginTop: '150px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: "#ffffff",
            width: '100%',
            maxWidth: '500px',
        },
        input: {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
        },
        select: {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
        },
        textarea: {
            width: '100%',
            height: '100px',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            resize: 'none'
        },
        button: {
            padding: '10px 20px',
            margin: '10px 0',
            borderRadius: hover ? '5px' : '4px',
            border: '4px solid #ffffff',
            backgroundColor: hover ? '#000000' : 'gold',
            color: hover ? '#ffffff' : 'white',
            cursor: 'pointer',
            transform: hover ? 'scale(1.05)' : 'none',
            border: '1px solid green',
            transition: 'background-color 0.3s, color 0.3s, transform 0.3s, border-radius 0.3s'
        },
        label: {
            display: 'block',
            fontWeight: 'bold',
            marginBottom: '5px',
            fontSize: '16px' // Ensure all labels have the same font size
        },
        error: {
            color: 'red',
            fontSize: '0.8rem',
            height: '20px', // Ensure the layout doesn't jump when errors appear
        }
    };

    return (
        <div style={styles.container}>
            <h3 style={{color: 'gold', marginLeft:'780px' ,paddingTop:'80px',marginBottom:'-50px'}}>Редактировать пункт меню</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>
                    Имя:
                    <input type="text" name="name" value={menuItem.name} onChange={handleChange} required style={styles.input} />
                </label>
                <label style={styles.label}>
                    Описание:
                    <input type="text" name="description" value={menuItem.description} onChange={handleChange} required style={styles.input} />
                </label>
                <label style={styles.label}>
                    URL изображения:
                    <input type="text" name="imageUrl" value={menuItem.imageUrl} onChange={handleChange} style={styles.input} />
                </label>
                <label style={styles.label}>
                    Цена:
                    <input type="number" name="price" value={menuItem.price} onChange={handleChange} required style={styles.input} />
                </label>
                <label style={styles.label}>
                    Раздел:
                    <select name="section" value={menuItem.section} onChange={handleChange} required style={styles.select}>
                        <option value="MENU">МЕНЮ</option>
                        <option value="SPECIALS">SPECIALS</option>
                    </select>
                </label>
                <label style={styles.label}>
                    Категория:
                    <select name="categoryId" value={menuItem.categoryId} onChange={handleChange} required style={styles.select}>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit" style={styles.button}>ОБНОВИТЬ ЭЛЕМЕНТ МЕНЮ</button>
            </form>
    <footer className="hoho-footer" style={{ backgroundColor: 'black', color: 'gold', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'250px',height: '80px' }}>
        <SocialIcons />
        <div style={{ textAlign: 'center' }}>
            <a style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bold' }}>© 2024 LA RESERVE. All rights reserved.</a>
        </div>
        <div>
            <ul style={{ listStyleType: 'none', marginRight: '20px', display: 'flex', gap: '40px' }}>
                <li>
                    <NavLink to="/contact" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}
                             onMouseOver={(e) => e.currentTarget.style.color='white'}
                             onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                        CONTACT
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}
                             onMouseOver={(e) => e.currentTarget.style.color='white'}
                             onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                        ABOUT
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/subscribe" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}
                             onMouseOver={(e) => e.currentTarget.style.color='white'}
                             onMouseOut={(e) => e.currentTarget.style.color='gold'}>
                        NEWSLETTER
                    </NavLink>
                </li>
            </ul>
        </div>
    </footer>
            </div>
);
}

export default EditMenuItem;
