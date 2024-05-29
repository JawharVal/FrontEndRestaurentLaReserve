import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';
function Modal({ show, onClose }) {
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
            <div className="modal" style={{  border: '3px solid #000000' }}>
                <h3>Вам необходимо войти в систему, чтобы сделать бронирование.</h3>
                <div style={{  marginLeft:'10ox' }}>
                <button  onClick={handleLoginRedirect}>Перейти к входу</button>
                </div>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
}

export default Modal;
