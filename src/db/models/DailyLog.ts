import mongoose, { Schema, model, models } from 'mongoose';

const DailyLogSchema = new Schema({
  date: { type: Date, required: true },
  wakeUpTime: String,
  waterIntake: Number,
  workout: [String],
  danceTime: Number,
  readingTime: Number,
  meditationTime: Number,
  reflection: String,
  noPMOStreak: Number,
});

export const DailyLog = models.DailyLog || model('DailyLog', DailyLogSchema);
