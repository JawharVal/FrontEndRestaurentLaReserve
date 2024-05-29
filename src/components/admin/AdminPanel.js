import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';
import adming from '../../assets/images/admins/admin.jpg';
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StarRatingComponent from 'react-star-rating-component';
import UsersTable from './tables/UsersTable';
import SubscribersTable from './tables/SubscribersTable';
import RestaurantsTable from './tables/RestaurantsTable';
import ReviewsTable from './tables/ReviewsTable';
import CategoriesTable from './tables/CategoriesTable';
import MenuItemsTable from './tables/MenuItemsTable';
import LocationsTable from './tables/LocationsTable';
import CitiesTable from './tables/CitiesTable';
import CountriesTable from './tables/CountriesTable';
import HomePagesTable from './tables/HomePagesTable';
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

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [subscribers, setSubscribers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [currentView, setCurrentView] = useState(() => localStorage.getItem('currentView') || null);
    const [data, setData] = useState({ users: [], subscribers: [], restaurants: [], reviews: [], categories: [], menuItems: [], locations: [], cities: [], countries: [], homePages: [] });
    const [hoverView, setHoverView] = useState(null);
    const [locations, setLocations] = useState([]);
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchUsers();
        fetchCategories();
        fetchMenuItems();
        fetchRestaurants();
        fetchLocations();
        fetchCities();
        fetchCountries();
        fetchReviews(); // Fetch all reviews
        fetchApprovedReviews();
        fetchHomePages();
        fetchSubscribers();
    }, []);

    const updateCurrentView = (viewName) => {
        setCurrentView(viewName);
        localStorage.setItem('currentView', viewName);
    };

    const fetchReviews = () => {
        axios.get('/reviews/all')
            .then(response => {
                console.log("Fetched reviews:", response.data);
                if(response.data.length > 0) {
                    console.log("Sample review:", response.data[0]);
                }
                setReviews(response.data);
            })
            .catch(error => console.error('Failed to fetch reviews:', error));
    };

    const fetchSubscribers = () => {
        axios.get('/subscribe')
            .then(response => {
                setSubscribers(response.data);
            })
            .catch(error => console.error('Failed to fetch subscribers:', error));
    };
    const deleteSubscriber = (email) => {
        if (window.confirm('Are you sure you want to delete this subscriber?')) {
            axios.delete(`/subscribe/${email}`) // Adjust the endpoint as necessary
                .then(() => {
                    alert('Subscriber deleted successfully');
                    setSubscribers(subscribers.filter(subscriber => subscriber.email !== email)); // Update the state to reflect the deletion
                })
                .catch(error => {
                    console.error('Failed to delete subscriber:', error);
                    alert('Failed to delete subscriber: ' + error.message);
                });
        }
    };
    const [homePages, setHomePages] = useState([]);
    const fetchHomePages = () => {
        setLoading(true);
        axios.get('/api/homePages')
            .then(response => {
                setHomePages(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch home pages:', error);
                setLoading(false);
            });
    };

    const updateHomePage = (id, updatedData) => {
        axios.put(`/api/homePage/${id}`, updatedData)
            .then(response => {
                alert('Home page updated successfully');
                fetchHomePages(); // Refresh the list after update
            })
            .catch(error => {
                console.error('Failed to update home page:', error);
                alert('Failed to update home page: ' + error.message);
            });
    };
    const [approvedReviews, setApprovedReviews] = useState([]);
    const deleteReview = (reviewId) => {
        console.log("Attempting to delete review with ID:", reviewId); // This will confirm what ID is being passed

        if (!reviewId) {
            alert('Review ID is undefined, cannot delete.');
            return;
        }

        if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
            axios.delete(`/reviews/${reviewId}`)
                .then(() => {
                    alert('Review deleted successfully');
                    const updatedReviews = reviews.filter(review => review.id !== reviewId);
                    setReviews(updatedReviews); // Update the state to reflect the deletion
                })
                .catch(error => {
                    console.error('Failed to delete review:', error);
                    alert('Failed to delete review: ' + error.message);
                });
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await axios.get('/api/countries');
            setCountries(response.data);
        } catch (error) {
            console.error('Failed to fetch countries:', error);
        }
    };

    const deleteCountry = async (countryId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту страну?')) {
            try {
                await axios.delete(`/api/countries/${countryId}`);
                alert('Country deleted successfully');
                fetchCountries(); // Refresh the list after deletion
            } catch (error) {
                console.error('Failed to delete country:', error);
                alert('Failed to delete country: ' + error.message);
            }
        }
    };

    const navigateToAddCountry = () => {
        navigate('/add-country');
    };

    const navigateToEditCountry = (countryId) => {
        navigate(`/edit-country/${countryId}`);
    };

    const fetchUsers = () => {
        axios.get('/admin/users')  // Corrected API endpoint
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error('Failed to fetch users:', error));
    };

    const fetchLocations = () => {
        axios.get('/api/locations')
            .then(response => {
                setLocations(response.data);
            })
            .catch(error => console.error('Failed to fetch locations:', error));
    };

    const fetchRestaurants = () => {
        axios.get('/restaurants')
            .then(response => {
                setRestaurants(response.data);
            })
            .catch(error => console.error('Failed to fetch restaurants:', error));
    };
    const fetchCities = async () => {
        try {
            const response = await axios.get('/api/cities');
            setCities(response.data);
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        }
    };

    const deleteCity = async (cityId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот город?')) {
            try {
                await axios.delete(`/api/cities/${cityId}`);
                alert('City deleted successfully');
                fetchCities();  // Refresh the city list
            } catch (error) {
                alert('Failed to delete city:', error.message);
            }
        }
    };

    const navigateToAddCity = () => {
        navigate('/add-city');
    };

    const navigateToEditCity = (cityId) => {
        navigate(`/edit-city/${cityId}`);
    };

    const deleteRestaurant = (restaurantId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот ресторан?')) {
            axios.delete(`/restaurants/${restaurantId}`)
                .then(() => {
                    alert('Restaurant deleted successfully');
                    fetchRestaurants();  // Refresh list after deletion
                })
                .catch(error => alert('Failed to delete restaurant: ' + error.message));
        }
    };

    const navigateToAddRestaurant = () => {
        navigate('/add-restaurant');  // Navigate to Add Restaurant component
    };

    const navigateToEditRestaurant = (restaurantId) => {
        navigate(`/edit-restaurant/${restaurantId}`);
    };
    const fetchCategories = () => {
        axios.get('/admin/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Failed to fetch categories:', error));
    };

    const navigateToAddLocation = () => {
        navigate('/add-location');
    };

    const navigateToEditLocation = (locationId) => {
        navigate(`/edit-location/${locationId}`);
    };

    const deleteLocation = (locationId) => {
        if (window.confirm('Вы уверены, что хотите удалить это место?')) {
            axios.delete(`/api/locations/${locationId}`)
                .then(() => {
                    alert('Location deleted successfully');
                    fetchLocations(); // Refresh list after deletion
                })
                .catch(error => alert('Failed to delete location: ' + error.message));
        }
    };

    const fetchMenuItems = () => {
        axios.get('/admin/menuItems')
            .then(response => setMenuItems(response.data))
            .catch(error => console.error('Failed to fetch menu items:', error));
    };
    const deleteUser = (userId) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            axios.delete(`/admin/user/${userId}`)  // Corrected API endpoint
                .then(() => {
                    alert('User deleted successfully');
                    fetchUsers();  // Refresh list after deletion
                })
                .catch(error => alert('Failed to delete user: ' + error.message));
        }
    };
    const deleteCategory = (categoryId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
            axios.delete(`/admin/categories/${categoryId}`)
                .then(() => {
                    alert('Category deleted successfully');
                    fetchCategories();
                })
                .catch(error => alert('Failed to delete category: ' + error.message));
        }
    };

    const deleteMenuItem = (menuItemId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот меню')) {
            axios.delete(`/admin/menuItems/${menuItemId}`)
                .then(() => {
                    alert('Menu item deleted successfully');
                    fetchMenuItems();
                })
                .catch(error => alert('Failed to delete menu item: ' + error.message));
        }
    };
    const navigateToAddCategory = () => {
        navigate('/add-category');  // Navigate to Add Category component
    };

    const navigateToEditCategory = (categoryId) => {
        navigate(`/edit-category/${categoryId}`);
    };

    const navigateToAddMenuItem = () => {
        navigate('/add-menu-item');  // Navigate to Add Menu Item component
    };

    const navigateToEditMenuItem = (menuItemId) => {
        navigate(`/edit-menu-item/${menuItemId}`);
    };
    const navigateToAddUser = () => {
        navigate('/add-user');  // Navigate to Add User component
    };
    const navigateToEditUser = (userId) => {
        navigate(`/edit-user/${userId}`);
    };
    const styles = {
        button: {

            border: '4px solid #ffffff',
            backgroundColor:  '#000000',
            color: 'white',
            cursor: 'pointer',

            transition: 'background-color 0.3s, color 0.3s, transform 0.3s, border-radius 0.3s'
        },
        buttone: {

            border: '4px solid #ffffff',
            backgroundColor:  'lightblue',
            color: 'black',
            cursor: 'pointer',

            transition: 'background-color 0.3s, color 0.3s, transform 0.3s, border-radius 0.3s'
        },
        buttond: {

            border: '4px solid #ffffff',
            backgroundColor:  'salmon',
            color: 'white',
            cursor: 'pointer',

            transition: 'background-color 0.3s, color 0.3s, transform 0.3s, border-radius 0.3s'
        },
        buttonb: {

            border: '4px solid #ffffff',
            backgroundColor:  'lightgreen',
            color: 'white',
            cursor: 'pointer',

            transition: 'background-color 0.3s, color 0.3s, transform 0.3s, border-radius 0.3s'
        }
    };
    const navigateToUserBookings = (userId) => {
        navigate(`/admin/user/${userId}/bookings`);  // Navigate to the User Bookings page
    };
    const navigateToEditHomePage = (homePageId) => {
        navigate(`/edit-home-page/${homePageId}`);
    };
    
    const approveReview = (reviewId) => {
        axios.put(`/reviews/${reviewId}/approve`)
            .then(response => {
                const approvedReview = response.data;
                console.log('Approved review data:', approvedReview); // This will help verify the data structure
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
    const fetchApprovedReviews = () => {
        axios.get('/reviews/approved')
            .then(response => {
                setApprovedReviews(response.data);
            })
            .catch(error => console.error('Failed to fetch approved reviews:', error));
    };
    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const responses = await Promise.all([
                axios.get('/admin/users'),
                axios.get('/subscribe'),
                axios.get('/restaurants'),
                axios.get('/reviews/all'),
                axios.get('/admin/categories'),
                axios.get('/admin/menuItems'),
                axios.get('/api/locations'),
                axios.get('/api/cities'),
                axios.get('/api/countries'),
                axios.get('/api/homePages')
            ]);
            setData({
                users: responses[0].data,
                subscribers: responses[1].data,
                restaurants: responses[2].data,
                reviews: responses[3].data,
                categories: responses[4].data,
                menuItems: responses[5].data,
                locations: responses[6].data,
                cities: responses[7].data,
                countries: responses[8].data,
                homePages: responses[9].data
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }
    const getButtonStyle = (viewName) => {
        let backgroundColor = currentView === viewName ? 'gold' : '#f4f4f4'; // Active or inactive background
        if (hoverView === viewName) {
            backgroundColor = 'gold'; // Darker green on hover
        }

        return {
            backgroundColor,
            color: currentView === viewName ? 'white' : 'black', // White text for active, black for inactive
            padding: '10px',
            margin: '38px',
            border: 'none',
            fontSize:'23px',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease' // Smooth transition for background color
        };
    };
    const renderView = () => {
        switch (currentView) {
            case 'users':
                return <UsersTable />;
            case 'subscribers':
                return <SubscribersTable />;
            case 'restaurants':
                return <RestaurantsTable />;
            case 'reviews':
                return <ReviewsTable />;
            case 'categories':
                return <CategoriesTable />;
            case 'menuItems':
                return <MenuItemsTable />;
            case 'locations':
                return <LocationsTable />;
            case 'cities':
                return <CitiesTable />;
            case 'countries':
                return <CountriesTable />;
            case 'homePages':
                return <HomePagesTable />;
            default:
                return (
                    <div>
                        <h3 style={{ color: 'gold', marginLeft: '800px', paddingTop: '-51px' }}>Панель администратора</h3>
                        <div style={{
                            color: 'white',
                            marginBottom: '700px',
                            fontSize: '24px', // Larger font size
                            fontFamily: 'Arial, sans-serif', // Clean, widely supported font
                            textAlign: 'center', // Center the text for better aesthetics
                            fontWeight: 'bold', // Makes the text bold
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)', // Subtle text shadow for better readability on varying backgrounds
                            padding: '20px', // Add some padding around the text
                            borderRadius: '10px', // Optional: rounded corners for the container
                            backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent dark background for contrast
                            maxWidth: '80%', // Limit the maximum width of the text block
                            marginLeft: 'auto', // These two lines center the block horizontally
                            marginRight: 'auto',
                            marginTop: '50px' // Adds margin on the top for spacing
                        }}>Добро пожаловать в панель администратора. Выберите категорию, чтобы начать.</div>
                    </div>
                );
        }
    };

    return (
        <div style={{ backgroundImage: `url(${adming})` }}>
            <div className="admin-panel" style={{ paddingTop: '50px' }}>
                <div className="sidebar">
                    {['users', 'categories','menuItems','reviews', 'subscribers', 'homePages', 'restaurants',   'locations', 'cities', 'countries'].map(viewName => (
                        <button
                            key={viewName}
                            style={getButtonStyle(viewName)}
                            onClick={() => setCurrentView(viewName)}
                            onMouseEnter={() => setHoverView(viewName)}
                            onMouseLeave={() => setHoverView(null)}
                        >
                            {viewName.charAt(0).toUpperCase() + viewName.slice(1)} {/* Capitalize the first letter */}
                        </button>
                    ))}
                </div>
                <div className="content">
                    {renderView()}
                </div>
            </div>
            <footer className="footer" style={{ backgroundColor: 'black', color: 'gold', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '250px', height: '80px' }}>
                <SocialIcons />
                <div style={{ textAlign: 'center' }}>
                    <a style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bold' }}>© 2024 LA RESERVE. Все права защищены.</a>
                </div>
                <div>
                    <ul style={{ listStyleType: 'none', marginRight: '20px', display: 'flex', gap: '40px' }}>
                        <li><NavLink to="/contact" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}>КОНТАКТ</NavLink></li>
                        <li><NavLink to="/about" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}>О НАС</NavLink></li>
                        <li><NavLink to="/subscribe" style={{ color: 'gold', textDecoration: 'none', fontWeight: 'bolder', transition: 'color 0.3s ease' }}>НОВОСТНАЯ РАССЫЛКА</NavLink></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default AdminPanel;