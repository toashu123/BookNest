import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Book from '../models/Book.js';
import User from '../models/User.js';

dotenv.config();

const importBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Get or create user
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        name: 'Admin',
        email: 'admin@booknest.com',
        password: 'admin123'
      });
    }

    const subjects = ['fiction', 'science_fiction', 'mystery', 'romance', 'fantasy', 'thriller'];
    const allBooks = [];

    for (const subject of subjects) {
      console.log(`Fetching ${subject} books...`);
      
      const response = await axios.get(
        `https://openlibrary.org/subjects/${subject}.json?limit=10`
      );

      const books = response.data.works.map(work => ({
        title: work.title,
        author: work.authors?.[0]?.name || 'Unknown Author',
        description: `An engaging ${subject.replace('_', ' ')} book that captivates readers with its compelling narrative.`,
        genre: mapGenre(subject),
        publishedYear: work.first_publish_year || 2020,
        addedBy: user._id
      }));

      allBooks.push(...books);
    }

    // Remove duplicates
    const uniqueBooks = Array.from(
      new Map(allBooks.map(book => [book.title, book])).values()
    );

    await Book.insertMany(uniqueBooks);
    console.log(`✅ Successfully imported ${uniqueBooks.length} books!`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

const mapGenre = (subject) => {
  const genres = {
    'fiction': 'Fiction',
    'science_fiction': 'Sci-Fi',
    'mystery': 'Mystery',
    'romance': 'Romance',
    'fantasy': 'Fantasy',
    'thriller': 'Thriller'
  };
  return genres[subject] || 'Other';
};

importBooks();
