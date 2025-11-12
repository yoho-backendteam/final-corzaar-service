import mongoose from "mongoose";
const { Schema } = mongoose;
import { v4 as uuidv4 } from "uuid";

const AddressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
});

const ContactInfoSchema = new Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: AddressSchema },
});

const LocationSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
});


const BranchSettingsSchema = new Schema({
  allowBookings: { type: Boolean, default: true },
  allowOnsitePayments: { type: Boolean, default: true },
  operatingHours: {
    open: String, // "09:00"
    close: String, // "18:00"
    timezone: String, // "UTC+5:30"
  },
  isActive: { type: Boolean, default: true },
});

const BranchStatisticsSchema = new Schema({
  totalStudents: { type: Number, default: 0 },
  totalCourses: { type: Number, default: 0 },
  totalClassrooms: { type: Number, default: 0 },
  totalStaff: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
});

const BranchSchema = new Schema(
  {
    instituteId: { 
      type: Schema.Types.ObjectId, 
      ref: "Institute", 
      required: true 
    },  
     uuid: { 
          type: String, 
          unique: true,
          default: () => uuidv4() 
        },
 
    branchCode: { 
      type: String, 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    
    contactInfo: { 
      type: ContactInfoSchema, 
      required: true 
    },
    location: { 
      type: LocationSchema, 
      required: true 
    },
    
    images: {
      logo: String,
      coverImage: String,
      gallery: [String] 
    },
    
    statistics: { 
      type: BranchStatisticsSchema, 
      default: () => ({}) 
    },
   
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance", "closed"],
      default: "active"
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    
    establishedDate: { 
      type: Date 
    },
    lastMaintenanceDate: { 
      type: Date 
    }
  },
  { 
    timestamps: true 
  }
);

BranchSchema.index({ instituteId: 1, branchCode: 1 }, { unique: true });

BranchSchema.index({ location: "2dsphere" });

BranchSchema.index({ instituteId: 1, isActive: 1, isDeleted: 1 });

BranchSchema.virtual('fullAddress').get(function() {
  if (!this.contactInfo?.address) return '';
  const addr = this.contactInfo.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

BranchSchema.methods.isOpen = function() {
  if (!this.settings?.operatingHours) return false;
  
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); 
  const { open, close } = this.settings.operatingHours;
  
  return currentTime >= open && currentTime <= close;
};


BranchSchema.statics.findByInstitute = function(instituteId) {
  return this.find({ 
    instituteId, 
    isActive: true, 
    isDeleted: false 
  });
};


BranchSchema.statics.findNearby = function(coordinates, maxDistance = 5000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coordinates
        },
        $maxDistance: maxDistance 
      }
    },
    isActive: true,
    isDeleted: false
  });
};

const Branch = mongoose.model("Branch", BranchSchema);
export default Branch;