import mongoose from 'mongoose';

// Job Schema - Enhanced with more fields for better job management
const jobSchema = new mongoose.Schema({
  jobtitle: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  jobdesc: {
    type: String,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  minimumCGPA: {
    type: Number,
    default: 0
  },
 eligibleBranches: {
  type: [String],
  enum: ['ECE', 'CSE', 'IS'],
  required: true,
  validate: [array => array.length > 0, 'At least one branch must be selected.']
},

  deadline: {
    type: Date
  },
  jobStatus: {
    type: String,
    enum: ['open', 'closed', 'upcoming'],
    default: 'open'
  },
  applicants: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    name: String,
    email: String,
    phone: String,
    branch: String,
    cgpa: Number,
    status: {
      type: String,
      enum: ['pending', 'eligible', 'not_eligible'],
      default: 'pending'
    },
    appliedDate: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Training and Placement Department Schema
const TPSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  jobs: [jobSchema],
  notifications: [{
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }]
}, { timestamps: true });

// Create model from schema
const TP = mongoose.model('TP', TPSchema);

export default TP;