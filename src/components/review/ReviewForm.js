import React, { useState, useContext } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import axios from 'axios';
import { useAuth } from '../../AuthContext'; // Adjust this path according to your project structure
import './ReviewForm.css';

const ReviewForm = () => {
    const { currentUser } = useAuth(); // Accessing the current user from AuthContext
    const [ratings, setRatings] = useState({
        food: 0,
        service: 0,
        ambience: 0,
        valueForMoney: 0,
        cleanliness: 0,
    });
    const [comments, setComments] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState('');

    const handleStarClick = (nextValue, prevValue, name) => {
        setRatings({ ...ratings, [name]: nextValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setSubmissionStatus(<span style={{ color: 'red',margin:'200px' }}>You must be logged in to submit a review.</span>);
            return;
        }

        console.log("Current User:", currentUser);
        const reviewData = {
            userId: currentUser.id, // Correctly reference the userID from currentUser
            foodRating: ratings.food,
            serviceRating: ratings.service,
            ambienceRating: ratings.ambience,
            valueForMoneyRating: ratings.valueForMoney,
            cleanlinessRating: ratings.cleanliness,
            comments,
        };
        console.log("Review Data being sent:", reviewData);

        try {
            const response = await axios.post('/reviews', reviewData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Review submitted:', response.data);
            setSubmissionStatus('Thank you! Your review has been submitted.');
        } catch (error) {
            console.error('Error submitting review:', error);
            setSubmissionStatus('Error submitting review: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h2>ОСТАВЬТЕ НАМ ОТЗЫВ!</h2>
            <p>Ваше мнение важно для ресторана и всего мира!</p>
            <div className="rating-group">
                <div className="rating-item">
                    <label>Еда</label>
                    <StarRatingComponent
                        name="food"
                        starCount={5}
                        value={ratings.food}
                        onStarClick={handleStarClick}
                    />
                </div>
                <div className="rating-item">
                    <label>Обслуживание</label>
                    <StarRatingComponent
                        name="service"
                        starCount={5}
                        value={ratings.service}
                        onStarClick={handleStarClick}
                    />
                </div>
            </div>
            <div className="rating-group">
                <div className="rating-item">
                    <label>Атмосфера</label>
                    <StarRatingComponent
                        name="ambience"
                        starCount={5}
                        value={ratings.ambience}
                        onStarClick={handleStarClick}
                    />
                </div>
                <div className="rating-item">
                    <label>Соотношение цена/качество</label>
                    <StarRatingComponent
                        name="valueForMoney"
                        starCount={5}
                        value={ratings.valueForMoney}
                        onStarClick={handleStarClick}
                    />
                </div>
            </div>
            <div className="rating-item">
                <label>Чистота</label>
                <StarRatingComponent
                    name="cleanliness"
                    starCount={5}
                    value={ratings.cleanliness}
                    onStarClick={handleStarClick}
                />
            </div>
            <div>
                <label>Расскажите о вашем опыте в La Reserve</label>
                <textarea
                    placeholder="Оставьте отзыв о вашем визите в La Reserve"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="review-textarea"
                />
            </div>
            <button type="submit" className="submit-button5">Отправить ваш отзыв</button>
            {submissionStatus && <h3 className="submission-status">{submissionStatus}</h3>}
        </form>
    );
};

export default ReviewForm;