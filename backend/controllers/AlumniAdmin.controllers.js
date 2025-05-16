import AlumniAdmin from '../models/AlumniAdmin.models.js';
import Alumni from '../models/Alumni.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../config/mailer.js';
import Student from '../models/Student.models.js';
import cloudinary from '../config/cloudinary.js';

export const AlumniAdminSignup = async (req, res) => {
  try {
    const { loginId, password } = req.body;
    const existingAdmin = await AlumniAdmin.findOne({ loginId });

    if (existingAdmin) {
      return res.status(400).json({ message: "Login ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AlumniAdmin({ loginId, password: hashedPassword });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const AlumniAdminLogin = async (req, res) => {
  try {
    const { loginId, password } = req.body;
    const admin = await AlumniAdmin.findOne({ loginId });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token });
    console.log('admin login successful');
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    // The alumniAdminAuth middleware has already verified the token
    // and added adminId to the request object
    const adminId = req.adminId;
    
    // Check if admin still exists in database
    const admin = await AlumniAdmin.findById(adminId);
    if (!admin) {
      return res.status(401).json({ valid: false, message: "Admin not found" });
    }
    
    // Admin exists and token is valid
    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ valid: false, message: "Invalid token" });
  }
};

export const handleAlumniStatus = async (req, res) => {
  const { alumniId, decision } = req.body;

  try {
    const alumni = await Alumni.findById(alumniId);
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' });

    if (decision === 'approve') {
      alumni.isallowed = true;
      await alumni.save();
      sendEmail(alumni.email, 'Approval Notification', `Hi ${alumni.fullname}, \nYour Prepverse registration as Alumni has been approved.`);
    } else if (decision === 'reject') {
      await Alumni.deleteOne({ _id: alumniId });
      sendEmail(alumni.email, 'Rejection Notification', `Hi ${alumni.fullname},\n Your Prepverse registration as Alumni has been rejected.`);
    } else {
      return res.status(400).json({ message: 'Invalid decision' });
    }

    res.status(200).json({ message: `Alumni ${decision}d successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPendingAlumni = async (req, res) => {
  try {
    const pending = await Alumni.find({ isallowed: false });
    res.status(200).json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRegisteredAlumni = async (req, res) => {
  try {
    // Find all alumni where isallowed is true (approved/registered)
    const registeredAlumni = await Alumni.find({ isallowed: true });
    
    // Return the alumni data
    res.status(200).json({
      success: true,
      count: registeredAlumni.length,
      data: registeredAlumni
    });
  } catch (err) {
    console.error('Error fetching registered alumni:', err);
    res.status(500).json({ 
      success: false,
      message: "Failed to retrieve registered alumni", 
      error: err.message 
    });
  }
};

export const deleteAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the alumni exists
    const alumni = await Alumni.findById(id);
    if (!alumni) {
      return res.status(404).json({ 
        success: false, 
        message: "Alumni not found" 
      });
    }
    
    // Delete the alumni
    await Alumni.findByIdAndDelete(id);
    
    // Send success response
    res.status(200).json({
      success: true,
      message: "Alumni deleted successfully"
    });
    
  } catch (err) {
    console.error('Error deleting alumni:', err);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete alumni", 
      error: err.message 
    });
  }
};

// Student approval and other functions from the admin
export const handleStudentStatus = async (req, res) => {
  const { studentId, decision } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (decision === 'accept') {
      student.status = 'accepted';
      await student.save();
      sendEmail(student.email, 'Approval Notification', `Hi ${student.fullname},\nYour Prepverse registration as Student has been approved.`);
      
      res.status(200).json({ message: 'Student accepted successfully' });
    } else if (decision === 'reject') {
      // Instead of marking as rejected, delete the student and send email
      // First, delete resume from cloudinary if it exists
      if (student.resumePublicId) {
        try {
          await cloudinary.uploader.destroy(student.resumePublicId, { resource_type: 'raw' });
        } catch (cloudinaryError) {
          console.error('Error deleting resume from Cloudinary:', cloudinaryError);
          // Continue with student deletion even if cloudinary deletion fails
        }
      }
      
      // Delete the student from database
      await Student.findByIdAndDelete(studentId);
      
      // Send rejection email
      sendEmail(student.email, 'Rejection Notification', `Hi ${student.fullname},\nYour Prepverse registration as Student has been rejected.`);
      
      res.status(200).json({ message: 'Student rejected successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid decision' });
    }
  } catch (err) {
    console.error('Error handling student status:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getPendingStudents = async (req, res) => {
  try {
    const pendingStudents = await Student.find({ status: 'pending' });
    res.status(200).json({
      success: true,
      count: pendingStudents.length,
      data: pendingStudents
    });
  } catch (err) {
    console.error('Error fetching pending students:', err);
    res.status(500).json({ 
      success: false,
      message: "Failed to retrieve pending students",
      error: err.message 
    });
  }
};

export const getAllAcceptedStudents = async (req, res) => {
  try {
    const acceptedStudents = await Student.find({ status: 'accepted' });

    res.status(200).json({
      success: true,
      count: acceptedStudents.length,
      data: acceptedStudents
    });
  } catch (err) {
    console.error('Error fetching accepted students:', err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve accepted students",
      error: err.message
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Delete resume from cloudinary if it exists
    if (student.resumePublicId) {
      try {
        await cloudinary.uploader.destroy(student.resumePublicId, { resource_type: 'raw' });
      } catch (cloudinaryError) {
        console.error('Error deleting resume from Cloudinary:', cloudinaryError);
        // Continue with student deletion even if cloudinary deletion fails
      }
    }

    await Student.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });

  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: err.message
    });
  }
};