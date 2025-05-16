import mongoose from 'mongoose';

const AlumniSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    usn: { type: String, required: true },
    Batch: { type: Number, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    password: { type: String, required: true },
    isallowed: { type: Boolean, default: false },
    linkedIn :{type:String,required:true},
    company:{type:String,required:true},
    currentRole:{type:String,required:true},
    phone:{type:Number,required:true},
    ref: { type: mongoose.Schema.Types.ObjectId, ref: 'AlumniAdmin' }
  },
  { timestamps: true }
);

export default mongoose.model('Alumni', AlumniSchema);
