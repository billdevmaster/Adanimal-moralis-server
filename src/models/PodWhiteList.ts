import mongoose from 'mongoose';

const PodWhiteListSchema = new mongoose.Schema({
  address: {
    required: true,
    type: String,
  },
  leaf: {
    required: true,
    type: String,
  },
  merkleProof: {
    required: true,
    type: Array,
  }
}, {timestamps: true});

const PodWhiteList = mongoose.model('PodWhitelist', PodWhiteListSchema);

export { PodWhiteList }
