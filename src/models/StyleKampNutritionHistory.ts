import mongoose from 'mongoose';

const StyleKampNutritionHistorySchema = new mongoose.Schema({
  chainId: {
    required: true,
    type: String
  },
  transactionHash: {
    required: true,
    type: String,
  },
  logIndex: {
    required: true,
    type: String,
  },
  feeder: {
    required: true,
    type: String
  },
  kampNftId: {
    required: true,
    type: String,
  },
  styleTokenType: {
    required: true,
    type: String
  },
  
  styleTokenAddress: {
    required: true,
    type: String
  },
  styleTokenId: {
    type: String
  },
  styleTokenWeight: {
    required: true,
    type: Number
  },
  styleTokenAmount: {
    required: true,
    type: Number
  },
  decimal: {
    required: true,
    type: Number
  },
  nutritionScore: {
    required: true,
    type: Number
  },
  confirmed: {
    required: true,
    type: Boolean
  }
}, {timestamps: true});

const StyleKampNutritionHistory = mongoose.model('StyleKampNutritionHistory', StyleKampNutritionHistorySchema);

export { StyleKampNutritionHistory }
