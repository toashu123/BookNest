import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddBook = () => {
  const { token } = useContext(AuthContext); // Get token from context
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: 'Fiction',
    publishedYear: new Date().getFullYear()
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Other'];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get token from localStorage as backup
      const authToken = token || localStorage.getItem('token');
      
      if (!authToken) {
        setError('Please login to add a book');
        setLoading(false);
        navigate('/login');
        return;
      }

      console.log('Submitting book:', formData); // Debug log

      const { data } = await axios.post(
        'http://localhost:5000/api/books',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Book added successfully:', data); // Debug log
      
      // Navigate to the new book's details page
      navigate(`/books/${data.book._id}`);
    } catch (err) {
      console.error('Error adding book:', err); // Debug log
      console.error('Error response:', err.response?.data); // Debug log
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to add book. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Add New Book</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Book Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Author *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
            required
            minLength={10}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Genre *</label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Published Year *</label>
            <input
              type="number"
              name="publishedYear"
              value={formData.publishedYear}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={1000}
              max={new Date().getFullYear() + 1}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold disabled:bg-blue-300"
          >
            {loading ? 'Adding Book...' : 'Add Book'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
