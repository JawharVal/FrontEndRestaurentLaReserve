import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
function AddCategory() {
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState('');

    const handleInputChange = (event) => {
        setCategoryName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const newCategory = { name: categoryName };
            await axios.post('/api/categories', newCategory);
            alert('Category added successfully');
            navigate('/adminpanel');  // Redirect to categories list after adding
        } catch (error) {
            console.error('Failed to add category:', error);
            alert('Failed to add category');
        }
    };

    return (
        <div style={{ backgroundImage: `url(${adming})`,paddingTop: '50px'}}>
            <div className="add-user-container"style={{ color:'black',justifyContent:'left',backgroundColor: 'white',paddingTop: '0px'}}>
                <h3 style={{color: 'gold', marginLeft:'100px' ,paddingTop:'20px',marginBottom:'-50px'}}>Добавить новую категорию</h3>
                <form onSubmit={handleSubmit}  className="user-form" style={{Color: 'black',}}>
                <div>
                    <label htmlFor="name" style={{ color: 'black' }}>Название категории:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={categoryName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Добавить категорию</button>
                <button type="button" onClick={() => navigate('/adminpanel')}>Отмена</button>
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
export default AddCategory;
