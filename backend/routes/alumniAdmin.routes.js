import express from 'express';
import {
  AlumniAdminSignup,
  AlumniAdminLogin,
  handleAlumniStatus,
  getPendingAlumni,
  getAllRegisteredAlumni,
  deleteAlumni,
  verifyToken,
  handleStudentStatus,getPendingStudents,getAllAcceptedStudents,deleteStudent
} from '../controllers/AlumniAdmin.controllers.js';
import alumniAdminAuth from '../middlewares/AlumniAdminAuth.js';

const alumniadminroute = express.Router();

// Public routes (no authentication required)
alumniadminroute.post('/signup', AlumniAdminSignup);
alumniadminroute.post('/login', AlumniAdminLogin);

// Protected routes (authentication required)
alumniadminroute.get('/verify-token', alumniAdminAuth, verifyToken);
alumniadminroute.post('/handle-alumni', alumniAdminAuth, handleAlumniStatus);
alumniadminroute.get('/pending-alumni', alumniAdminAuth, getPendingAlumni);
alumniadminroute.get('/registered-alumni', alumniAdminAuth, getAllRegisteredAlumni);
alumniadminroute.delete('/delete-alumni/:id', alumniAdminAuth, deleteAlumni);


// for student

alumniadminroute.get('/pending-students',alumniAdminAuth,getPendingStudents)
alumniadminroute.get('/accepted-students',alumniAdminAuth,getAllAcceptedStudents)
alumniadminroute.post('/handle-student',alumniAdminAuth,handleStudentStatus)
alumniadminroute.delete('/delete-student/:id',alumniAdminAuth,deleteStudent)
export default alumniadminroute;