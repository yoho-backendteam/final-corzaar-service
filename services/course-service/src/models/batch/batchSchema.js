import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const batchSchema = new mongoose.Schema({
  merchantId: {
    type : mongoose.Schema.ObjectId,
    },
  batchId: {
    type: String,
    required: true,
    default : uuidv4,
    unique: true
  },
  uuid: {
    type: String,
    required: true,
    default : uuidv4,
    unique: true
  },
  courseId: {
    type : mongoose.Schema.ObjectId,
    ref: "Course",
    required: true
  },
  batchName: {
    type: String,
    required: true,
    trim: true
  },
  batchCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  studentId :[ {
    type : String,
    required: true
  }],
  seatsAvailable : {
    type: String,
    required: true
  },
  seatsFilled : {
    type: String,
    required: true
  },
  totalSeats : {
    type: String,
    required: true
  },
  students:[{
    type:mongoose.Types.ObjectId,
  },],
  schedule: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    classDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    classTime: {
      start: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      },
      end: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      },
      timezone: {
        type: String,
        required: true,
        default : "Asia/Kolkata"
      }
    }
  },
  settings: {
    allowEnrollment: {
      type: Boolean,
      default: true
    },
    autoApproveEnrollment: {
      type: Boolean,
      default: false
    },
    allowWithdrawal: {
      type: Boolean,
      default: true
    },
    maxWithdrawalDays: {
      type: Number,
      default: 7
    },
    allowCourseExtension: {
      type: Boolean,
      default: false
    },
    extensionMaxDays: {
      type: Number,
      default: 30
    },
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    }
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default : Date.now
  },
  updatedAt: {
    type: Date,
    default : Date.now
  },
  metadata: {
    timezone: {
      type: String,
      default: 'UTC'
    },
    locale: {
      type: String,
      default: 'en-US'
    },
    version: {
      type: String,
      default: '1.0.0'
    }
  },
  isFeatured: { 
    type: Boolean,
    default: false
 },
  isdeleted : {
    type : Boolean,
    default : false
  }
}, {
  timestamps: true 
});

// // Indexes for better query performance
// batchSchema.index({ batchId: 1 });
// batchSchema.index({ courseId: 1 });
// batchSchema.index({ batchCode: 1 });
// batchSchema.index({ status: 1 });
// batchSchema.index({ 'schedule.startDate': 1 });
// batchSchema.index({ 'schedule.endDate': 1 });

// // Pre-save middleware to update updatedAt
// batchSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // Method to check if batch is currently active based on dates
// batchSchema.methods.isCurrentlyActive = function() {
//   const now = new Date();
//   return now >= this.schedule.startDate && now <= this.schedule.endDate;
// };

// // Static method to find active batches
// batchSchema.statics.findActiveBatches = function() {
//   const now = new Date();
//   return this.find({
//     'schedule.startDate': { $lte: now },
//     'schedule.endDate': { $gte: now },
//     status: 'active',
//     isActive: true
//   });
// };

export const Batch = mongoose.model('Batch', batchSchema);
