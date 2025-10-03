import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from '../config/api';

const BookList = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("latest");
  const [favorites, setFavorites] = useState(new Set());

  const genres = [
    "All",
    "Fiction",
    "Science Fiction",
    "Historical Fiction",
    "Self-Help",
    "Mystery",
    "Thriller",
    "Romance",
    "Fantasy",
    "Biography",
    "History",
    "Other",
  ];

  useEffect(() => {
    fetchBooks();
  }, [currentPage, search, genre, sort]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/api/books?page=${currentPage}&search=${search}&genre=${genre}&sort=${sort}`
      );
      setBooks(data.books);
      setTotalPages(data.totalPages);
      setTotalBooks(data.totalBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleGenreChange = (selectedGenre) => {
    setGenre(selectedGenre);
    setCurrentPage(1);
  };

  const toggleFavorite = (bookId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(bookId)
        ? newFavorites.delete(bookId)
        : newFavorites.add(bookId);
      return newFavorites;
    });
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
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

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5efe6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-gray-700">
            Loading amazing books...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5efe6]">
      {/* Hero Section */}
      <div className="bg-[#f5efe6] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col items-center text-center">
          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent">
              Discover Your Next
            </span>
            <br />
            <span className="text-gray-900">Favorite Book</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
            Join a vibrant community of readers. Share reviews, find
            recommendations.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-xl mb-12">
            <div className="relative bg-white rounded-xl shadow-lg p-1">
              <input
                type="text"
                placeholder="Search books, authors, genres..."
                value={search}
                onChange={handleSearch}
                className="w-full px-4 py-4 text-base rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 py-">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black text-gray-900">
                {totalBooks}+
              </p>
              <p className="text-gray-600 font-medium">Books</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black text-gray-900">
                50K+
              </p>
              <p className="text-gray-600 font-medium">Readers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black text-gray-900">
                100K+
              </p>
              <p className="text-gray-600 font-medium">Reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Filters */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                Popular Books
              </h2>
              <p className="text-gray-600">{totalBooks} amazing reads</p>
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-5 py-3 pr-10 font-medium focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="latest">✨ Latest</option>
                <option value="title">📚 Title</option>
                <option value="author">✍️ Author</option>
                <option value="year">📅 Year</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Genre Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => handleGenreChange(g)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                  genre === g
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-orange-400"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-7xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No books found
            </h3>
            <p className="text-gray-600 mb-6">Be the first to add a book!</p>
            {isAuthenticated && (
              <Link
                to="/add-book"
                className="inline-block bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                Add First Book
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {books.map((book) => (
                <div key={book._id} className="group relative w-full max-w-xs">
                  <Link
                    to={`/books/${book._id}`}
                    className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-80 bg-gradient-to-br from-[#f0e5d8] to-[#e8dcc8]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-20 h-20 text-[#d4b896] opacity-50"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(book._id);
                        }}
                        className="absolute bottom-3 left-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-md z-10"
                      >
                        <svg
                          className={`w-5 h-5 ${
                            favorites.has(book._id)
                              ? "fill-rose-500 text-rose-500"
                              : "fill-none text-gray-600"
                          }`}
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {book.author}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">{book.genre}</p>

                      <div className="flex items-center justify-between">
                        <StarRating rating={book.averageRating || 5} />
                        <span className="text-xs text-gray-600">
                          {book.reviewCount || 0} reviews
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg bg-white border border-gray-300 disabled:opacity-40 hover:border-orange-500 hover:text-orange-600 transition-all font-bold"
                >
                  ←
                </button>

                {[...Array(Math.min(totalPages, 7))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
                        : "bg-white border border-gray-300 hover:border-orange-500"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                {totalPages > 7 && (
                  <>
                    <span className="px-2 text-gray-400">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-10 h-10 rounded-lg bg-white border border-gray-300 hover:border-orange-500 font-bold"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg bg-white border border-gray-300 disabled:opacity-40 hover:border-orange-500 hover:text-orange-600 transition-all font-bold"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookList;
