import mongoose from "mongoose";
const { Schema } = mongoose;
import { v4 as uuidv4 } from "uuid";

const PlacementDocumentSchema = new Schema({
  type: { 
    type: String, 
    enum: ["offer_letter", "joining_letter", "contract", "certificate", "other"],
    required: true 
  },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
});

const SalarySchema = new Schema({
  baseSalary: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  bonus: { type: Number, default: 0 },
  benefits: [String], 
  salaryType: {
    type: String,
    enum: ["annual", "monthly", "hourly"],
    default: "annual"
  }
});

const CompanySchema = new Schema({
  name: { type: String, required: true },
  website: { type: String },
  industry: { type: String },
  size: {
    type: String,
    enum: ["startup", "small", "medium", "large", "enterprise"]
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  description: String
});

const StudentSchema = new Schema({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  course: { type: String, required: true },
  batch: { type: String, required: true },
  department: String
});

const PlacementVerificationSchema = new Schema({
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },
  verifiedBy: { type: String },
  verifiedAt: { type: Date },
  rejectionReason: { type: String },
  documents: { type: [PlacementDocumentSchema], default: [] }
});

const InterviewProcessSchema = new Schema({
  rounds: [{
    roundNumber: { type: Number, required: true },
    roundType: {
      type: String,
      enum: ["online_test", "technical", "hr", "managerial", "group_discussion", "presentation"]
    },
    date: Date,
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled"
    },
    result: {
      type: String,
      enum: ["passed", "failed", "waiting"],
      default: "waiting"
    },
    interviewer: String,
    feedback: String
  }],
  totalRounds: { type: Number, default: 0 },
  completedRounds: { type: Number, default: 0 }
});

const PlacementSchema = new Schema(
  {
    instituteId: { 
      type: Schema.Types.ObjectId, 
      ref: "Institute", 
      required: true 
    },
     placementId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
     uuid: { 
      type: String, 
      unique: true,
      default: () => uuidv4() 
    },
    student: { 
      type: StudentSchema, 
      required: true 
    },
    
    company: { 
      type: CompanySchema, 
      required: true 
    },
    
    jobTitle: { 
      type: String, 
      required: true 
    },
    jobDescription: String,
    jobType: {
      type: String,
      enum: ["full_time", "part_time", "internship", "contract", "freelance"],
      default: "full_time"
    },
    department: String,
    
    salary: { 
      type: SalarySchema, 
    },
    
    applicationDate: { type: Date, default: Date.now },
    interviewDate: Date,
    offerDate: Date,
    joiningDate: { type: Date, required: true },
    
    interviewProcess: { 
      type: InterviewProcessSchema, 
      default: () => ({}) 
    },

    placementStatus: {
      type: String,
      enum: ["applied", "interviewing", "offer_received", "joined", "rejected", "withdrawn"],
      default: "applied"
    },
    
    verification: { 
      type: PlacementVerificationSchema, 
      default: () => ({}) 
    },
    
    skillsUsed: [String],
    isOnCampus: { type: Boolean, default: true },
    referral: {
      referredBy: String,
      relation: String
    },
    
    isActive: { 
      type: Boolean, 
      default: true 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    
  },
  { 
    timestamps: true 
  }
);

PlacementSchema.index({ instituteId: 1, placementId: 1 });
PlacementSchema.index({ instituteId: 1, "student.studentId": 1 });
PlacementSchema.index({ instituteId: 1, "company.name": 1 });
PlacementSchema.index({ instituteId: 1, placementStatus: 1 });
PlacementSchema.index({ instituteId: 1, joiningDate: 1 });
PlacementSchema.index({ "student.email": 1 });
// PlacementSchema.index({ placementId: 1 }, { unique: true });

PlacementSchema.virtual('totalCompensation').get(function() {
  return this.salary.baseSalary + this.salary.bonus;
});

PlacementSchema.virtual('experienceLevel').get(function() {
  const salary = this.salary.baseSalary;
  if (salary < 50000) return "entry_level";
  if (salary < 100000) return "mid_level";
  if (salary < 200000) return "senior_level";
  return "executive";
});


PlacementSchema.methods.isVerified = function() {
  return this.verification.status === "verified";
};

// Calculate days to join
PlacementSchema.methods.daysToJoin = function() {
  const today = new Date();
  const joinDate = new Date(this.joiningDate);
  const diffTime = joinDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

PlacementSchema.statics.findByInstitute = function(instituteId) {
  return this.find({ 
    instituteId, 
    isActive: true, 
    isDeleted: false 
  });
};

PlacementSchema.statics.findByStudent = function(studentId) {
  return this.find({ 
    "student.studentId": studentId,
    isActive: true, 
    isDeleted: false 
  });
};

PlacementSchema.statics.findByCompany = function(companyName) {
  return this.find({ 
    "company.name": new RegExp(companyName, 'i'),
    isActive: true, 
    isDeleted: false 
  });
};

const Placement = mongoose.model("Placement", PlacementSchema);
export default Placement;