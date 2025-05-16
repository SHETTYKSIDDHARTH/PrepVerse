import TP from '../models/TP.models.js';
import Student from '../models/Student.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new TP department
// @route   POST /api/tp/register
// @access  Public
export const registerTP = async (req, res) => {
  try {
    const { name, email, password, phone, department } = req.body;

    // Check if TP already exists
    const tpExists = await TP.findOne({ email });
    if (tpExists) {
      return res.status(400).json({ message: 'TP department already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new TP
    const tp = await TP.create({
      name,
      email,
      password: hashedPassword,
      phone,
      department
    });

    if (tp) {
      res.status(201).json({
        _id: tp._id,
        name: tp.name,
        email: tp.email,
        phone: tp.phone,
        department: tp.department,
        token: generateToken(tp._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid TP data' });
    }
  } catch (error) {
    console.error('TP registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate TP & get token
// @route   POST /api/tp/login
// @access  Public
export const loginTP = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for TP email
    const tp = await TP.findOne({ email });
    
    if (!tp) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, tp.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: tp._id,
      name: tp.name,
      email: tp.email,
      phone: tp.phone,
      department: tp.department,
      token: generateToken(tp._id)
    });
  } catch (error) {
    console.error('TP login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get TP profile
// @route   GET /api/tp/profile
// @access  Private
export const getTPProfile = async (req, res) => {
  try {
    const tp = await TP.findById(req.tp._id).select('-password');
    
    if (tp) {
      res.json(tp);
    } else {
      res.status(404).json({ message: 'TP not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// @desc    Create a new job
// @route   POST /api/tp/jobs
// @access  Private
export const createJob = async (req, res) => {
  try {
    const {
      jobtitle,
      company,
      jobdesc,
      location,
      salary,
      requiredSkills,
      minimumCGPA,
      eligibleBranches,
      deadline,
      jobStatus
    } = req.body;

    const tp = await TP.findById(req.tp._id);
    
    if (!tp) {
      return res.status(404).json({ message: 'TP not found' });
    }

    const newJob = {
      jobtitle,
      company,
      jobdesc,
      location,
      salary,
      requiredSkills: requiredSkills || [],
      minimumCGPA: minimumCGPA || 0,
      eligibleBranches: eligibleBranches || [],
      deadline: deadline || null,
      jobStatus: jobStatus || 'open'
    };

    tp.jobs.push(newJob);
    await tp.save();

    // Notify eligible students
    await notifyEligibleStudents(tp._id, tp.jobs[tp.jobs.length - 1]._id, jobtitle, company);

    res.status(201).json(tp.jobs[tp.jobs.length - 1]);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to notify eligible students about new job
const notifyEligibleStudents = async (tpId, jobId, jobtitle, company) => {
  try {
    const tp = await TP.findById(tpId);
    if (!tp) return;
    
    const job = tp.jobs.id(jobId);
    if (!job) return;
    
    // Find eligible students based on CGPA and branch
    const eligibleStudents = await Student.find({
      cgpa: { $gte: job.minimumCGPA },
      branch: { $in: job.eligibleBranches }
    });
    
    // Add notification to eligible students
    const notification = {
      message: `New job opportunity: ${jobtitle} at ${company}. Check it out!`
    };
    
    for (const student of eligibleStudents) {
      student.notifications.push(notification);
      await student.save();
    }
  } catch (error) {
    console.error('Notify students error:', error);
  }
};

// @desc    Get all jobs
// @route   GET /api/tp/jobs
// @access  Private
export const getAllJobs = async (req, res) => {
  try {
    const tp = await TP.findById(req.tp._id);
    
    if (!tp) {
      return res.status(404).json({ message: 'TP not found' });
    }

    res.json(tp.jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/tp/jobs/:id
// @access  Private
export const getJobById = async (req, res) => {
  try {
    const tp = await TP.findById(req.tp._id);
    
    if (!tp) {
      return res.status(404).json({ message: 'TP not found' });
    }

    const job = tp.jobs.id(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/tp/jobs/:id
// @access  Private
export const updateJob = async (req, res) => {
  try {
    const tp = await TP.findById(req.tp._id);
    
    if (!tp) {
      return res.status(404).json({ message: 'TP not found' });
    }

    const job = tp.jobs.id(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Update job fields
    const {
      jobtitle,
      company,
      jobdesc,
      location,
      salary,
      requiredSkills,
      minimumCGPA,
      eligibleBranches,
      deadline,
      jobStatus
    } = req.body;

    job.jobtitle = jobtitle || job.jobtitle;
    job.company = company || job.company;
    job.jobdesc = jobdesc || job.jobdesc;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.requiredSkills = requiredSkills || job.requiredSkills;
    job.minimumCGPA = minimumCGPA !== undefined ? minimumCGPA : job.minimumCGPA;
    job.eligibleBranches = eligibleBranches || job.eligibleBranches;
    job.deadline = deadline || job.deadline;
    job.jobStatus = jobStatus || job.jobStatus;

    await tp.save();
    res.json(job);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/tp/jobs/:id
// @access  Private
export const deleteJob = async (req, res) => {
  try {
    const tp = await TP.findById(req.tp._id);
    
    if (!tp) {
      return res.status(404).json({ message: 'TP not found' });
    }

    const jobIndex = tp.jobs.findIndex(job => job._id.toString() === req.params.id);
    
    if (jobIndex === -1) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Remove job
    tp.jobs.splice(jobIndex, 1);
    await tp.save();

    res.json({ message: 'Job removed' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Process a student's job application
// @route   PUT /api/tp/jobs/:jobId/applicants/:studentId
// @access  Private
export const processApplication = async (req, res) => {
  try {
    const { status } = req.body;
    const { jobId, studentId } = req.params;

    const tp = await TP.findById(req.tp._id);
    
    if (!tp) {
      return res.status(404).json({ message: 'TP not found' });
    }

    const job = tp.jobs.id(jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Find the applicant
    const applicantIndex = job.applicants.findIndex(
      app => app.student.toString() === studentId
    );

    if (applicantIndex === -1) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Update status
    job.applicants[applicantIndex].status = status;
    await tp.save();

    // Update status in student's record as well
    const student = await Student.findById(studentId);
    if (student) {
      const jobAppIndex = student.jobApplications.findIndex(
        app => app.job.toString() === jobId && app.tpDepartment.toString() === tp._id.toString()
      );

      if (jobAppIndex !== -1) {
        student.jobApplications[jobAppIndex].status = status;
        await student.save();

        // Add notification to student
        const notification = {
          message: `Your application for ${job.jobtitle} at ${job.company} has been marked as ${status}.`
        };
        student.notifications.push(notification);
        await student.save();
      }
    }

    res.json(job.applicants[applicantIndex]);
  } catch (error) {
    console.error('Process application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all applicants for a job
// @route   GET /api/tp/jobs/:id/applicants
// @access  Private
export const getJobApplicants = async (req, res) => {
  try {
    const tp = await TP.findById(req.tp._id);
    
    if (!tp) {
      return res.status(404).json({ message: 'TP not found' });
    }

    const job = tp.jobs.id(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Get detailed information about each applicant
    const applicantsWithDetails = await Promise.all(
      job.applicants.map(async (applicant) => {
        const student = await Student.findById(applicant.student)
          .select('fullname usn email phone branch cgpa skills resume');
        
        return {
          ...applicant.toObject(),
          studentDetails: student ? student.toObject() : null
        };
      })
    );

    res.json(applicantsWithDetails);
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get TP statistics (job count, applicant count, etc.)
// @route   GET /api/tp/stats
// @access  Private
export const getTPStats = async (req, res) => {
  try {
    const tp = await TP.findById(req.tp._id);
    
    if (!tp) {
      return res.status(404).json({ message: 'TP not found' });
    }

    // Calculate statistics
    const totalJobs = tp.jobs.length;
    const openJobs = tp.jobs.filter(job => job.jobStatus === 'open').length;
    const closedJobs = tp.jobs.filter(job => job.jobStatus === 'closed').length;
    const upcomingJobs = tp.jobs.filter(job => job.jobStatus === 'upcoming').length;
    
    // Calculate total applicants
    const totalApplicants = tp.jobs.reduce((total, job) => {
      return total + job.applicants.length;
    }, 0);
    
    // Applicants by status
    const pendingApplicants = tp.jobs.reduce((total, job) => {
      return total + job.applicants.filter(app => app.status === 'pending').length;
    }, 0);
    
    const eligibleApplicants = tp.jobs.reduce((total, job) => {
      return total + job.applicants.filter(app => app.status === 'eligible').length;
    }, 0);
    
    const notEligibleApplicants = tp.jobs.reduce((total, job) => {
      return total + job.applicants.filter(app => app.status === 'not_eligible').length;
    }, 0);

    res.json({
      totalJobs,
      openJobs,
      closedJobs,
      upcomingJobs,
      totalApplicants,
      pendingApplicants,
      eligibleApplicants,
      notEligibleApplicants
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all TP notifications
// @route   GET /api/tp/notifications
// @access  Private
export const getTPNotifications = async (req, res) => {
  try {
    const tp = await TP.findById(req.tp._id);
    
    if (!tp) {
      return res.status(404).json({ message: 'TP not found' });
    }

    res.json(tp.notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/tp/notifications/:id
// @access  Private
export const markNotificationRead = async (req, res) => {
  try {
    const tp = await TP.findById(req.tp._id);
    
    if (!tp) {
      return res.status(404).json({ message: 'TP not found' });
    }

    const notification = tp.notifications.id(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await tp.save();

    res.json(notification);
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get students by criteria (for job eligibility checking)
// @route   GET /api/tp/students
// @access  Private
export const getEligibleStudents = async (req, res) => {
  try {
    const { minimumCGPA, branches, skills } = req.query;
    
    let query = {};
    
    // Add filters
    if (minimumCGPA) {
      query.cgpa = { $gte: parseFloat(minimumCGPA) };
    }
    
    if (branches) {
      const branchArray = branches.split(',');
      query.branch = { $in: branchArray };
    }
    
  
    
    const students = await Student.find(query)
      .select('fullname usn email branch cgpa skills');
    
    res.json(students);
  } catch (error) {
    console.error('Get eligible students error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Accept a student's pending application
// @route   POST /api/tp/jobs/:jobId/students/:studentId/apply
// @access  Private
export const addStudentToJob = async (req, res) => {
  try {
    const { jobId, studentId } = req.params;
    
    const tp = await TP.findById(req.tp._id);
    if (!tp) {
      return res.status(404).json({ message: 'TP not found' });
    }
    
    const job = tp.jobs.id(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if student already applied
    const alreadyApplied = job.applicants.some(app => app.student.toString() === studentId);
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Student has already applied for this job' });
    }
    
    // Add student to job applicants
    job.applicants.push({
      student: studentId,
      name: student.fullname,
      email: student.email,
      phone: student.phone,
      branch: student.branch,
      cgpa: student.cgpa,
      status: 'pending'
    });
    
    await tp.save();
    
    // Add job to student's applications
    student.jobApplications.push({
      job: jobId,
      tpDepartment: tp._id,
      company: job.company,
      position: job.jobtitle,
      status: 'pending'
    });
    
    await student.save();
    
    res.status(201).json({
      message: 'Student added to job applicants successfully',
      applicant: job.applicants[job.applicants.length - 1]
    });
  } catch (error) {
    console.error('Add student to job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Send bulk notification to students
// @route   POST /api/tp/notify
// @access  Private
export const sendBulkNotification = async (req, res) => {
  try {
    const { message, studentIds } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Notification message is required' });
    }
    
    // Create notification object
    const notification = {
      message,
      createdAt: new Date(),
      read: false
    };
    
    // If student IDs are provided, send to those students only
    if (studentIds && studentIds.length > 0) {
      const students = await Student.find({ _id: { $in: studentIds } });
      
      for (const student of students) {
        student.notifications.push(notification);
        await student.save();
      }
      
      return res.status(201).json({
        message: `Notification sent to ${students.length} specific students`,
        notification
      });
    } 
    // Otherwise, send to all students
    else {
      const students = await Student.find();
      
      for (const student of students) {
        student.notifications.push(notification);
        await student.save();
      }
      
      return res.status(201).json({
        message: `Notification sent to all ${students.length} students`,
        notification
      });
    }
  } catch (error) {
    console.error('Send bulk notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    
    // Check if TP exists in database
    const tp = await TP.findById(decoded.id).select('-password');
    if (!tp) {
      return res.status(404).json({ success: false, message: 'TP not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Token verified',
      tp: {
        id: tp._id,
        name: tp.name,
        email: tp.email,
        phone: tp.phone,
        department: tp.branch,
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
// Export all controllers
export default {
  registerTP,
  loginTP,
  getTPProfile,
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  processApplication,
  getJobApplicants,
  getTPStats,
  getTPNotifications,
  markNotificationRead,
  getEligibleStudents,
  addStudentToJob,
  sendBulkNotification,
  verifyToken
};

