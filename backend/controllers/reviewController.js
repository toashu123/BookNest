import Review from '../models/Review.js';
import Book from '../models/Book.js';

// @desc    Create review for a book
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body;

    // Validation
    if (!bookId || !rating || !reviewText) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      bookId,
      userId: req.user.userId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this book. Please update your existing review.' 
      });
    }

    // Create review
    const review = await Review.create({
      bookId,
      userId: req.user.userId,
      rating: parseInt(rating),
      reviewText
    });

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name');

    res.status(201).json({ 
      success: true,
      message: 'Review created successfully',
      review: populatedReview 
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    const { rating, reviewText } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, reviewText },
      { new: true, runValidators: true }
    ).populate('userId', 'name');

    res.json({ 
      success: true,
      message: 'Review updated successfully',
      review: updatedReview 
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true,
      message: 'Review deleted successfully' 
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all reviews by user
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true,
      reviews,
      count: reviews.length 
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
