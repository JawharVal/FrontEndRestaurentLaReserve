import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';

function Modalqs({ show, onClose }) {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
        onClose();
    };

    const handleBackdropClick = (event) => {
        if (event.target.id === "modal-backdrop") {
            onClose();
        }
    };

    if (!show) return null;

    return (
        <div id="modal-backdrop" className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal">
                <p>Please login to submit a review.</p>
                <button onClick={handleLoginRedirect}>Go to Login</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default Modalqs;
