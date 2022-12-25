import mongoose from 'mongoose';

const ERC1155NFTMetadataSchema = new mongoose.Schema({
  chainId: {
    required: true,
    type: String
  },
  owner: {
    required: true,
    type: String
  },
  nftAddress: {
    required: true,
    type: String
  },
  tokenId: {
    required: true,
    type: String
  },
  tokenUri: {
    type: String
  },
  image: {
    type: String
  },
}, {timestamps: true});

const ERC1155NFTMetadata = mongoose.model('ERC1155NFTMetadata', ERC1155NFTMetadataSchema);

export { ERC1155NFTMetadata }