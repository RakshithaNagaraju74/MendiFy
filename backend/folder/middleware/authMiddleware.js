const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  // Extract session ID from the Authorization header
  const sessionId = req.header('Authorization');

  // Check if sessionId exists in the request header
  if (!sessionId) {
    console.log('⚠️ No session ID provided in request header.');
    return res.status(401).json({ error: 'No session ID provided' });
  }

  try {
    // If "Bearer" prefix is used in Authorization header, remove it
    const actualSessionId = sessionId.startsWith('Bearer ') ? sessionId.slice(7) : sessionId;

    // Search for a user in the database with the provided sessionId
    const user = await User.findOne({ sessionId: actualSessionId });

    // If no user is found with the provided sessionId, return an error
    if (!user) {
      console.log(`⚠️ No user found for sessionId: ${actualSessionId}`);
      return res.status(401).json({ error: 'Invalid session ID' });
    }

    // If user is found, attach the user's ID to the request object for use in later middleware/handlers
    req.userId = user._id;
    console.log(`✅ User authenticated: ${user._id}`);

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Log any errors and send a server error response
    console.error('Auth Middleware Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
const authMiddleware = (req, res, next) => {
  // Get the token from the header
  const token = req.header('x-auth-token');
  
  // If no token is found, deny access
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user information to the request object
    req.user = decoded;
    
    // Call the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid, respond with an error
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
module.exports = authenticateUser;
