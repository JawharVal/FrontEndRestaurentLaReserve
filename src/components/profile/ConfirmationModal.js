import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Подтвердить удаление</h2>
                <p>Вы уверены, что хотите отменить это бронирование?</p>
                <button onClick={onConfirm}>Да, отменить</button>
                <button onClick={onClose}>Возвращаться</button>
            </div>
        </div>
    );
}

export default ConfirmationModal;
