import mongoose from "mongoose";
const { Schema } = mongoose;

//Document Schema 
const DocumentSchema = new Schema({
  type: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
});

//Verification Schema 
const VerificationSchema = new Schema({
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  documents: { type: [DocumentSchema], default: [] },
  verifiedBy: { type: String },
  verifiedAt: { type: Date },
  rejectionReason: { type: String },
  automated: {
    enabled: { type: Boolean, default: false },
    lastRunAt: { type: Date },
    result: { type: String },
  },
});

// ==================== Subschemas ====================
const AddressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
});

const ContactInfoSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true ,unique:true},
  phone: { type: String, required: true ,unique:true},
  address: { type: AddressSchema },
});

const LocationSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number], 
    required: true,
  },
});

const AccreditationSchema = new Schema({
  body: String,
  certificateNumber: String,
  validFrom: Date,
  validTo: Date,
  document: String,
});

const SocialMediaSchema = new Schema({
  facebook: String,
  twitter: String,
  linkedin: String,
  youtube: String,
});

const StatisticsSchema = new Schema({
  totalCourses: {
    type:Number,
    default:0
  },
  totalStudents: {
    type:Number,
    default:0
  },
  averageRating: {
    type:Number,
    default:0
  },
  totalReviews: {
    type:Number,
    default:0
  },
  totalRevenue: {
    type:Number,
    default:0
  },
});

const SettingsSchema = new Schema({
  allowReviews: Boolean,
  autoApproveInstructors: Boolean,
  commissionRate: Number,
});

const InstituteSchema = new Schema(
  {
    uuid: { type: String, required: true, unique: true },
    userId:{
      type:mongoose.Types.ObjectId,
      required:true
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
    coverImage: { type: String, required: true },
    website: { type: String, required: true },
    established_year: { type:Number, required: true },
    number_of_faculty: { type: Number},
    student_capacity: { type:Number },

    contactInfo: ContactInfoSchema,
    location: LocationSchema,

    verification: { type: VerificationSchema, default: () => ({}) },
    accreditation: [AccreditationSchema],
    socialMedia: SocialMediaSchema,
    statistics: StatisticsSchema,
    settings: SettingsSchema,

    adminUsers: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isdeleted:{ type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending","active", "blocked", "suspended"],
      default: "pending",
    },

  },
  { timestamps: true }
);

InstituteSchema.index({ location: "2dsphere" });

const Institute = mongoose.model("Institute", InstituteSchema);
export default Institute;
