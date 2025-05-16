import express from 'express';
import {
  studentSignup,
  StudentLogin,
  verifyToken,
  notbuddy,
  sendBuddyRequest,
  acceptBuddyRequest,
  rejectBuddyRequest,
  removeBuddy,
  getCurrentBuddy,
  getIncomingBuddyRequests,
  getStudyBuddies
} from '../controllers/Student.controllers.js';
import studentAuth from '../middlewares/studentAuth.js';

const studentRouter = express.Router();

// Authentication routes
studentRouter.post('/student-signup', studentSignup);
studentRouter.post('/login', StudentLogin);
studentRouter.get('/verify-token', verifyToken);

// Buddy-related routes
studentRouter.get('/nobuddy', studentAuth, notbuddy);
studentRouter.post('/send-buddy-request', studentAuth, sendBuddyRequest);
studentRouter.post('/accept-buddy-request', studentAuth, acceptBuddyRequest);
studentRouter.post('/reject-buddy-request', studentAuth, rejectBuddyRequest);
studentRouter.delete('/remove-buddy', studentAuth, removeBuddy);
studentRouter.get('/current-buddy', studentAuth, getCurrentBuddy);
studentRouter.get('/incoming-buddy-requests', studentAuth, getIncomingBuddyRequests);
studentRouter.get('/study-buddies', studentAuth, getStudyBuddies);

export default studentRouter;