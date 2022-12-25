import mongoose from 'mongoose';

const ItemRewardSchema = new mongoose.Schema({
  chainId: {
    required: true,
    type: String
  },
  transactionHash: {
    require: true,
    type: String
  },
  logIndex: {
    required: true,
    type: String,
  },
  recipient: {
    required: true,
    type: String
  },
  tokenAddress: {
    required: true,
    type: String
  },
  tokenId: {
    required: true,
    type: String
  },
  lootboxId: {
    required: true,
    type: String
  },
  contractAddress: {
    type: String
  },
  confirmed: {
    required: true,
    type: Boolean
  }
}, {timestamps: true});

const ItemReward = mongoose.model('ItemReward', ItemRewardSchema);

export { ItemReward }
