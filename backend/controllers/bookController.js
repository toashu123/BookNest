import Book from '../models/Book.js';
import Review from '../models/Review.js';

// Helper function to calculate ratings
const calculateBookRating = async (bookId) => {
  const reviews = await Review.find({ bookId });
  if (reviews.length === 0) return { averageRating: 0, reviewCount: 0 };
  
  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return {
    averageRating: parseFloat(avgRating.toFixed(1)),
    reviewCount: reviews.length
  };
};

// Get all books with pagination and filters
export const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    const { search, genre, sort } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'title') sortOption = { title: 1 };
    if (sort === 'author') sortOption = { author: 1 };
    if (sort === 'year') sortOption = { publishedYear: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };

    const books = await Book.find(query)
      .populate('addedBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    // Add ratings to each book
    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const { averageRating, reviewCount } = await calculateBookRating(book._id);
        return {
          ...book.toObject(),
          averageRating,
          reviewCount
        };
      })
    );

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      books: booksWithRatings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'name email');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get reviews for this book
    const reviews = await Review.find({ bookId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    // Calculate average rating - FIX HERE
    let avgRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      avgRating = totalRating / reviews.length;
    }

    // Calculate rating distribution
    const ratingDistribution = [1, 2, 3, 4, 5].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length
    }));

    res.json({ 
      success: true,
      book, 
      reviews, 
      averageRating: parseFloat(avgRating.toFixed(1)), // Ensure it's always a number
      totalReviews: reviews.length,
      ratingDistribution
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Create new book
export const createBook = async (req, res) => {
  try {
    const { title, author, description, genre, publishedYear } = req.body;

    console.log('Creating book with data:', req.body); // Debug log
    console.log('User ID from token:', req.user.userId); // Debug log

    // Validation
    if (!title || !author || !description || !genre || !publishedYear) {
      return res.status(400).json({ 
        message: 'Please provide all required fields',
        missing: {
          title: !title,
          author: !author,
          description: !description,
          genre: !genre,
          publishedYear: !publishedYear
        }
      });
    }

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      publishedYear: parseInt(publishedYear),
      addedBy: req.user.userId
    });

    const populatedBook = await Book.findById(book._id).populate('addedBy', 'name email');

    console.log('Book created successfully:', populatedBook); // Debug log

    res.status(201).json({ 
      success: true, 
      message: 'Book created successfully',
      book: populatedBook 
    });
  } catch (error) {
    console.error('Create book error:', error); // Debug log
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: messages 
      });
    }

    res.status(500).json({ 
      message: 'Server error while creating book', 
      error: error.message 
    });
  }
};


// Update book
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the one who added the book
    if (book.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'You can only update books you added' 
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete book
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the one who added the book
    if (book.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'You can only delete books you added' 
      });
    }

    // Delete all reviews for this book
    await Review.deleteMany({ bookId: req.params.id });

    await Book.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Book and associated reviews deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
