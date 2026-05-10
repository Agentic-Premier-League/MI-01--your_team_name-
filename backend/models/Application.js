const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  attachmentNotes: {
    type: String
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'ScreeningRejected', 'InInterview', 'Hired', 'InterviewRejected'],
    default: 'Applied'
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100
  },
  screeningFeedback: {
    type: String
  },
  interviewFeedbackSummary: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
