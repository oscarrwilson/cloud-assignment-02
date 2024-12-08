const mongoose = require('mongoose');

// Schema for numeric ID auto-increment
const counterSchema = new mongoose.Schema({
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.model('Counter', counterSchema);

// Text schema
const textSchema = new mongoose.Schema({
  numericId: {
    type: Number,
    unique: true,
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
});

// Pre-save hook to auto-increment numericId
textSchema.pre('validate', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        {},
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.numericId = counter.seq;
    } catch (error) {
      console.error('Error incrementing numeric ID:', error);
      next(error);
    }
  }
  next();
});

const Text = mongoose.model('Text', textSchema);

module.exports = Text;