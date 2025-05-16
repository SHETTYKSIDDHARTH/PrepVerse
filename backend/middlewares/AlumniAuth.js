import jwt from 'jsonwebtoken';
import Alumni from '../models/Alumni.models.js'; // Make sure the path is correct

const alumniAuth = async (req, res, next) => {
  // Try to get token from multiple sources
  let token;
  
  // Check for token in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  // Check for token in Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Check for token in request body (not recommended for GET requests)
  else if (req.body && req.body.token) {
    token = req.body.token;
  }
  // Check for token in query parameters (not recommended for security-sensitive operations)
  else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized access. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const alumni = await Alumni.findById(decoded.id);

    if (!alumni) {
      return res.status(404).json({ error: "Alumni not found." });
    }

    req.alumni = alumni;
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

export default alumniAuth;