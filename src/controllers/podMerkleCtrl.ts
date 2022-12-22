import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'ethers/lib/utils';
import { PodWhiteList } from '../models/PodWhiteList';

const setPodMerkletree = async (req: any, res: any) => {
	const leafNodes = req.body.whitelist.map((addr: any) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
	const merkleRoot = merkleTree.getHexRoot();
	
	await PodWhiteList.deleteMany();
	await Promise.all(leafNodes.map( async (leaf: any, index: any) => {
    const hexProof = merkleTree.getHexProof(leaf);
    
    const whiteList = new PodWhiteList();
    whiteList.address = req.body.whitelist[index];
    whiteList.leaf = leaf;
    whiteList.merkleProof = hexProof;
    await whiteList.save();
  }))

	res.json({ merkleRoot });
}

export default {
	setPodMerkletree
}