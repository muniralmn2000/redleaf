const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    // select: false, // Don't send password back by default in queries (will add this back later)
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'parent'],
    required: [true, 'Please select a role'],
  },
  studentId: { // Unique ID for students
    type: String,
    unique: true,
    sparse: true, // Allows null values for non-students to not violate unique constraint
  },
  idDocumentPath: { // Path to the uploaded ID document for students
    type: String,
  },
  isTransferStudent: {
    type: Boolean,
    default: false,
  },
  transferLetterPath: { // Path to the uploaded transfer letter
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// We will add password hashing pre-save middleware here later

// We will add student ID generation logic here later

module.exports = mongoose.model('User', UserSchema); 