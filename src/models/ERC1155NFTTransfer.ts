import mongoose from 'mongoose';

const ERC1155NFTTransferSchema = new mongoose.Schema({
  chainId: {
    required: true,
    type: String
  },
  transactionHash: {
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
  operator: {
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
  amount: {
    required: true,
    type: Number
  },
  confirmed: {
    required: true,
    type: Boolean
  }
}, {timestamps: true});

const ERC1155NFTTransfer = mongoose.model('ERC1155NFTTransfer', ERC1155NFTTransferSchema);

export { ERC1155NFTTransfer }