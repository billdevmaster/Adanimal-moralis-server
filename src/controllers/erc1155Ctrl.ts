import { ERC1155NFTMetadata } from '../models/ERC1155NFTMetadata';

const getErc1155Nfts = async (req: any, res: any) => { 
  try { 
    const { sort, sortDir, owner, nftAddress } = req.body;
    const pipeline: any = [];
    if (owner) {
			let match: any = {};
			match = { owner };
			pipeline.splice(0, 0, { "$match": match });
    }
    if (nftAddress != undefined) {
			let match: any = {};
			match = { nftAddress };
			pipeline.splice(0, 0, { "$match": match });
    }

    if (sort != undefined) {
			pipeline.push({ "$sort": { sort: sortDir } });
		}
    
    const retData = await ERC1155NFTMetadata.aggregate(pipeline);

    return res.status(200).json({ status: "success", data: retData });
  } catch (e) {
    console.log(e)
		return res.status(400).json({status: "failed"})
  }
}

export default {
	getErc1155Nfts
}