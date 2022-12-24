import mongoose from 'mongoose';

const StyleKampEventSchema = new mongoose.Schema({
  startTime: {
    required: true,
    type: Date
  },
}, {timestamps: true});

const StyleKampEvent = mongoose.model('StyleKampEvent', StyleKampEventSchema);

export { StyleKampEvent }
