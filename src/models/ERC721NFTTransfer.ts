import mongoose from 'mongoose';

const ERC721NFTTransferSchema = new mongoose.Schema({
  chainId: {
    required: true,
    type: String
  },
  transactionHash: {
    required: true,
    type: String
  },
  logIndex: {
    required: true,
    type: String
  },
  from: {
    required: true,
    type: String
  },
  to: {
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
  confirmed: {
    required: true,
    type: Boolean
  }
}, {timestamps: true});

const ERC721NFTTransfer = mongoose.model('ERC721NFTTransfer', ERC721NFTTransferSchema);

export { ERC721NFTTransfer }