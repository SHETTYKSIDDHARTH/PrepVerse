import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  usn: {
    type: String,
    required: true,
    unique: true,
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
  batch: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  sem: {
    type: String,
    required: true
  },
  cgpa: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  resume: {
    type: String
  },
  resumePublicId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', null,'noteligible'],
    default: 'pending'
  },
  studyBuddy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  studyBuddyStartDate: {
    type: Date,
    default: null
  },
  studyBuddyRequestDate: {
    type: Date,
    default: null
  },
  requestedBuddy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  rejectedBuddyRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
   jobApplications: [{
    job: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    tpDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TP',
      required: true
    },
    company: String,
    position: String,
    appliedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'eligible', 'not_eligible'],
      default: 'pending'
    }
  }],
  // Notifications system for students
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

}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
export default Student;