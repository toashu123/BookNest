import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from '../config/api';

const BookDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

   const fetchBookDetails = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/books/${id}`);
      setBook(data.book);
      setReviews(data.reviews || []); // Default to empty array
      setAverageRating(data.averageRating || 0); // Default to 0
      setTotalReviews(data.totalReviews || 0); // Default to 0
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/reviews`,
        {
          bookId: id,
          rating: parseInt(rating),
          reviewText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReviewText("");
      setRating(5);
      fetchBookDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (error) {
      alert("Failed to delete book");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookDetails();
    } catch (error) {
      alert("Failed to delete review");
    }
  };

  const StarRating = ({ rating, size = "w-6 h-6" }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${size} ${
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-gray-700">
            Loading book details...
          </p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">📚</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Book not found
          </h2>
          <Link
            to="/"
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && book.addedBy?._id === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-8 transition-colors group"
        >
          <svg
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to books
        </Link>

        {/* Book Details Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8">
          <div className="grid md:grid-cols-3 gap-8 p-8 md:p-12">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="relative h-96 bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 rounded-2xl flex items-center justify-center shadow-xl">
                <svg
                  className="w-32 h-32 text-orange-300 opacity-40"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <span className="text-sm font-bold text-gray-800">
                    {book.genre}
                  </span>
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
                    {book.title}
                  </h1>
                  <p className="text-2xl text-gray-600 mb-6">
                    by {book.author}
                  </p>
                </div>
                {isOwner && (
                  <div className="flex gap-2 ml-4">
                    <Link
                      to={`/edit-book/${id}`}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={handleDeleteBook}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-5xl font-black text-gray-900">
                    {averageRating ? averageRating.toFixed(1) : "0.0"}
                  </span>
                  <StarRating rating={averageRating || 0} size="w-8 h-8" />
                </div>
                <span className="text-gray-600 font-medium">
                  ({totalReviews || 0}{" "}
                  {totalReviews === 1 ? "review" : "reviews"})
                </span>
              </div>
              <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-5xl font-black text-gray-900">
                    {(averageRating || 0).toFixed(1)}
                  </span>

                  <StarRating rating={averageRating} size="w-8 h-8" />
                </div>
                <span className="text-gray-600 font-medium">
                  ({totalReviews} reviews)
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Published Year</p>
                  <p className="text-xl font-bold text-gray-900">
                    {book.publishedYear}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Added By</p>
                  <p className="text-xl font-bold text-gray-900">
                    {book.addedBy?.name}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  About this book
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Write Review */}
        {isAuthenticated && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              Write a Review
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        rating === num
                          ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg scale-105"
                          : "bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-400"
                      }`}
                    >
                      {num} ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this book..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all resize-none"
                  rows="6"
                  required
                  minLength={10}
                  maxLength={1000}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {reviewText.length}/1000 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-8 py-4 rounded-xl font-bold disabled:opacity-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          <h2 className="text-3xl font-black text-gray-900 mb-8">
            Reviews ({totalReviews})
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✍️</div>
              <p className="text-xl text-gray-600">
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {review.userId.name}
                      </p>
                      <StarRating rating={review.rating} />
                    </div>
                    {user && review.userId._id === user.id && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {review.reviewText}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
