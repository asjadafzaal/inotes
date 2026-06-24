const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
});

module.exports = mongoose.model('Note', noteSchema);
