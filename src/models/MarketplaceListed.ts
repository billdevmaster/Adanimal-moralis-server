import mongoose from 'mongoose';

const MarketplaceListedSchema = new mongoose.Schema({
  chainId: {
    required: true,
    type: String
  },
  transactionHash: {
    required: true,
    type: String,
  },
  listingId: {
    required: true,
    type: Number
  },
  nftAddress: {
    required: true,
    type: String,
  },
  tokenId: {
    required: true,
    type: String
  },
  seller: {
    required: true,
    type: String
  },
  amount: {
    type: Number
  },
  currency: {
    required: true,
    type: String
  },
  price: {
    type: Number
  },
  nftType: {
    type: String
  },
  completed: {
    type: Boolean
  },
  lastSoldTime: {
    type: Date
  },
  confirmed: {
    type: Boolean
  },
}, {timestamps: true});

const MarketplaceListed = mongoose.model('MarketplaceListed', MarketplaceListedSchema);

export { MarketplaceListed }
