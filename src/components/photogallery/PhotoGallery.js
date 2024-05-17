import React, { useState } from 'react';
import { FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './PhotoGallery.css';  // Make sure to create a corresponding CSS file

const PhotoGallery = ({ photos }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    const openModal = (index) => {
        setCurrentImgIndex(index);
        setIsOpen(true);
    };

    const closeModal = (e) => {
        e.preventDefault();  // Prevent any default action
        e.stopPropagation();  // Stop the event from bubbling up
        setIsOpen(false);
    };

    const goNext = () => {
        setCurrentImgIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const goPrev = () => {
        setCurrentImgIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

    return (
        <div className="gallery" style={{ marginLeft: '1020px' }}>
            {photos.map((photo, index) => (
                <img
                    key={index}
                    src={photo.src}
                    alt={photo.alt}
                    className={`gallery-img ${index % 2 === 0 ? 'large' : ''}`}
                    onClick={() => openModal(index)}
                />
            ))}
            {isOpen && (
                <div className="modalq">
                    <div className="modalq-content">
                        <span className="close" onClick={(e) => closeModal(e)}><FaTimes /></span>
                        <img src={photos[currentImgIndex].src} alt={photos[currentImgIndex].alt} className="enlarged-img" />
                    </div>
                    <button onClick={goPrev} className="modalq-nav prev"><FaArrowLeft /></button>
                    <button onClick={goNext} className="modalq-nav next"><FaArrowRight /></button>
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;
