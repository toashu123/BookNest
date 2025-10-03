import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    enum: {
      values: ['Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Other'],
      message: '{VALUE} is not a valid genre'
    }
  },
  publishedYear: {
    type: Number,
    required: [true, 'Please provide a publication year'],
    min: [1000, 'Invalid year'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true 
});

// Index for searching
bookSchema.index({ title: 'text', author: 'text' });

const Book = mongoose.model('Book', bookSchema);

export default Book;
