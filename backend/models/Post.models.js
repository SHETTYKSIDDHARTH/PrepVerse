import mongoose from 'mongoose';

const baseOptions = {
  discriminatorKey: 'type', 
  timestamps: true,
};

// Base schema with common fields
const postSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alumni',
    required: true,
  },
}, baseOptions);

// Base model
const Post = mongoose.model('Post', postSchema);

// Schema for Job Posting
const JobPostingSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  jd: { 
    type: String, 
    required: true 
  },
  requirements: { 
    type: String, 
    required: true 
  },
  batch: { 
    type: String, 
    required: true 
  },
  jobLink: { 
    type: String, 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
});

const JobPosting = Post.discriminator('job', JobPostingSchema);

// Schema for Interview Experience
const InterviewExperienceSchema = new mongoose.Schema({
  companyName: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
});

const InterviewExperience = Post.discriminator('interview', InterviewExperienceSchema);

// Export models
export { Post, JobPosting, InterviewExperience };