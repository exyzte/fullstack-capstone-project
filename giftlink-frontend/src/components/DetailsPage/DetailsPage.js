import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailsPage.css';
import { urlConfig } from '../../config';

function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

	useEffect(() => {
        const authenticationToken = sessionStorage.getItem('auth-token');
        if (!authenticationToken) {
            navigate('/app/login');
            return;
        }
        const controller = new AbortController();
        // get the gift to be rendered on the details page
        const fetchGift = async () => {
            try {
				// Task 2: Fetch gift details
                const url = `${urlConfig.backendUrl}/api/gifts/${productId}`;
                const response = await fetch(url, {
                    signal: controller.signal,
                    headers: {
                        'Authorization': `Bearer ${authenticationToken}`,
                    }
                });
                if (!response.ok) {
                    throw new Error('Gift not found');
                }
                const data = await response.json();
                setGift(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();

		// Task 3: Scroll to top on component mount
		window.scrollTo(0, 0);
        return () => controller.abort();
        

    }, [productId, navigate]);


    const handleBackClick = () => {
		navigate(-1);
	};

	//The comments have been hardcoded for this project.
    const comments = [
        {
            author: "John Doe",
            comment: "I would like this!"
        },
        {
            author: "Jane Smith",
            comment: "Just DMed you."
        },
        {
            author: "Alice Johnson",
            comment: "I will take it if it's still available."
        },
        {
            author: "Mike Brown",
            comment: "This is a good one!"
        },
        {
            author: "Sarah Wilson",
            comment: "My family can use one. DM me if it is still available. Thank you!"
        }
    ];


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!gift) return <div>Gift not found. <button className="btn btn-secondary" onClick={handleBackClick}>Back</button></div>;

return (
        <div>
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
            <div className="card product-details-card">
                <div className="card-header text-white">
                    <h2 className="details-title">{gift.name}</h2>
                </div>
                <div className="card-body">
                    <div className="image-placeholder-large">
                        {gift.image ? (
			// Task 5: Display gift image
                            <img src={gift.image} alt={gift.name} className="product-image-large" />
                        ) : (
                            <div className="no-image-available-large">No Image Available</div>
                        )}
                    </div>
                    	<p><strong>Category:</strong>
                        <a>{gift.category}</a></p>
                    	<p><strong>Condition:</strong> 
                        <a>{gift.condition}</a>
                    	</p>
                    	<p><strong>Date Added:</strong><a>{gift.dateAdded}</a>
                        </p>
                    	<p><strong>Age (Years):</strong> 
				        <a>{gift.age}</a>
                    	</p>
                    	<p><strong>Description:</strong> 
				        <a>{gift.description}</a>
                    	</p>
                        <p><strong>Comments:</strong></p>
                        <div className="comments-section mt-4">
                        {gift.comments && gift.comments.length > 0 ? (
                            gift.comments.map((comment, index) => (
                                <div key={index} className="comment-box mb-2 p-2 border rounded">
                                    <p className="mb-1"><strong>{comment.author}:</strong> {comment.text}</p>
                                </div>
                            ))
                        ) : (
                            <p>No comments available from db.</p>
                        )}
                        </div>
                </div>
            </div>
            <div className="comments-section mt-4">
                <h3 className="mb-3">Comments</h3>
				{/* Task 7: Render comments section by using the map function to go through all the comments */}
				{comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <p className="comment-author"><strong>{comment.author}:</strong></p>
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
}

export default DetailsPage;