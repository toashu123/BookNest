import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    console.log('Auth header:', authHeader); // Debug log
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided. Authorization denied.' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted:', token.substring(0, 20) + '...'); // Debug log

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded); // Debug log
    
    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error); // Debug log
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }
    res.status(401).json({ message: 'Token verification failed' });
  }
};

export default authMiddleware;
