import mongoose from 'mongoose';

const AlumniAdminSchema = new mongoose.Schema({
  loginId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const AlumniAdmin = mongoose.model('AlumniAdmin', AlumniAdminSchema);

export default AlumniAdmin;
