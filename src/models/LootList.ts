import mongoose from 'mongoose';

const LootListSchema = new mongoose.Schema({
  nftAddress: {
    required: true,
    type: String,
  },
  tokenId: {
    required: true,
    type: Number
  },
  lootboxId: {
    required: true,
    type: Number
  },
  probability: {
    required: true,
    type: Number
  },
  maxAmount: {
    type: Number
  },
  isLimited: {
    type: Boolean,
    default: false
  },
  mintedAmount: {
    type: Number,
    default: 0
  }
});

const LootList = mongoose.model('LootList', LootListSchema);

export { LootList }
