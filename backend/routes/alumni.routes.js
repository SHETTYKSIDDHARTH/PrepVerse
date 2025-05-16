import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Alumni from '../models/Alumni.models.js';
import alumniAuth from '../middlewares/AlumniAuth.js';
import { AlumniLogin, AlumniRegister, verifyToken } from '../controllers/Alumni.controllers.js';

const alumniRouter = express.Router();

// Alumni registration
alumniRouter.post('/register', AlumniRegister);

// Alumni login
alumniRouter.post('/login', AlumniLogin);

// Verify token endpoint
alumniRouter.get('/verify', verifyToken);

// Get alumni profile
alumniRouter.get('/profile', alumniAuth, async (req, res) => {
  try {
    // Remove password from response
    const alumni = req.alumni.toObject();
    delete alumni.password;
    
    res.status(200).json(alumni);
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

export default alumniRouter;