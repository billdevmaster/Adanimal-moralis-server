import Web3 from 'web3';
import { ethers } from 'ethers';
import Constants from '../constant';

const web3 = new Web3();

const encodeRequest = (nftAddress: any, tokenId: any, nonce: any) => {
  return web3.eth.abi.encodeParameter(
    {
      request: {
        nftAddress: 'address',
        tokenId: 'uint',
        nonce: 'bytes',
      },
    },
    {
      nftAddress,
      tokenId,
      nonce,
    }
  );
};

const createSignature = (account: any, nftAddress: any, tokenId: any, nonce: any) => {
  const encodedRequest = encodeRequest(nftAddress, tokenId, nonce);
  const hash = ethers.utils.solidityKeccak256(
    ['address', 'address', 'bytes'],
    [Constants.CLAIM_CONTRACT_ADDRESS, account, encodedRequest]
  );
  const signerkey: string = process.env.SIGNER_PK ? process.env.SIGNER_PK : "";
  const web3Account = web3.eth.accounts.privateKeyToAccount(signerkey);
  return {
    signature: web3Account.sign(hash).signature,
    encodedRequest,
  };
};

const encodeRequestForMintLootbox = (week1Tier: any, week2Tier: any, week3Tier: any, week4Tier: any, nonce: any) => {
  return web3.eth.abi.encodeParameter(
    {
      request: {
        week1Tier: 'uint',
        week2Tier: 'uint',
        week3Tier: 'uint',
        week4Tier: 'uint',
        nonce: 'bytes',
      },
    },
    {
      week1Tier,
      week2Tier,
      week3Tier,
      week4Tier,
      nonce,
    }
  );
};

const createSignatureForMintLootbox = (account: any, tiers: any, nonce: any) => {
  const encodedRequest = encodeRequestForMintLootbox(tiers[0], tiers[1], tiers[2], tiers[3], nonce);
  
  const hash = ethers.utils.solidityKeccak256(
    ['address', 'address', 'bytes'],
    [Constants.LOOTBOX_CONTRACT_ADDRESS, account, encodedRequest]
  );
  const signerkey: string = process.env.SIGNER_PK ? process.env.SIGNER_PK : "";
  const web3Account = web3.eth.accounts.privateKeyToAccount(signerkey);
  return {
    signature: web3Account.sign(hash).signature,
    encodedRequest,
  };
}

export {
  createSignature,
  createSignatureForMintLootbox
};
