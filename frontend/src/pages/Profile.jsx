import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [myBooks, setMyBooks] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');

      // Get token from context or localStorage
      const authToken = token || localStorage.getItem('token');
      
      if (!authToken) {
        setError('Please login to view your profile');
        setLoading(false);
        return;
      }

      // Fetch user's books
      const booksResponse = await axios.get(
        `${API_URL}/api/books`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      // Filter books added by current user
      const userBooks = booksResponse.data.books.filter(
        book => book.addedBy._id === user.id || book.addedBy === user.id
      );

      // Fetch user's reviews
      const reviewsResponse = await axios.get(
        `${API_URL}/api/reviews/user/${user.id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      setMyBooks(userBooks);
      setMyReviews(reviewsResponse.data.reviews || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <Link to="/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user?.name}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{myBooks.length}</p>
                  <p className="text-sm text-gray-600">Books Added</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{myReviews.length}</p>
                  <p className="text-sm text-gray-600">Reviews Written</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Books */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              My Books ({myBooks.length})
            </h2>
            <Link
              to="/add-book"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              + Add Book
            </Link>
          </div>

          {myBooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-600 mb-4">You haven't added any books yet.</p>
              <Link
                to="/add-book"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Add Your First Book
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBooks.map(book => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-xl transition-shadow bg-gray-50"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-3">by {book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {book.genre}
                    </span>
                    <span className="text-gray-500 text-sm">{book.publishedYear}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex gap-2">
                      <Link
                        to={`/edit-book/${book._id}`}
                        className="flex-1 text-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/books/${book._id}`}
                        className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-semibold"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Reviews */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            My Reviews ({myReviews.length})
          </h2>

          {myReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✍️</div>
              <p className="text-gray-600 mb-4">You haven't written any reviews yet.</p>
              <Link
                to="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {myReviews.map(review => (
                <div
                  key={review._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <Link
                    to={`/books/${review.bookId._id}`}
                    className="block"
                  >
                    <h3 className="text-xl font-bold text-blue-600 hover:text-blue-700 mb-2">
                      {review.bookId.title}
                    </h3>
                    <p className="text-gray-600 mb-3">by {review.bookId.author}</p>
                  </Link>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-600 font-semibold">
                      {review.rating}/5
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-3">
                    {review.reviewText}
                  </p>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <Link
                      to={`/books/${review.bookId._id}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      View Book →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
