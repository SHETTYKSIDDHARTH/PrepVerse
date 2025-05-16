import express from 'express';
import {
    postInterviewExp,
    getInterviewExp,
    searchInterviewExp,
    updateInterviewExp,
    deleteInterviewExp,
    postJob,
    getJobs,
    getJobsByAlumni,
    deleteJob,
    updateJob
} from '../controllers/Blogs.controllers.js';

import alumniAuth from '../middlewares/AlumniAuth.js';
import studentAuth from '../middlewares/studentAuth.js'
const blogsrouter = express.Router();

// Interview experience routes
blogsrouter.post('/post-intexp', alumniAuth, postInterviewExp);
blogsrouter.get('/get-intexp', alumniAuth, getInterviewExp);
blogsrouter.get('/search-intexp', alumniAuth, searchInterviewExp);
blogsrouter.put('/update-intexp/:id', alumniAuth, updateInterviewExp);
blogsrouter.delete('/delete-intexp/:id', alumniAuth, deleteInterviewExp);

// Job posting routes
blogsrouter.post('/post-job', alumniAuth, postJob);
blogsrouter.get('/get-jobs', alumniAuth, getJobs);
blogsrouter.get('/myjobs/:id', alumniAuth, getJobsByAlumni);
blogsrouter.delete('/delete-job/:id', alumniAuth, deleteJob);
blogsrouter.put('/update-job/:id', alumniAuth, updateJob);


// Students to view interview experience and see jobs
blogsrouter.get('/get-jobs-students',studentAuth,getJobs)
blogsrouter.get('/get-intexp-students',studentAuth,getInterviewExp)
export default blogsrouter;