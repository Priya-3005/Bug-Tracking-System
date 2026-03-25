const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const bugSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    severity: { type: String, enum: ['minor', 'major', 'critical', 'blocker'], default: 'major' },
    status: {
      type: String,
      enum: ['new', 'assigned', 'in_progress', 'resolved', 'closed', 'reopened'],
      default: 'new',
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportedByName: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedToName: { type: String, default: null },
    tags: [{ type: String }],
    comments: [commentSchema],
    environment: { type: String, default: '' },
    stepsToReproduce: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bug', bugSchema);
