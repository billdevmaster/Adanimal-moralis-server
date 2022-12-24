import { NKMainNFTMetadata } from '../models/NKMainNFTMetadata';

const getNkMainNfts = async (req: any, res: any) => { 
	try {
		const { skip, limit, sort, sortDir, owner } = req.body;
		const pipeline: any = [
			{
				$lookup: {
					from: "marketplacelisteds",
					let: { nftAddress: "$nftAddress", tokenId: "$tokenId" },
					pipeline: [
						{
							$match: {
								$expr:
									{ $and:
										[
											{ $eq: ["$$tokenId", "$tokenId" ] },
											{ $eq: ["$$nftAddress", "$nftAddress"] },
										]
									}
							}
						},
						{
							$match: {
								"completed": false
							}
						},
						{
							$project: {
								"seller": 1,
								"price": 1,
								"currency": 1,
								"nftType": 1,
								"listingId": 1
							}
						},
					],
					as: 'listedNft'
				}
			},
			{
				$unwind: {
					"path": "$listedNft",
					"preserveNullAndEmptyArrays": true
				}
			},
		];
		if (owner) {
			let match: any = {};
			match = { owner };
			pipeline.splice(0, 0, { "$match": match });
		}
		pipeline.push({ $count: 'totalCount' });
		let totalCount = await NKMainNFTMetadata.aggregate(pipeline);
		if (totalCount.length == 0) {
			totalCount = [{totalCount: 0}];
		}

		pipeline.splice(pipeline.length - 1, 1);
		if (sort != undefined) {
			pipeline.push({ "$sort": { sort: sortDir } });
		}
		if (skip != undefined) {
			pipeline.push({ "$skip": skip });
		}
		if (limit != undefined) {
			pipeline.push({ "$limit": limit });
		}

		const retData = await NKMainNFTMetadata.aggregate(pipeline);

		return res.status(200).json({status: "success", data: retData, totalCount})
	} catch (e) {
		console.log(e)
		return res.status(400).json({status: "failed"})
	}
}

export default {
	getNkMainNfts
}