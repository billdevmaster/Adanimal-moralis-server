import mongoose from 'mongoose';

const KampNFTMetadataSchema = new mongoose.Schema({
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
  items: {
    require: true,
    type: Array
  },
  likes: {
    type: Number
  },
  wins: {
    type: Number
  },
  legacy: {
    type: Boolean
  }
}, {timestamps: true});

const KampNFTMetadata = mongoose.model('KampNFTMetadata', KampNFTMetadataSchema);

export { KampNFTMetadata }
