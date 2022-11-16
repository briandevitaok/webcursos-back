const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const curseSchema = new Schema(
  {
    name: String,
    thumbnail: String,
    description: String,
    sections: [
      {
        name: String,
        recordingDay: String,
        recordedAt: String,
        realDuration: String,
        videos: [{ title: String, videoUrl: String, duration: String }],
        
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', curseSchema, 'courses');
