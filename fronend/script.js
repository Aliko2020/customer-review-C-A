const reviews = [];
const reviewsPerPage = 3;
let currentPage = 1;

const displayReviews = async () => {
    const testimonialsContainer = document.getElementById("testimonialsContainer");
    testimonialsContainer.innerHTML = ""; 

    try {
        const response = await fetch('https://customer-review-backend.onrender.com/reviews');
        const data = await response.json();

        reviews.push(...data);

        const start = (currentPage - 1) * reviewsPerPage;
        const end = start + reviewsPerPage;
        const reviewsToShow = reviews.slice(start, end);

        reviewsToShow.forEach(review => {
            const testimonialHTML = `
                <div class="testimonial">
                    <h3>${review.name}</h3>
                    <p><strong>Product:</strong> ${review.product}</p>
                    <p><strong>Review:</strong> ${review.review}</p>
                    <p><strong>Rating:</strong> ${review.rating}</p>
                    <p class="number"><strong>Phone Number:</strong> ${review.number}</p>
                    <p class="timestamp"><strong>Reviewed on:</strong> ${new Date(review.createdAt).toLocaleString()}</p>
                </div>
            `;
            testimonialsContainer.insertAdjacentHTML("beforeend", testimonialHTML);
        });

        displayPagination();
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
};

const displayPagination = () => {
    const paginationControls = document.getElementById("paginationControls");
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    paginationControls.innerHTML = ""; 

    if (currentPage > 1) {
        paginationControls.innerHTML += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
    }

    if (currentPage < totalPages) {
        paginationControls.innerHTML += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
    }
};

const changePage = (page) => {
    if (page > 0 && page <= Math.ceil(reviews.length / reviewsPerPage)) {
        currentPage = page;
        displayReviews();
    }
};

// Initialize page
window.onload = () => {
    displayReviews(); 
    document.getElementById('testimonialForm').addEventListener('submit', handleReviewSubmit);
};


const showPopup = () => {
    const popup = document.getElementById("popupNotification");
    popup.style.display = "block";
};


const closePopup = () => {
    const popup = document.getElementById("popupNotification");
    popup.style.display = "none";
};


const handleReviewSubmit = async (event) => {
    event.preventDefault();

    const reviewData = {
        name: document.getElementById("name").value,
        number: document.getElementById("number").value,
        product: document.getElementById("product").value,
        review: document.getElementById("review").value,
        rating: document.getElementById("rating").value, 
    };

    if (!reviewData.rating) {
        alert('Please select a rating.');
        return;
    }

    try {
        const response = await fetch('https://customer-review-backend.onrender.com/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Review added successfully:', data);
            reviews.unshift(data.review);
            displayReviews();
            showPopup(); 
        } else {
            const errorDetails = await response.json();
            console.error('Error:', errorDetails);
        }
    } catch (error) {
        console.error('Error submitting review:', error);
    }
};
