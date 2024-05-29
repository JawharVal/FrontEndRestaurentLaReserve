import React, { useState, useEffect , useRef } from 'react';
import './menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { useLocation, useNavigate ,NavLink} from 'react-router-dom';

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

function Menu() {
    const [isAdding, setIsAdding] = useState(false);
    const location = useLocation();
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortOrder, setSortOrder] = useState('');
    const [activeSection, setActiveSection] = useState(location.state?.section || 'MENU');
    const [loading, setLoading] = useState(true);
    const [mainStyle, setMainStyle] = useState({
        backgroundColor: 'gold',
        transition: 'background-color 0.5s ease, opacity 0.5s ease'
    });
    const navigate = useNavigate();
    const sortMenuItems = (items, order) => {
        if (order === 'asc') {
            return [...items].sort((a, b) => a.price - b.price);
        } else if (order === 'desc') {
            return [...items].sort((a, b) => b.price - a.price);
        }
        return items;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpacity(1);
        }, 200);

        const handleScroll = () => {
            const header = document.querySelector('header');
            if (header) {
                header.style.height = window.pageYOffset > 300 ? '60px' : '100px';
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('/api/categories/');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        };

        fetchCategories();
    }, []);


    const fetchMenuItems = async (section, categoryId = null) => {
        setLoading(true);
        try {
            let url = `/api/menuItems/section/${section}`;
            if (categoryId) {
                url += `?category=${categoryId}`;
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const items = await response.json();
            const sortedItems = sortMenuItems(items, sortOrder);
            setTimeout(() => {
                setMenuItems(sortedItems);
                setLoading(false);
            }, 500);
            setMainStyle({
                ...mainStyle,
                backgroundColor: section === 'MENU' ? 'rgb(253,216,27)' : 'white',
            });
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems(activeSection, selectedCategory);
    }, [activeSection, selectedCategory, sortOrder]);


    const handleSectionChange = (section) => {
        if (section === activeSection || loading) return;
        setActiveSection(section);
    };
    const handleOrderNow = () => {
        navigate('/order');
    };








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
        <div>
            <main style={mainStyle}>
                <section id="menus">
                    <div>
                        <h3>МЕНЮ</h3>
                    </div>
                    <div id="text">
                        <p>Отправьтесь в захватывающее кулинарное путешествие, не выходя из ресторана! Мы предлагаем вам открыть для себя мир разнообразных вкусов и ароматов международной кухни прямо здесь, у нас.</p>
                       <p>Погрузитесь в культурное разнообразие через наше меню, которое предлагает что-то для каждого вкуса.</p>
                    </div>
                    <div>
                        <select
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={selectedCategory || ''}
                            style={{
                                backgroundColor: 'black',  // Black background like the MENU button
                                color: 'white',            // White text
                                border: '5px solid white',
                                // No border to match the button style
                                // Rounded corners, adjust the radius as needed
                                padding: '15px 20px',      // Padding to make the select box taller and text aligned
                                fontWeight: 'bold',        // Bold text
                                cursor: 'pointer',         // Cursor as pointer to indicate it's clickable
                                outline: 'none'            // Remove focus outline for aesthetics
                            }}
                        >
                            <option value="">Все категории</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>

                    </div>
                    <div>
                        <select
                            onChange={(e) => setSortOrder(e.target.value)}
                            value={sortOrder}
                            style={{
                                backgroundColor: 'black',  // Black background like the MENU button
                                color: 'white',            // White text
                                border: '5px solid white',
                                    // Rounded corners, adjust the radius as needed
                                padding: '15px 20px',      // Padding to make the select box taller and text aligned
                                fontWeight: 'bold',        // Bold text
                                cursor: 'pointer',         // Cursor as pointer to indicate it's clickable
                                outline: 'none'            // Remove focus outline for aesthetics
                            }}
                        >
                            <option value="">Сортировать по цене</option>
                            <option value="asc">По возрастанию</option>
                            <option value="desc">По убыванию</option>
                        </select>
                    </div>
                    <div id="buttonContainer">
                        <button
                            id="menuButton"
                            className={activeSection === 'MENU' ? 'active' : ''}
                            onClick={() => handleSectionChange('MENU')}
                        >
                            МЕНЮ
                        </button>
                        <button
                            id="specialsButton"
                            className={activeSection === 'SPECIALS' ? 'active' : ''}
                            onClick={() => handleSectionChange('SPECIALS')}
                        >
                            Specials
                        </button>
                    </div>
                    <div id="text">
                        <p>Следите за нашими обновлениями в социальных сетях, чтобы быть в курсе еженедельных специальных предложений и новых вариаций вегетарианских блюд.</p>
                    </div>
                    <div id="menuItems" className={loading ? 'hidden' : ''}>
                        {menuItems.map((item, index) => (
                            <div key={index} className="menuItem" style={{
                                transition: `opacity 0.5s ${index * 0.1}s ease, transform 0.5s ${index * 0.1}s ease`,
                                opacity: loading ? 0 : 1, // Fade in/out during loading
                                transform: loading ? 'translateY(20px)' : 'translateY(0)',
                            }}>
                                <h2>{item.name}</h2>
                                <h4>{item.description}</h4>
                                {item.categoryName && <h4>Категория: {item.categoryName}</h4>} {/* Add this line to display the category */}

                                <h5>Цена: {item.price} ₽</h5>
                                <img src={item.imageUrl} alt={item.name} />
                                <div className="bb">

                                </div>
                            </div>

                        ))}
                    </div>
                    
                </section>
            </main>

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

export default Menu;
