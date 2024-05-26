import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navigation from './components/navigation/Navigation';
import Hoho from './components/homepage/hoho';
import Menu from './components/menu/menu';
import LoadingScreen from './components/LoadingScreen';
import ContactForm from './components/contact/contact';
import NewsletterForm from './components/newsletter/newsl';
import Locations from './components/location/Locations';
import About from './components/about/About';
import EditHomePage from './components/admin/Editing/EditHomePage'; // Make sure the path matches where your component is located
import AddHomePage from './components/admin/Adding/AddHomePage'
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/registration/RegisterPage';
import ProfilePage from './components/profile/ProfilePage';
import  useScrollToTop from './components/useScrollToTop';
import Modal from './components/modal/Modal'; 
import BookingPage from './components/booking/BookingPage';
import AdminPanel from './components/admin/AdminPanel';
import Unauthorized from './components/Unauthorized';
import EditUser from './components/admin/Editing/EditUser';
import AddMenuItem from './components/admin/Adding/AddMenuItem';
import AddRestaurant from './components/admin/Adding/AddRestaurant';
import EditMenuItem from './components/admin/Editing/EditMenuItem';
import AddCity from'./components/admin/Adding/AddCity';
import ReviewForm from './components/review/ReviewForm';
import EditRestaurant from './components/admin/Editing/EditRestaurant'
import AddUser from './components/admin/Adding/AddUser';
import AddBooking from './components/admin/Adding/AddBooking'
import EditBooking from './components/admin/Editing/EditBooking';
import AdminEditBooking from './components/admin/Editing/adminEditBooking';
import UserBookings from './components/admin/UserBookings';
import UserEditBooking from './components/editingmenu/UserEditBooking';
import EditCategory from './components/admin/Editing/EditCategory';
import AddCategory from './components/admin/Adding/AddCategory';
import AddLocation from './components/admin/Adding/AddLocation';
import EditLocation from './components/admin/Editing/EditLocation';
import EditCity from './components/admin/Editing/EditCity';
import AddCountry from './components/admin/Adding/AddCountry';
import EditCountry from './components/admin/Editing/EditCountry';

function App() {
    useScrollToTop();
       const [isLoading, setIsLoading] = useState(true);
    const [contentVisible, setContentVisible] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const auth = useAuth();

    const navigate = useNavigate();  // Ensure navigate is declared correctly
    const location = useLocation();
    useScrollToTop();
    const userRole = auth.userRole; // Assume this is how you access the role
    const handleLogout = () => {
        auth.logout();
        navigate('/login');  // Redirect to login page after logout
    };

    useEffect(() => {
        setIsLoading(true);
        setContentVisible(false);

        const timer = setTimeout(() => {
            setIsLoading(false);
            setContentVisible(true);
        }, 700);
        return () => clearTimeout(timer);
    }, []);


    const handleBookingClick = () => {
        // Ensure user is directed to the booking page or handled properly
        navigate('/booking');
    };
    useEffect(() => {
        const publicPaths = ['/', '/menus', '/contact', '/subscribe', '/locations', '/about'];
        const pathRequiresAuth = !publicPaths.includes(location.pathname);

        if (!auth.currentUser && pathRequiresAuth && location.pathname !== '/login' && location.pathname !== '/register') {
            navigate('/login');
        }
    }, [auth.currentUser, location.pathname, navigate]);

    // Properly formatted dependency array


    return (
        <>
            <NavigationLoader setIsLoading={setIsLoading} setContentVisible={setContentVisible} />
            <LoadingScreen show={isLoading} />
            <header>

                <h1>
                    <NavLink to="/" style={{ textDecoration: 'none' }}>
                        <span className="la">LA </span>
                        <span className="reserve">RESERVE </span>
                    </NavLink>
                </h1>
                <Navigation onLogout={handleLogout} onBookingClick={handleBookingClick} />
            </header>
            <div style={{ visibility: contentVisible ? 'visible' : 'hidden' }}>
                <Routes>
                    <Route path="/" element={<Hoho />} />
                    <Route path="/menus" element={<Menu />} />
                    <Route path="/contact" element={<ContactForm />} />
                    <Route path="/subscribe" element={<NewsletterForm />} />
                    <Route path="/locations" element={<Locations />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={auth.currentUser ? <Navigate replace to="/profile" /> : <LoginPage />} />
                    <Route path="/register" element={auth.currentUser ? <Navigate replace to="/profile" /> : <RegisterPage />} />
                    <Route path="/profile" element={auth.currentUser ? <ProfilePage /> : <Navigate replace to="/login" />} />
                    <Route path="/booking" element={auth.currentUser ? <BookingPage /> : <Navigate replace to="/login" />} />
                    <Route path="/edit-booking/:bookingId" element={<UserEditBooking />} />
                    <Route path="/adminpanel" element={auth.currentUser && auth.currentUser.role === 'admin' ? <AdminPanel /> : <Navigate to="/unauthorized" />} />
                    <Route path="/edit-user/:userId" element={auth.currentUser && auth.currentUser.role === 'admin' ? <EditUser /> : <Navigate to="/unauthorized" />} />
                    <Route path="/add-user" element={auth.currentUser && auth.currentUser.role === 'admin' ? <AddUser /> : <Navigate to="/unauthorized" />} />
                    <Route path="/admin/user/:userId/bookings"  element={auth.currentUser && auth.currentUser.role === 'admin' ? <UserBookings /> : <Navigate to="/unauthorized" />} />
                    <Route path="/add-booking/:userId" element={auth.currentUser && auth.currentUser.role === 'admin' ? <AddBooking /> : <Navigate to="/unauthorized" />} />
                    <Route path="/admin/user/:userId/edit-booking/:bookingId" element={auth.currentUser && auth.currentUser.role === 'admin' ? <AdminEditBooking /> : <Navigate to="/unauthorized" />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/edit-category/:categoryId" element={auth.currentUser && auth.currentUser.role === 'admin' ? <EditCategory /> : <Navigate to="/unauthorized" />} />
                    <Route path="/add-category" element={auth.currentUser && auth.currentUser.role === 'admin' ? <AddCategory /> : <Navigate to="/unauthorized" />} />
                    <Route path="/add-menu-item" element={auth.currentUser && auth.currentUser.role === 'admin' ? <AddMenuItem /> : <Navigate to="/unauthorized" />} />
                    <Route path="/edit-menu-item/:menuItemId" element={auth.currentUser && auth.currentUser.role === 'admin' ? <EditMenuItem /> : <Navigate to="/unauthorized" />} />
                    <Route path="/add-restaurant" element={auth.currentUser && auth.currentUser.role === 'admin' ? <AddRestaurant /> : <Navigate to="/unauthorized" />} />
                    <Route path="/edit-restaurant/:id" element={auth.currentUser && auth.currentUser.role === 'admin' ? <EditRestaurant /> : <Navigate to="/unauthorized" />} />
                    <Route path="/add-location" element={auth.currentUser && auth.currentUser.role === 'admin' ? <AddLocation /> : <Navigate to="/unauthorized" />} />
                    <Route path="/edit-location/:locationId" element={auth.currentUser && auth.currentUser.role === 'admin' ? <EditLocation /> : <Navigate to="/unauthorized" />} />
                    <Route path="/add-city" element={auth.currentUser && auth.currentUser.role === 'admin' ? <AddCity /> : <Navigate to="/unauthorized" />} />
                    <Route path="/edit-city/:cityId" element={auth.currentUser && auth.currentUser.role === 'admin' ? <EditCity /> : <Navigate to="/unauthorized" />} />
                    <Route path="/add-country" element={auth.currentUser && auth.currentUser.role === 'admin' ? <AddCountry /> : <Navigate to="/unauthorized" />} />
                    <Route path="/edit-country/:countryId" element={auth.currentUser && auth.currentUser.role === 'admin' ? <EditCountry /> : <Navigate to="/unauthorized" />} />
                    <Route path="/edit-home-page/:id" element={auth.currentUser && auth.currentUser.role === 'admin' ? <EditHomePage /> : <Navigate to="/unauthorized" />} />

                </Routes>
                <footer style={{
                    backgroundColor: 'black',
                    color: 'gold',
                    padding: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '80px'
                }}>
                    {/* Footer content */}
                </footer>
            </div>
        </>
    );
}
function NavigationLoader({ setIsLoading, setContentVisible }) {
    const location = useLocation();

    useEffect(() => {
        setIsLoading(true);
        setContentVisible(false);

        // Check if the current path is '/menus'
        let timeoutDuration;
        if (location.pathname === '/menus') {
            timeoutDuration = 1000;  // Longer loading for menus
        } else if (location.pathname === '/register') {
            timeoutDuration = 1500;  // Longer loading for register
        } else {
            timeoutDuration = 1000;   // Default loading time for other pages
        }
        const timer = setTimeout(() => {
            setIsLoading(false);
            setContentVisible(true);
        }, timeoutDuration);

        return () => clearTimeout(timer);
    }, [location, setIsLoading, setContentVisible]);

    return null; // This component does not render anything
}
function RootComponent() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}

export default RootComponent;
