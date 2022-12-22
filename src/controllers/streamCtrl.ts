import { Request, Response } from 'express';
import Moralis from 'moralis';
import Axios from 'axios';
import Web3 from 'web3';
import { ethers } from 'ethers';
import address from '../contracts/address';
import Constant from '../constant';
import { realtimeUpsertParams } from '../utils';
import { NKMainNFTMetadata } from '../models/NKMainNFTMetadata';
import { ERC721NFTTransfer } from '../models/ERC721NFTTransfer';
import { KampNFTMetadata } from '../models/KampNFTMetadata';
import { StyleKampNutritionHistory } from '../models/StyleKampNutritionHistory';
import { MarketplaceListed } from '../models/MarketplaceListed';
import { MarketplaceSale } from '../models/MarketplaceSale';
import { ERC1155NFTTransfer } from '../models/ERC1155NFTTransfer';
import { ERC1155NFTMetadata } from '../models/ERC1155NFTMetadata';

const ERC1155ABI: any = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "uri",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const ERC721NftTransferCtrl = async (req: Request, res: Response) => {
  try {
    const { body, headers } = req;
    const signature = headers["x-signature"] ? headers["x-signature"].toString() : "";
    Moralis.Streams.verifySignature({
      body,
      signature
    });
    /* Your code to update the database here */
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < req.body.logs.length; i++) {
      const abi = req.body.abi;
      const { filter, update } = realtimeUpsertParams(abi, req.body.logs[i], req.body.confirmed, req.body.block);
      // save transaction
      const txQuery = { transactionHash: filter.transaction_hash };
      const txUpdate = {
        $set: {
          transactionHash: filter.transaction_hash,
          nftAddress: update.address,
          tokenId: update.tokenId,
          from: update.from,
          to: update.to,
          confirmed: update.confirmed
        }
      }
      await ERC721NFTTransfer.updateOne(txQuery, txUpdate, {upsert: true});
      if (update.address === address.NKMAIN_NFT_ADDRESS.toLowerCase()) {
        // save nkmainnft metadata
        const metadataQuery = { nftAddress: update.address, tokenId: update.tokenId };
        const tokenURI = Constant.NKMAINNFT_BASE_URI + update.tokenId;
        const metadata = await Axios.get(tokenURI);
        
        const metadataUpdate = {
          $set: {
            name: metadata.data.name,
            description: metadata.data.description,
            externalUrl: metadata.data.external_url,
            image: metadata.data.image,
            rarity: metadata.data.rarity,
            rarityValue: metadata.data.rarityValue,
            tail: '',
            horn: '',
            eyes: '',
            hair: '',
            wings: '',
            mouth: '',
            body: '',
            nftAddress: update.address,
            tokenId: update.tokenId,
            owner: update.to,
          }
        }
        
        if (metadata.data.attributes) {
          metadata.data.attributes.forEach((item: any) => {
            if (item.trait_type == 'tail') {
              metadataUpdate.$set.tail = item.value;
            } else if (item.trait_type == 'horn') {
              metadataUpdate.$set.horn = item.value;
            } else if (item.trait_type == 'eyes') {
              metadataUpdate.$set.eyes = item.value;
            } else if (item.trait_type == 'hair') {
              metadataUpdate.$set.hair = item.value;
            } else if (item.trait_type == 'wings') {
              metadataUpdate.$set.wings = item.value;
            } else if (item.trait_type == 'mouth') {
              metadataUpdate.$set.mouth = item.value;
            } else {
              metadataUpdate.$set.body = item.value;
            }
          })
        }
        await NKMainNFTMetadata.updateOne(metadataQuery, metadataUpdate, {upsert: true});
        
      } else if (update.address === address.POD_NFT_ADDRESS.toLowerCase()) {
        // save kamp nft metadata
        const metadataQuery = { nftAddress: update.address, tokenId: update.tokenId };
        const tokenURI = Constant.KAMPNFT_BASE_URI + update.tokenId;
        const metadata = await Axios.get(tokenURI);
        const metadataUpdate = {
          $set: {
            nftAddress: update.address,
            tokenId: update.tokenId,
            owner: update.to,
            name: metadata.data.name,
            description: metadata.data.description,
            externalUrl: metadata.data.external_url,
            image: metadata.data.image,
          }
        }
        await KampNFTMetadata.updateOne(metadataQuery, metadataUpdate, {upsert: true});
      }
    }
    return res.status(200).json();
  } catch (e) {
    console.log(e)
    return res.status(400).json();
  }
}

const styleKampNFTWithERC1155 = async (req: Request, res: Response) => {
  try {
    const { body, headers } = req;
    const signature = headers["x-signature"] ? headers["x-signature"].toString() : "";
    Moralis.Streams.verifySignature({
      body,
      signature
    });
    for (let i = 0; i < req.body.logs.length; i++) {
      const abi = req.body.abi;
      const { filter, update } = realtimeUpsertParams(abi, req.body.logs[i], req.body.confirmed, req.body.block);
      // save transaction
      const txQuery = { transactionHash: filter.transaction_hash, chainId: body.chainId };
      const txUpdate = {
        $set: {
          transactionHash: filter.transaction_hash,
          feeder: update.feeder,
          kampNftId: update.podNftId,
          styleTokenType: update.itemType,
          chainId: body.chainId,
          styleTokenAddress: update.itemNftAddress,
          styleTokenId: "",
          styleTokenWeight: parseFloat(update.weight),
          styleTokenAmount: parseFloat(update.amount),
          decimal: parseFloat(update.decimal),
          nutritionScore: parseFloat((parseFloat(update.weight) * parseFloat(update.amount) / Math.pow(10, parseInt(update.decimal))).toString()),
          confirmed: update.confirmed
        }
      }
      
      if (update.itemType === 'ERC1155') {
        txUpdate.$set.styleTokenId = update.itemNftId;
      } else {
        txUpdate.$set.styleTokenAmount = parseFloat(ethers.utils.formatEther(update.amount));
        txUpdate.$set.nutritionScore = parseFloat((parseFloat(update.weight) * parseFloat(ethers.utils.formatEther(update.amount)) / Math.pow(10, parseInt(update.decimal))).toString());
      }
      await StyleKampNutritionHistory.updateOne(txQuery, txUpdate, {upsert: true});
    }

    return res.status(200).json();
  } catch (e) {
    console.log(e)
    return res.status(400).json();
  }
}

const marketplaceItemListed = async (req: Request, res: Response) => {
  try {
    const { body, headers } = req;
    const signature = headers["x-signature"] ? headers["x-signature"].toString() : "";
    Moralis.Streams.verifySignature({
      body,
      signature
    });

    for (let i = 0; i < req.body.logs.length; i++) {
      const abi = req.body.abi;
      const { filter, update, eventName } = realtimeUpsertParams(abi, req.body.logs[i], req.body.confirmed, req.body.block);
      if (eventName === 'ItemListed') {
        const listedQuery = { transactionHash: filter.transaction_hash, chainId: body.chainId };
        const listedUpdate = {
          $set: {
            chainId: body.chainId,
            transactionHash: filter.transaction_hash,
            listingId: update.listingId,
            nftAddress: update.nftAddress,
            tokenId: update.tokenId,
            seller: update.seller,
            amount: update.amount,
            currency: update.currency,
            price: update.price,
            nftType: update.nftType,
            completed: update.completed,
            confirmed: update.confirmed
          }
        }
        await MarketplaceListed.updateOne(listedQuery, listedUpdate, {upsert: true});
      } else if (eventName === 'ItemCanceled') {
        const cancelQuery = { listingId: update.listingId };
        const cancelUpdate = {
          $set: {
            completed: true,
          }
        }
        await MarketplaceListed.updateOne(cancelQuery, cancelUpdate, {upsert: true});
      } else if (eventName === 'ItemBought') {
        const saleQuery = { transactionHash: filter.transaction_hash, chainId: body.chainId };
        const saleUpdate = {
          $set: {
            chainId: body.chainId,
            transactionHash: filter.transaction_hash,
            listingId: update.listingId,
            nftAddress: update.nftAddress,
            tokenId: update.tokenId,
            buyer: update.buyer,
            seller: update.seller,
            amount: update.amount,
            currency: update.currency,
            price: update.price,
            confirmed: update.confirmed
          }
        }
        await MarketplaceSale.updateOne(saleQuery, saleUpdate, {upsert: true});
        const listedQuery = { listingId: update.listingId };
        const listedUpdate = {
          $set: {
            completed: update.completed,
            lastSoldTime: Date.now()
          }
        }
        await MarketplaceListed.updateOne(listedQuery, listedUpdate, {upsert: true});
      }
    }

    return res.status(200).json();
  } catch (e) {
    console.log(e)
    return res.status(400).json();
  }
}

const erc1155NFTTransfer = async (req: Request, res: Response) => {
  try {
    const { body, headers } = req;
    const signature = headers["x-signature"] ? headers["x-signature"].toString() : "";
    Moralis.Streams.verifySignature({
      body,
      signature
    });
    for (let i = 0; i < req.body.logs.length; i++) {
      const abi = req.body.abi;
      const { filter, update, eventName } = realtimeUpsertParams(abi, req.body.logs[i], req.body.confirmed, req.body.block);
      if (eventName === 'TransferSingle') {
        const transferQuery = {chainId: body.chainId, transactionHash: filter.transaction_hash};
        const transferUpdate = {
          $set: {
            chainId: body.chainId,
            transactionHash: filter.transaction_hash,
            nftAddress: update.address,
            tokenId: update.id,
            operator: update.operator,
            from: update.from,
            to: update.to,
            amount: parseInt(update.value),
            confirmed: update.confirmed
          }
        };
        await ERC1155NFTTransfer.updateOne(transferQuery, transferUpdate, {upsert: true});

        // save metadata
        const savedOne = await ERC1155NFTMetadata.findOne({chainId: body.chainId, lastTransactionHash: filter.transaction_hash});
        if (!savedOne) {
          // detect send
          const sendnft = await ERC1155NFTMetadata.findOne({nftAddress: update.address, tokenId: update.id, owner: update.from});
          const receivenft = await ERC1155NFTMetadata.findOne({nftAddress: update.address, tokenId: update.id, owner: update.to});
          if (sendnft) {
            // case of minus
            sendnft.amount -= parseInt(update.value);
            sendnft.lastTransactionHash = filter.transaction_hash;
            await sendnft.save();
          } else if (receivenft) {
            // case of plus
            receivenft.amount += parseInt(update.value);
            receivenft.lastTransactionHash = filter.transaction_hash;
            await receivenft.save();
          } else {
            const metadata = new ERC1155NFTMetadata();
            metadata.chainId = body.chainId;
            metadata.owner = update.to;
            metadata.nftAddress = update.address;
            metadata.tokenId = update.id;
            metadata.amount = parseInt(update.value);
            
            const provider = new Web3.providers.HttpProvider(
              Constant.PROVIDERS[parseInt(body.chainId, 16).toString()]
            );
            const web3 = new Web3(provider);
            const Erc1155Contract = new web3.eth.Contract(ERC1155ABI, update.address)

            const tokenUri = await Erc1155Contract.methods.uri(update.id).call();
            metadata.tokenUri = tokenUri;
            const metadataRet: any = await Axios.get(tokenUri);
            metadata.image = metadataRet.data.image;
            metadata.lastTransactionHash = filter.transaction_hash;
            await metadata.save();
          }
        }
      } else {
        await Promise.all(update.ids.map(async (id: any, index: any) => {
          const transferQuery = {chainId: body.chainId, transactionHash: filter.transaction_hash};
          const transferUpdate = {
            $set: {
              chainId: body.chainId,
              transactionHash: filter.transaction_hash,
              nftAddress: update.address,
              tokenId: id,
              operator: update.operator,
              from: update.from,
              to: update.to,
              amount: parseInt(update.values[index]),
              confirmed: update.confirmed
            }
          };
          await ERC1155NFTTransfer.updateOne(transferQuery, transferUpdate, { upsert: true });
          // save metadata
          const savedOne = await ERC1155NFTMetadata.findOne({chainId: body.chainId, lastTransactionHash: filter.transaction_hash});
          if (!savedOne) {
            // detect send
            const sendnft = await ERC1155NFTMetadata.findOne({ nftAddress: update.address, tokenId: id, owner: update.from });
            const receivenft = await ERC1155NFTMetadata.findOne({ nftAddress: update.address, tokenId: id, owner: update.to });
            if (sendnft) {
              // case of minus
              sendnft.amount -= parseInt(update.values[index]);
              sendnft.lastTransactionHash = filter.transaction_hash;
              await sendnft.save();
            } else if (receivenft) {
              // case of plus
              receivenft.amount += parseInt(update.values[index]);
              receivenft.lastTransactionHash = filter.transaction_hash;
              await receivenft.save();
            } else {
              const metadata = new ERC1155NFTMetadata();
              metadata.chainId = body.chainId;
              metadata.owner = update.to;
              metadata.nftAddress = update.address;
              metadata.tokenId = id;
              metadata.amount = parseInt(update.values[index]);
              
              const provider = new Web3.providers.HttpProvider(
                Constant.PROVIDERS[parseInt(body.chainId, 16).toString()]
              );
              const web3 = new Web3(provider);
              const Erc1155Contract = new web3.eth.Contract(ERC1155ABI, update.address)

              const tokenUri = await Erc1155Contract.methods.uri(id).call();
              metadata.tokenUri = tokenUri;
              const metadataRet: any = await Axios.get(tokenUri);
              metadata.image = metadataRet.data.image;
              metadata.lastTransactionHash = filter.transaction_hash;
              await metadata.save();
            }
          }
        }))
      }
    }
    return res.status(200).json();
  } catch (e) {
    console.log(e)
    return res.status(400).json();
  }
}

export default { 
  ERC721NftTransferCtrl,
  styleKampNFTWithERC1155,
  marketplaceItemListed,
  erc1155NFTTransfer
};