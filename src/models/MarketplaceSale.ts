import mongoose from 'mongoose';

const MarketplaceSaleSchema = new mongoose.Schema({
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
  buyer: {
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
  price: {
    type: String
  },
  confirmed: {
    type: Boolean
  }
}, {timestamps: true});

const MarketplaceSale = mongoose.model('MarketplaceSale', MarketplaceSaleSchema);

export { MarketplaceSale }
