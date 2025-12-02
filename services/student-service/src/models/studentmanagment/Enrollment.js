import mongoose from 'mongoose'
import {v4 as uuidv4} from "uuid";


const EnrollmentSchema = new mongoose.Schema({

  orderId: {
     type: String,
     unique: true,
     default: uuidv4 
    },

  instituteId:{
    type:mongoose.Types.ObjectId,
    required:true
  },


  userId: {
      type: mongoose.Schema.Types.ObjectId,
             ref: "Student"
    },

  cartId:{
    type:mongoose.Types.ObjectId,
  },
  // items: [{
  //   courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  //   title: { type: String, required: true },
  //   price: { type: Number, required: true },
  //   discountPrice: { type: Number, default: 0 },
  //   instituteId: {type: mongoose.Schema.Types.ObjectId, ref: "Institute" }
  // }],
  items:{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    batchId:{type:mongoose.Types.ObjectId, required:true}
  },

  pricing: {
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
  },

  coupon: {
    code: { type: String },
    discountAmount: { type: Number, default: 0 },
    discountType: { type: String, enum: ['percentage', 'fixed'] }
  },

  payment:{
    type:String,
  },

  // payment: {
  //   method: { type: String },
  //   status: { 
  //     type: String, 
  //     enum: ['pending', 'completed', 'failed', 'refunded'], 
  //     default: 'pending' 
  //   },
  //   transactionId: { type: String },
  //   paymentIntentId: { type: String },
  //   paidAt: { type: Date },
  //   refundedAt: { type: Date },
  //   refundAmount: { type: Number, default: 0 }
  // },

  billing: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: Object } 
  },

  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  }

}, { timestamps: true });



export default mongoose.model('Enrollment', EnrollmentSchema);
