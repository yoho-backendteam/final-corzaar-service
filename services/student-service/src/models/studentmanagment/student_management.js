import mongoose from 'mongoose';
import {v4 as uuidv4} from "uuid";

const studentSchema = new mongoose.Schema({

  uuid:{
       type: String,
    unique: true,
    default: uuidv4
  },
  userId: {
    type: String,
    unique: true,
  },
  studentId:{
    type:String
  },
  fullName:{
    type:String,
    required:true
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'dropped', 'suspended'],
    default: 'active'
  },


  personalInfo: {
    firstName:{type:String},
    lastName:{type:String},
    phoneNumber:{type:Number},
    email:{type:String},
    dateOfBirth: { type: String },
    gender: { type: String },
    bloodGroup: { type: String },
    nationality: { type: String },
    religion: { type: String },
    category: { type: String },
    address: {
      permanent: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String }
      },
      current: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String }
      }
    },
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String},
      email: { type: String }
    }
  },

  
  academicInfo: {
    previousEducation: [{
      level: { type: String },
      institution: { type: String },
      board: { type: String },
      yearOfPassing: { type: Number },
      percentage: { type: Number },
      subjects: [{ type: String }]
    }],
    currentGPA: { type: Number, min: 0, max: 10 },
    totalCredits: { type: Number, default: 0 },
    completedCredits: { type: Number, default: 0 }
  },

  
  documents: [{
    type: { type: String },
    name: { type: String },
    url: { type: String }, 
    uploadedAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });


studentSchema.pre('save', async function (next) {
  if (!this.studentId) {
    const count = await mongoose.model('Student').countDocuments() + 1;
    const year = new Date().getFullYear();
    this.studentId = `STU${year}-${String(count).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Student', studentSchema);