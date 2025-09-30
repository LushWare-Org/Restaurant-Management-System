const mongoose = require('mongoose');

const walkinSchema = new mongoose.Schema({
  walkinId: { type: String, required: true, unique: true },
  guestName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  partySize: { type: Number, required: true, min: 1 },
  arrivalTime: { type: Date, default: Date.now },
  estimatedWait: { type: Number, default: 15 }, // in minutes
  status: { 
    type: String, 
    enum: ['waiting', 'called', 'seated', 'left', 'no-show'], 
    default: 'waiting' 
  },
  priority: { 
    type: String, 
    enum: ['normal', 'vip', 'urgent'], 
    default: 'normal' 
  },
  specialRequests: { type: String, default: '' },
  preferredSeating: { 
    type: String, 
    enum: ['any', 'booth', 'window', 'private', 'outdoor'], 
    default: 'any' 
  },
  notificationsSent: { type: Number, default: 0 },
  lastNotified: { type: Date },
  assignedTable: { type: String },
  seatedAt: { type: Date },
  leftAt: { type: Date },
  notes: { type: String },
  source: { type: String, enum: ['walk-in', 'phone', 'online'], default: 'walk-in' },
  allergies: { type: [String], default: [] },
  loyaltyMember: { type: Boolean, default: false },
  previousVisits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

walkinSchema.index({ walkinId: 1 }, { unique: true });
walkinSchema.index({ status: 1 });
walkinSchema.index({ arrivalTime: 1 });
walkinSchema.index({ priority: 1 });

// Update the updatedAt field before saving
walkinSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Walkin', walkinSchema);