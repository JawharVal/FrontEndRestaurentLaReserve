import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../AdminPanel.css';
import adming from '../../../assets/images/admins/admin.jpg';
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StarRatingComponent from 'react-star-rating-component';
function SubscribersTable() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [subscribers, setSubscribers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [currentView, setCurrentView] = useState('users');
    const [data, setData] = useState({ users: [], subscribers: [], restaurants: [], reviews: [], categories: [], menuItems: [], locations: [], cities: [], countries: [], homePages: [] });
    const [homePages, setHomePages] = useState([]);
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
        fetchReviews();
        fetchApprovedReviews();
        fetchHomePages();
        fetchSubscribers();
    }, []);
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
            axios.delete(`/subscribe/${email}`)
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
        console.log("Attempting to delete review with ID:", reviewId);

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
    return (
        <div className="admin-panel"style={{ paddingTop: '50px',paddingBottom: '250px'}}>
            <h3 style={{ color: 'gold', marginLeft:'800px' ,paddingTop:'-51px'}}>Панель администратора</h3>

            <h3 style={{color: 'gold' }} >Подписчики</h3>
    <table className="users-table">
            <thead>
            <tr>
                <th>Э-почта</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            {subscribers.map(subscriber => (
                <tr key={subscriber.email}>
                    <td>{subscriber.email}</td>
                    <td>{subscriber.firstName}</td>
                    <td>{subscriber.lastName}</td>
                    <td>
                        <button onClick={() => deleteSubscriber(subscriber.email)} className="button-delete" style={{ background: 'salmon', color: 'white'}}>УДАЛИТЬ</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
            </div>
    );
}

export default SubscribersTable;
