import Alumni from '../models/Alumni.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import alumniAuth from '../middlewares/AlumniAuth.js';

export const AlumniRegister = async (req, res) => {
  try {
    const { fullname, usn, Batch, email, department, password, linkedIn, company, currentRole, phone } = req.body;
    const existing = await Alumni.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Alumni already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAlumni = new Alumni({
      fullname,
      usn,
      Batch,
      email,
      department,
      password: hashedPassword,
      linkedIn,
      company,
      currentRole,
      phone
    });

    await newAlumni.save();
    res.status(201).json({ message: 'Registration submitted, pending approval.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const AlumniLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const alumni = await Alumni.findOne({ email });
    if (!alumni) return res.status(400).json({ message: 'No such alumni' });

    // Check approved status using isallowed field from model
    if (!alumni.isallowed)
      return res.status(403).json({ message: 'Not approved by admin yet' });

    const valid = await bcrypt.compare(password, alumni.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: alumni._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, alumni });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify token endpoint for alumni authentication
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ verified: false, message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if alumni exists and is approved
    const alumni = await Alumni.findById(decoded.id);
    if (!alumni) {
      return res.status(404).json({ verified: false, message: 'Alumni not found' });
    }
    
    if (!alumni.isallowed) {
      return res.status(403).json({ verified: false, message: 'Account pending approval' });
    }
    
    res.status(200).json({ verified: true });
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ verified: false, message: 'Invalid token' });
  }
};