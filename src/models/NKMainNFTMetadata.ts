import mongoose from 'mongoose';

const NKMainNFTMetadataSchema = new mongoose.Schema({
  owner: {
    required: true,
    type: String,
  },
  nftAddress: {
    required: true,
    type: String,
  },
  tokenId: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  description: {
    type: String
  },
  externalUrl: {
    type: String
  },
  image: {
    type: String
  },
  rarity: {
    type: String
  },
  rarityValue: {
    type: Number
  },
  horn: {
    type: String
  },
  eyes: {
    type: String
  },
  hair: {
    type: String
  },
  wings: {
    type: String
  },
  tail: {
    type: String
  },
  mouth: {
    type: String
  },
  body: {
    type: String
  }
}, {timestamps: true});

const NKMainNFTMetadata = mongoose.model('NKMainNFTMetadata', NKMainNFTMetadataSchema);

export { NKMainNFTMetadata }
