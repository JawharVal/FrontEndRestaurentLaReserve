import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';
import adming from '../../assets/images/admins/admin.jpg';
import { faFacebookSquare, faInstagram, faVk } from '@fortawesome/free-brands-svg-icons';
import { NavLink, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StarRatingComponent from 'react-star-rating-component';
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
        axios.get('/subscribe') // Make sure the endpoint matches your server's route
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
                    const updatedReviews = reviews.filter(review => review.id !== reviewId); // Ensure filtering is working
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
        navigate(`/edit-restaurant/${restaurantId}`);  // Assuming you have a route set up for editing a restaurant
    };
    const fetchCategories = () => {
        axios.get('/admin/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Failed to fetch categories:', error));
    };

    const navigateToAddLocation = () => {
        navigate('/add-location'); // Make sure the route is set up in your Router
    };

    const navigateToEditLocation = (locationId) => {
        navigate(`/edit-location/${locationId}`); // Make sure the route is set up in your Router
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
        navigate(`/edit-category/${categoryId}`);  // Assuming you have a route set up for editing a category
    };

    const navigateToAddMenuItem = () => {
        navigate('/add-menu-item');  // Navigate to Add Menu Item component
    };

    const navigateToEditMenuItem = (menuItemId) => {
        navigate(`/edit-menu-item/${menuItemId}`);  // Assuming you have a route set up for editing a menu item
    };
    const navigateToAddUser = () => {
        navigate('/add-user');  // Navigate to Add User component
    };
    const navigateToEditUser = (userId) => {
        navigate(`/edit-user/${userId}`);  // Assuming you have a route set up for editing a user
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
                    // Optionally, filter out the review from the main list if it should no longer show there
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
        <div style={{ backgroundImage: `url(${adming})`}}>
            <div className="admin-panel"style={{ paddingTop: '50px'}}>
                <h3 style={{ color: 'gold', marginLeft:'800px' ,paddingTop:'-51px'}}>Панель администратора</h3>
                <button onClick={navigateToAddUser}style={styles.button}

                >ДОБАВИТЬ НОВОГО ПОЛЬЗОВАТЕЛЯ</button >
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Э-почта</th>
                        <th>Имя</th>
                        <th>Город</th>
                        <th>Область</th>
                        <th>Роль</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>{user.city}</td>
                            <td>{user.region}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => navigateToEditUser(user.id)}style={styles.buttone}>РЕДАКТИРОВАТЬ</button>
                                <button onClick={() => deleteUser(user.id)}style={styles.buttond}>УДАЛИТЬ</button>
                                <button onClick={() => navigateToUserBookings(user.id)}style={styles.buttonb}>ПОСМОТРЕТЬ БРОНИРОВАНИЕ</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button onClick={navigateToAddCategory} style={styles.button}>ДОБАВИТЬ НОВУЮ КАТЕГОРИЮ</button>
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map(category => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>
                                <button onClick={() => deleteCategory(category.id)} style={styles.buttond}>УДАЛИТЬ</button>
                                <button onClick={() => navigateToEditCategory(category.id)} style={styles.buttone}>РЕДАКТИРОВАТЬ</button>


                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Menu Items Table */}
                <button onClick={navigateToAddMenuItem} style={styles.button}>ДОБАВИТЬ НОВЫЙ МЕНЮ</button>
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Описание</th>
                        <th>URL изображения</th>
                        <th>Цена</th>
                        <th>Раздела</th>
                        <th>ID Категории</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {menuItems.map(menuItem => (
                        <tr key={menuItem.id}>
                            <td>{menuItem.id}</td>
                            <td>{menuItem.name}</td>
                            <td>{menuItem.description}</td>
                            <td>
                                <img src={menuItem.imageUrl} alt={menuItem.name} style={{ width: "100px", height: "auto" }} />
                            </td>
                            <td>${menuItem.price.toFixed(2)}</td>
                            <td>{menuItem.section}</td>
                            <td>{menuItem.categoryId}</td>
                            <td>
                                <button onClick={() => navigateToEditMenuItem(menuItem.id)} style={{ background: 'lightblue', color: 'black'}}>РЕДАКТИРОВАТЬ</button>
                                <button onClick={() => deleteMenuItem(menuItem.id)} style={{ background: 'salmon', color: 'white'}}>УДАЛИТЬ</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button onClick={navigateToAddRestaurant} style={styles.button}>ДОБАВИТЬ НОВЫЙ РЕСТОРАН</button>
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Расположение</th>
                        <th>Кухня</th>
                        <th>Емкость</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {restaurants.map(restaurant => (
                        <tr key={restaurant.id}>
                            <td>{restaurant.id}</td>
                            <td>{restaurant.name}</td>
                            <td>{restaurant.locationName}</td>
                            <td>{restaurant.cuisine}</td>
                            <td>{restaurant.capacity}</td>
                            <td>
                                <button onClick={() => navigateToEditRestaurant(restaurant.id)} style={{ background: 'lightblue', color: 'black' }}>РЕДАКТИРОВАТЬ</button>
                                <button onClick={() => deleteRestaurant(restaurant.id)} style={{ background: 'salmon', color: 'white'}}>УДАЛИТЬ</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button onClick={navigateToAddLocation} style={styles.button}>ДОБАВИТЬ НОВОЕ МЕСТОПОЛОЖЕНИЕ</button>
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Адрес</th>
                        <th>Город</th>
                        <th>Почтовый индекс</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {locations.map(location => (
                        <tr key={location.locationId}>
                            <td>{location.locationId}</td>
                            <td>{location.address}</td>
                            <td>{location.city ? location.city.name : 'No City'}</td>
                            <td>{location.postalCode}</td>
                            <td>
                                <button onClick={() => navigateToEditLocation(location.locationId)} style={styles.buttone}>РЕДАКТИРОВАТЬ</button>
                                <button onClick={() => deleteLocation(location.locationId)} style={styles.buttond}>УДАЛИТЬ</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button onClick={navigateToAddCity} style={styles.button}>ДОБАВИТЬ НОВЫЙ ГОРОД</button>
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Страна</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cities.map(city => (
                        <tr key={city.cityId}>
                            <td>{city.cityId}</td>
                            <td>{city.name}</td>
                            <td>{city.country.name}</td>
                            <td>
                                <button onClick={() => navigateToEditCity(city.cityId)} style={styles.buttone}>РЕДАКТИРОВАТЬ</button>
                                <button onClick={() => deleteCity(city.cityId)} style={styles.buttond}>УДАЛИТЬ</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button onClick={navigateToAddCountry} style={styles.button}>ДОБАВИТЬ НОВУЮ СТРАНУ</button>
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {countries.map(country => (
                        <tr key={country.countryId}>
                            <td>{country.countryId}</td>
                            <td>{country.name}</td>
                            <td>
                                <button onClick={() => navigateToEditCountry(country.countryId)} style={styles.buttone}>РЕДАКТИРОВАТЬ</button>
                                <button onClick={() => deleteCountry(country.countryId)} style={styles.buttond}>УДАЛИТЬ</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
                <h3 style={{color: 'gold' }} >Карусель Фото</h3>
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>Идентификатор</th>
                        <th>Название</th>
                        <th>изображения</th>
                        <th>Действия</th>

                    </tr>
                    </thead>
                    <tbody>
                    {homePages.map(homePage => (
                        <tr key={homePage.id}>
                            <td>{homePage.id}</td>
                            <td>{homePage.title}</td>
                            <td>
                                {homePage.imageUrls.map((url, index) => (
                                    <img key={index} src={url} alt={`Home page ${homePage.id} - image ${index}`} style={{width: "100px", height: "auto"}} />
                                ))}
                            </td>

                            <td>
                                <button onClick={() => navigateToEditHomePage(homePage.id)} style={styles.buttone}>РЕДАКТИРОВАТЬ</button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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
                                <button onClick={() => deleteSubscriber(subscriber.email)} style={{ background: 'salmon', color: 'white'}}>УДАЛИТЬ</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <h3 style={{color: 'gold' }} >Отзывы</h3>
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID пользователя</th>
                        <th>Оценка еды</th>
                        <th>Оценка обслуживания</th>
                        <th>Оценка обстановки</th>
                        <th>Оценка соотношения цены и качества</th>
                        <th>Оценка чистоты</th>
                        <th>Комментарии</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reviews.map((review) => (
                        <tr key={review.id}>
                            <td>{review.id}</td>
                            <td>{review.userId}</td>
                            <td>{review.foodRating}</td>
                            <td>{review.serviceRating}</td>
                            <td>{review.ambienceRating}</td>
                            <td>{review.valueForMoneyRating}</td>
                            <td>{review.cleanlinessRating}</td>
                            <td>{review.comments}</td>
                            <td>
                                <button onClick={() => deleteReview(review.id)} style={{ background: 'salmon', color: 'white'}}>УДАЛИТЬ</button>
                            </td>
                            <td>
                                <button onClick={() => approveReview(review.id)} style={{ background: 'lightgreen', color: 'white'}}>
                                    УТВЕРДИТЬ
                                </button>
                            </td>
                        </tr>
                    ))}

                    </tbody>
                </table>

            </div>
            <footer className="hoho-footer" style={{ backgroundColor: 'black', color: 'gold', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'250px',height: '80px' }}>
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

export default AdminPanel;
