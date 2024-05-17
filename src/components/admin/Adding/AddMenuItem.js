import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import adming from '../../../assets/images/admins/admin.jpg';

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
function AddMenuItem() {
    const [menuItem, setMenuItem] = useState({
        name: '',
        description: '',
        imageUrl: '',
        price: '',
        section: '',
        categoryId: ''
    });
    const [categories, setCategories] = useState([]); // State to store categories
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories from the backend
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
    }, []);

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
            const response = await fetch('/api/menuItems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menuItem)
            });
            if (response.ok) {
                alert('Menu item added successfully!');
                navigate('/adminpanel');
            } else {
                alert('Failed to add menu item.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding menu item.');
        }
    };

    return (
        <div style={{ backgroundImage: `url(${adming})`,paddingTop: '50px'}}>
            <div className="add-user-container"style={{ color:'black',justifyContent:'left',backgroundColor: 'white',paddingTop: '0px'}}>
                <h3 style={{color: 'gold', marginLeft:'100px' ,paddingTop:'20px',marginBottom:'-50px'}}>Добавить меню</h3>
                <form onSubmit={handleSubmit}  className="user-form" style={{Color: 'black',}}>
                    <label style={{ color: 'black' }}>
                        Имя:
                    <input type="text" name="name" value={menuItem.name} onChange={handleChange} required />
                </label>
                <label style={{ color: 'black' }}>
                    Описание:
                    <input type="text" name="description" value={menuItem.description} onChange={handleChange} required />
                </label>
                <label style={{ color: 'black' }}>
                    URL изображения:
                    <input type="text" name="imageUrl" value={menuItem.imageUrl} onChange={handleChange} />
                </label>
                <label style={{ color: 'black' }}>
                    Цена:
                    <input type="number" name="price" value={menuItem.price} onChange={handleChange} required />
                </label>
                <label style={{ color: 'black' }}>
                    Раздел:
                    <select name="section" value={menuItem.section} onChange={handleChange} required>
                        <option value="">Выберите раздел</option>
                        <option value="MENU">Mеню</option>
                        <option value="SPECIALS">SPECIALS</option>
                    </select>
                </label>
                <label style={{ color: 'black' }}>
                    Категория:
                    <select name="categoryId" value={menuItem.categoryId} onChange={handleChange} required>
                        <option value="">Выберите категорию</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Добавить меню</button>
                </form>
        
        </div>
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
export default AddMenuItem;
