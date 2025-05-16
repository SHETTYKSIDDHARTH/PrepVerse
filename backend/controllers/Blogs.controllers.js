import { Post, JobPosting, InterviewExperience } from '../models/Post.models.js';
import Alumni from '../models/Alumni.models.js';

// POST: Create Interview Experience
const postInterviewExp = async (req, res) => {
  try {
    const { companyName, description, postedBy } = req.body;
    
    // Validate required fields
    if (!companyName || !description || !postedBy) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify alumni exists
    const alumni = await Alumni.findById(postedBy);
    if (!alumni) {
      return res.status(404).json({ error: "Alumni not found" });
    }
    
    // Verify the authenticated user is the same as the postedBy user
    if (req.alumni._id.toString() !== postedBy) {
      return res.status(403).json({ error: "You can only post interviews as yourself" });
    }

    // Create new interview experience
    const newInterview = new InterviewExperience({
      companyName,
      description,
      postedBy,
    });

    await newInterview.save();

    // Return formatted response
    res.status(201).json({
      message: "Interview experience posted successfully",
      data: {
        _id: newInterview._id,
        companyName: newInterview.companyName,
        description: newInterview.description,
        postedBy: alumni.fullname,
        createdAt: newInterview.createdAt,
      },
    });
  } catch (error) {
    console.error("POST Interview Error:", error.message);
    res.status(500).json({ error: "Failed to post interview experience" });
  }
};

// GET: Fetch all Interview Experiences
const getInterviewExp = async (req, res) => {
  try {
    const { company } = req.query;
    let query = {};
    
    // If company query param exists, filter by company name
    if (company) {
      query.companyName = { $regex: company, $options: 'i' }; // Case-insensitive search
    }
    
    // Fetch and populate the alumni user info
    const interviews = await InterviewExperience.find(query)
      .populate('postedBy', 'fullname email batch company')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json(interviews);
  } catch (error) {
    console.error("GET Interviews Error:", error.message);
    res.status(500).json({ error: 'Failed to fetch interview experiences' });
  }
};

// GET: Search Interview Experiences by Company Name
const searchInterviewExp = async (req, res) => {
  try {
    const { company } = req.query;
    
    if (!company) {
      return res.status(400).json({ error: 'Company name search term is required' });
    }
    
    // Case-insensitive search with regex
    const interviews = await InterviewExperience.find({
      companyName: { $regex: company, $options: 'i' }
    })
      .populate('postedBy', 'fullname email batch company')
      .sort({ createdAt: -1 });
    
    res.status(200).json(interviews);
  } catch (error) {
    console.error("SEARCH Interviews Error:", error.message);
    res.status(500).json({ error: 'Failed to search interview experiences' });
  }
};

// PUT: Update Interview Experience
const updateInterviewExp = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, description } = req.body;
    
    // Validate required fields
    if (!companyName || !description) {
      return res.status(400).json({ error: 'Company name and description are required' });
    }
    
    // Find the interview
    const interview = await InterviewExperience.findById(id);
    
    if (!interview) {
      return res.status(404).json({ error: 'Interview experience not found' });
    }
    
    // Verify the authenticated user is the owner
    if (interview.postedBy.toString() !== req.alumni._id.toString()) {
      return res.status(403).json({ error: 'You can only update your own posts' });
    }
    
    // Update the interview
    const updatedInterview = await InterviewExperience.findByIdAndUpdate(
      id,
      { companyName, description },
      { new: true, runValidators: true }
    ).populate('postedBy', 'fullname email batch company');
    
    res.status(200).json({
      message: 'Interview experience updated successfully',
      data: updatedInterview
    });
  } catch (error) {
    console.error("UPDATE Interview Error:", error.message);
    res.status(500).json({ error: 'Failed to update interview experience' });
  }
};

// DELETE: Remove Interview Experience by ID
const deleteInterviewExp = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the interview
    const interview = await InterviewExperience.findById(id);
    
    if (!interview) {
      return res.status(404).json({ error: 'Interview experience not found' });
    }
    
    // Verify the authenticated user is the owner
    if (interview.postedBy.toString() !== req.alumni._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }
    
    // Delete the interview
    await InterviewExperience.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Interview experience deleted successfully' });
  } catch (error) {
    console.error("DELETE Interview Error:", error.message);
    res.status(500).json({ error: 'Failed to delete interview experience' });
  }
};

// POST: Create Job Posting
const postJob = async (req, res) => {
  try {
    const { title, jd, batch, jobLink, startDate, endDate, requirements, postedBy } = req.body;
    
    // Validate required fields
    if (!title || !jd || !batch || !jobLink || !startDate || !endDate || !requirements || !postedBy) {
      return res.status(400).json({ 
        error: 'All fields are required',
        missingFields: {
          title: !title,
          jd: !jd,
          batch: !batch,
          jobLink: !jobLink,
          startDate: !startDate,
          endDate: !endDate,
          requirements: !requirements,
          postedBy: !postedBy
        }
      });
    }
    
    // Verify alumni exists
    const alumni = await Alumni.findById(postedBy);
    if (!alumni) {
      return res.status(404).json({ error: "Alumni not found" });
    }
    
    // Verify the authenticated user is the same as the postedBy user
    if (req.alumni._id.toString() !== postedBy) {
      return res.status(403).json({ error: "You can only post jobs as yourself" });
    }
    
    // Create new job posting
    const newJob = new JobPosting({
      title,
      jd,
      batch,
      jobLink,
      startDate,
      endDate,
      requirements,
      postedBy
    });

    await newJob.save();
    
    res.status(201).json({
      message: "Job posted successfully",
      data: newJob
    });
  } catch (error) {
    console.error("POST Job Error:", error);
    
    // Handle specific validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({ 
        error: 'Validation error', 
        details: validationErrors 
      });
    }
    
    res.status(500).json({ error: 'Failed to post job' });
  }
};

// GET: Fetch all job postings
const getJobs = async (req, res) => {
  try {
    const jobs = await JobPosting.find()
      .populate('postedBy', 'fullname email batch company')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error("GET Jobs Error:", error.message);
    res.status(500).json({ error: 'Failed to fetch job postings' });
  }
};

// GET: Fetch job postings by alumni


const getJobsByAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    
    const jobs = await JobPosting.find({ postedBy: id })
      .populate('postedBy', 'fullname email batch company')
      .sort({ createdAt: -1 });
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error("GET Alumni Jobs Error:", error.message);
    res.status(500).json({ error: 'Failed to fetch alumni job postings' });
  }
};

// DELETE: Delete Job Posting
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the job
    const job = await JobPosting.findById(id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job posting not found' });
    }
    
    // Verify the authenticated user is the owner
    if (job.postedBy.toString() !== req.alumni._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own job postings' });
    }
    
    // Delete the job
    await JobPosting.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error("DELETE Job Error:", error.message);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

// PUT: Update Job Posting
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the job
    const job = await JobPosting.findById(id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job posting not found' });
    }
    
    // Verify the authenticated user is the owner
    if (job.postedBy.toString() !== req.alumni._id.toString()) {
      return res.status(403).json({ error: 'You can only update your own job postings' });
    }
    
    // Update the job
    const updatedJob = await JobPosting.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('postedBy', 'fullname email batch company');
    
    res.status(200).json({
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error("UPDATE Job Error:", error.message);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

export {
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
};