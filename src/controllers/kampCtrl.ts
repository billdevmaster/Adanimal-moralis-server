import { KampNFTMetadata } from '../models/KampNFTMetadata';

const getKampNfts = async (req: any, res: any) => { 
  try {
    const { skip, limit, sort, sortDir, owner, tokenId } = req.body;
    const pipeline: any = [];
    if (owner) {
			let match: any = {};
			match = { owner };
			pipeline.splice(0, 0, { "$match": match });
		}
		if (tokenId) {
			let match: any = {};
			match = { tokenId };
			pipeline.splice(0, 0, { "$match": match });
		}
    pipeline.push({ $count: 'totalCount' });
    let totalCount = await KampNFTMetadata.aggregate(pipeline);
		if (totalCount.length == 0) {
			totalCount = [{totalCount: 0}];
    }
    
    pipeline.splice(pipeline.length - 1, 1);
		if (sort != undefined) {
			const sortOption: any = {}
      sortOption[sort] = sortDir;
			pipeline.push({ "$sort": sortOption });
		}
		if (skip != undefined) {
			pipeline.push({ "$skip": skip });
		}
		if (limit != undefined) {
			pipeline.push({ "$limit": limit });
		}
    const retData = await KampNFTMetadata.aggregate(pipeline);

    return res.status(200).json({status: "success", data: retData, totalCount})
  } catch (e) {
    console.log(e)
		return res.status(400).json({status: "failed"})
  }
}

export default {
	getKampNfts,
}