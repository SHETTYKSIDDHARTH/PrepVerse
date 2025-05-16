import Student from '../models/Student.models.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import upload from '../utils/multer.js';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Existing authentication methods remain unchanged
export const studentSignup = async (req, res) => {
  try {
    // Use multer to handle the file upload
    upload.single('resume')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      try {
        // Get form data
        const { fullname, usn, batch, email, password, cgpa, skills, phone, sem, branch } = req.body;

        // Validate required fields
        if (!fullname || !usn || !batch || !email || !password || !cgpa || !sem || !branch || !phone) {
          if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!req.file) {
          return res.status(400).json({ message: 'Resume file is required' });
        }

        // Check if the student already exists
        const existingStudent = await Student.findOne({
          $or: [{ email }, { usn }]
        });
        
        if (existingStudent) {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(400).json({ 
            message: existingStudent.email === email ? 'Email already exists' : 'USN already exists' 
          });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload the resume file to Cloudinary
        const filePath = req.file.path;
        const fileType = path.extname(req.file.originalname).toLowerCase();
        
        // Determine if it's PDF or DOCX for proper handling
        const isDocx = fileType === '.docx';
        
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          resource_type: 'raw', // Important! Use 'raw' for documents
          public_id: `resumes/${usn}-${Date.now()}`,
          tags: ['resume', usn],
          format: isDocx ? 'docx' : 'pdf',
          use_filename: true,
          unique_filename: true,
          access_mode: 'public'  // Make the file publicly accessible
        });

        // Delete the local file after uploading it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Create a new Student document
        const newStudent = new Student({
          fullname,
          usn,
          batch,
          email,
          password: hashedPassword,
          cgpa: parseFloat(cgpa),
          resume: uploadResult.secure_url,
          resumePublicId: uploadResult.public_id,
          skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(skill => skill.trim()) : []),
          phone, 
          sem,
          branch
        });

        // Save the new student to the database
        await newStudent.save();

        // Send a success response with the resume URL
        res.status(201).json({
          success: true,
          message: 'Registration submitted successfully',
          resumeUrl: uploadResult.secure_url
        });

      } catch (error) {
        // Clean up the uploaded file if it exists
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        console.error('Error during signup:', error);
        res.status(500).json({
          success: false,
          message: error.message || 'An error occurred during registration'
        });
      }
    });
  } catch (error) {
    console.error('Error during signup process:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const StudentLogin = async(req,res)=>{
  try {
    const {email,password} = req.body;

    const student = await Student.findOne({email});
    if(student.status!='accepted')return res.status(400).json({message:"Student request under process"})
    if(!student) return res.status(400).json({message:"No Student with the given email"});
    
    const valid = await bcrypt.compare(password, student.password);
    if(!valid) return res.status(400).json({message:'Incorrect Password'});

    const token = jwt.sign({id:student._id}, process.env.JWT_SECRET, {expiresIn:'1d'});
    
    // Don't send password to client
    const studentWithoutPassword = student.toObject();
    delete studentWithoutPassword.password;
    
    res.status(200).json({token, student: studentWithoutPassword});
    console.log('student signed in successfully');
  } catch (error) {
    res.status(500).json({error:error.message});
  }
};

export const verifyToken = async (req, res) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if student exists in database
    const student = await Student.findById(decoded.id).select('-password');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    // Return success with student data
    res.status(200).json({ 
      success: true, 
      message: 'Token verified',
      student: {
        id: student._id,
        fullname: student.fullname,
        email: student.email,
        usn: student.usn,
        branch: student.branch,
        sem: student.sem
      }
    });
    
  } catch (error) {
    console.error('Token verification error:', error);
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    
    // Handle other errors
    res.status(500).json({ success: false, message: 'Error verifying token', error: error.message });
  }
};

// FIXED: Get students with no buddies
export const notbuddy = async (req, res) => {
  try {
    // Get current user's ID and rejected buddy list
    const currentUserId = req.student._id;
    const rejectedList = req.student.rejectedBuddyRequests || [];
    
    // Find all students that:
    // 1. Don't have a study buddy
    // 2. Are not the current user
    // 3. Are not in the current user's rejected buddy list
    const result = await Student.find({ 
      studyBuddy: null,
      status:'accepted',
      $and: [
        { _id: { $ne: currentUserId } }
        // { _id: { $nin: rejectedList } }
      ]
    }).select('fullname usn branch sem email _id');
    
    // Filter out students who have a pending request
    const filteredResults = result.filter(student => !student.studyBuddyRequestDate);
    
    res.status(200).json({
      success: true,
      students: filteredResults
    });
  } catch (error) {
    console.error("notbuddy error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching students without study buddy", 
      error: error.message || "Unknown error"
    });
  }
};
// FIXED: Send buddy request with proper status handling
export const sendBuddyRequest = async (req, res) => {
  try {
    const { buddyId } = req.body;
    const senderId = req.student._id;

    // Validate input
    if (!buddyId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Buddy ID is required' 
      });
    }

    // Ensure both IDs are strings for proper comparison
    const senderIdStr = senderId.toString();
    const buddyIdStr = buddyId.toString();

    // Check if sender and receiver are the same
    if (senderIdStr === buddyIdStr) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot send a buddy request to yourself' 
      });
    }

    // Find the sender and potential buddy
    const sender = await Student.findById(senderId);
    const potentialBuddy = await Student.findById(buddyId);

    // Validate both students exist
    if (!sender || !potentialBuddy) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    // Check if sender already has a buddy
    if (sender.studyBuddy) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a study buddy' 
      });
    }

    // Check if potential buddy already has a buddy
    if (potentialBuddy.studyBuddy) {
      return res.status(400).json({ 
        success: false, 
        message: 'This student already has a study buddy' 
      });
    }

    // Check if sender already has a pending request
    if (sender.studyBuddyRequestDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a pending buddy request' 
      });
    }

    // Check if a request has already been sent to the potential buddy
    if (potentialBuddy.studyBuddyRequestDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'This student already has a pending buddy request' 
      });
    }

    // Check if this student has been rejected before
    // if (potentialBuddy.rejectedBuddyRequests && 
    //     potentialBuddy.rejectedBuddyRequests.some(id => id.toString() === senderIdStr)) {
    //   return res.status(400).json({ 
    //     success: false, 
    //     message: 'Your previous request to this student was rejected' 
    //   });
    // }

    // Update sender with buddy request details
    sender.studyBuddyRequestDate = new Date();
    sender.status = 'pending';
    sender.requestedBuddy = buddyId; // Track who the request was sent to
    
    await sender.save();

    res.status(200).json({ 
      success: true, 
      message: 'Buddy request sent successfully' 
    });
  } catch (error) {
    console.error('Error sending buddy request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending buddy request', 
      error: error.message 
    });
  }
};

// Accept a buddy request
export const acceptBuddyRequest = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    const { requesterId } = req.body;
    const receiverId = req.student._id;

    // Find the requester and receiver
    const requester = await Student.findById(requesterId).session(session);
    const receiver = await Student.findById(receiverId).session(session);

    // Validate students exist
    if (!requester || !receiver) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    // Check if either already has a buddy
    if (requester.studyBuddy || receiver.studyBuddy) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        success: false, 
        message: 'One of the students already has a study buddy' 
      });
    }

    // Verify that requester has a pending request
    if (!requester.studyBuddyRequestDate || requester.status !== 'pending') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        success: false, 
        message: 'No pending buddy request from this student' 
      });
    }

    // Set buddy for both students
    const buddyStartDate = new Date();
    requester.studyBuddy = receiverId;
    receiver.studyBuddy = requesterId;
    requester.studyBuddyStartDate = buddyStartDate;
    receiver.studyBuddyStartDate = buddyStartDate;
    requester.status = 'accepted';
    receiver.status = 'accepted';

    // Clear any pending requests
    requester.studyBuddyRequestDate = null;
    receiver.studyBuddyRequestDate = null;
    requester.requestedBuddy = null;
    
    // Save both students
    await requester.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ 
      success: true, 
      message: 'Buddy request accepted successfully',
      buddy: {
        _id: requester._id,
        fullname: requester.fullname,
        email: requester.email,
        usn: requester.usn,
        branch: requester.branch,
        sem: requester.sem,
        studyBuddyStartDate: buddyStartDate
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error accepting buddy request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error accepting buddy request', 
      error: error.message 
    });
  }
};

// Reject a buddy request
export const rejectBuddyRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const receiverId = req.student._id;

    // Find the requester and receiver
    const requester = await Student.findById(requesterId);
    const receiver = await Student.findById(receiverId);

    // Validate students exist
    if (!requester || !receiver) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    // Verify that requester has a pending request
    if (!requester.studyBuddyRequestDate || requester.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'No pending buddy request from this student' 
      });
    }

    // Reset buddy-related fields for requester
    requester.studyBuddyRequestDate = null;
    requester.status = null;
    requester.requestedBuddy = null;

    // Add the requester to receiver's rejected requests list
    if (!receiver.rejectedBuddyRequests) {
      receiver.rejectedBuddyRequests = [];
    }
    
    // if (!receiver.rejectedBuddyRequests.some(id => id.toString() === requesterId.toString())) {
    //   receiver.rejectedBuddyRequests.push(requesterId);
    // }

    // Save both students
    await requester.save();
    await receiver.save();

    res.status(200).json({ 
      success: true, 
      message: 'Buddy request rejected' 
    });
  } catch (error) {
    console.error('Error rejecting buddy request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error rejecting buddy request', 
      error: error.message 
    });
  }
};

// Remove buddy after 30 days
export const removeBuddy = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    
    const studentId = req.student._id;
    const student = await Student.findById(studentId).session(session);

    // Validate student exists and has a buddy
    if (!student) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    if (!student.studyBuddy) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        success: false, 
        message: 'You do not have a study buddy' 
      });
    }

    // Check if 30 days have passed since buddy pairing
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (student.studyBuddyStartDate > thirtyDaysAgo) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        success: false, 
        message: 'You can only remove a buddy after 30 days' 
      });
    }

    // Find the buddy
    const buddy = await Student.findById(student.studyBuddy).session(session);
    
    // Reset student's fields
    student.studyBuddy = null;
    student.studyBuddyStartDate = null;
    student.status = null;
    await student.save({ session });
    
    // Reset buddy's fields if buddy still exists
    if (buddy) {
      buddy.studyBuddy = null;
      buddy.studyBuddyStartDate = null;
      buddy.status = null;
      await buddy.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ 
      success: true, 
      message: 'Study buddy removed successfully' 
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error removing buddy:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error removing buddy', 
      error: error.message 
    });
  }
};

// Get current buddy details
export const getCurrentBuddy = async (req, res) => {
  try {
    const studentId = req.student._id;
    const student = await Student.findById(studentId);

    if (!student.studyBuddy) {
      return res.status(404).json({ 
        success: false, 
        message: 'No current study buddy' 
      });
    }

    // Get buddy details
    const buddy = await Student.findById(student.studyBuddy)
      .select('fullname email usn branch sem id');
    
    if (!buddy) {
      // Handle case where buddy no longer exists
      student.studyBuddy = null;
      student.studyBuddyStartDate = null;
      student.status = null;
      await student.save();
      
      return res.status(404).json({ 
        success: false, 
        message: 'Buddy not found. Your buddy status has been reset.' 
      });
    }

    // Add the buddy start date to the response
    const buddyData = buddy.toObject();
    buddyData.studyBuddyStartDate = student.studyBuddyStartDate;

    res.status(200).json({ 
      success: true, 
      buddy: buddyData
    });
  } catch (error) {
    console.error('Error fetching current buddy:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching current buddy', 
      error: error.message 
    });
  }
};

// FIXED: Get incoming buddy requests with proper query
export const getIncomingBuddyRequests = async (req, res) => {
  try {
    const studentId = req.student._id;
    
    // Find students who have:
    // 1. A pending study buddy request
    // 2. 'pending' status
    // 3. Requested the current user as their buddy
    const incomingRequests = await Student.find({
      studyBuddyRequestDate: { $ne: null },
      status: 'pending',
      requestedBuddy: studentId
    }).select('_id fullname email usn branch sem');

    res.status(200).json({
      success: true,
      requests: incomingRequests
    });
  } catch (error) {
    console.error('Error fetching incoming requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching incoming buddy requests',
      error: error.message
    });
  }
};


export const getStudyBuddies = async (req, res) => {
  try {
    const studentId = req.student._id;
    const student = await Student.findById(studentId);

    if (!student.studyBuddy) {
      return res.status(200).json({ 
        success: true, 
        data: [] 
      });
    }

    // Get buddy details
    const buddy = await Student.findById(student.studyBuddy)
      .select('_id fullname email usn branch sem');
    
    if (!buddy) {
      // Handle case where buddy no longer exists
      student.studyBuddy = null;
      student.studyBuddyStartDate = null;
      await student.save();
      
      return res.status(200).json({ 
        success: true, 
        data: [] 
      });
    }

    // Return array with single buddy
    res.status(200).json({ 
      success: true, 
      data: [buddy] 
    });
  } catch (error) {
    console.error('Error fetching study buddies:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching study buddies', 
      error: error.message 
    });
  }
};