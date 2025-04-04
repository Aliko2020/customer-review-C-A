const express = require('express');
const mongoose = require('mongoose');
const Review = require('./models/reviews');
const cors = require('cors');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());  // Allow requests from all origins

const dbURI = 'mongodb+srv://alikoamosofficial:xTX1CihExp5kRfEf@cluster0.tiogkyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const port = process.env.PORT || 5000;

// Connect to MongoDB using Mongoose
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Route to add a new review
app.post('/reviews', async (req, res) => {
    const { name, number, product, review, rating } = req.body;
  
    try {
      const newReview = new Review({
        name,
        number,
        product,
        review,
        rating,
      });
  
      // Save the new review to the database
      await newReview.save();
      res.status(201).json({ message: 'Review added successfully!', review: newReview });
    } catch (error) {
      console.error('Error adding review:', error); // Log the error details
      res.status(500).json({ message: 'Error adding review', error: error.message });
    }
  });

// Route to fetch reviews
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();  // Fetch all reviews from the database
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
