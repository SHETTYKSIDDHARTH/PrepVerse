import express from 'express';
import {
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
} from '../controllers/Tp.controllers.js'
import tpAuth from '../middlewares/tpAuth.js';
import studentAuth from '../middlewares/studentAuth.js'
const tprouter = express.Router();

// Authentication routes (public)
tprouter.post('/register', registerTP);
tprouter.post('/login', loginTP);

// Profile routes (protected)
tprouter.get('/profile', tpAuth, getTPProfile);

tprouter.get('/verify-token', verifyToken);
// Job management routes (protected)
tprouter.post('/jobs', tpAuth, createJob);
tprouter.get('/jobs', tpAuth, getAllJobs);
tprouter.get('/jobs/:id', tpAuth, getJobById);
tprouter.put('/jobs/:id', tpAuth, updateJob);
tprouter.delete('/jobs/:id', tpAuth, deleteJob);

// Job applicants routes (protected)
tprouter.get('/jobs/:id/applicants', tpAuth, getJobApplicants);
tprouter.put('/jobs/:jobId/applicants/:studentId', tpAuth, processApplication);
tprouter.post('/jobs/:jobId/students/:studentId/apply', studentAuth, addStudentToJob);

// Statistics routes (protected)
tprouter.get('/stats', tpAuth, getTPStats);

// Student management routes (protected)
tprouter.get('/students', tpAuth, getEligibleStudents);

// Notification routes (protected)
tprouter.get('/notifications', studentAuth, getTPNotifications);
tprouter.put('/notifications/:id', studentAuth, markNotificationRead);
tprouter.post('/notify', tpAuth, sendBulkNotification);

export default tprouter;