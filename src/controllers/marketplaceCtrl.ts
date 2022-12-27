import { MarketplaceListed } from "../models/MarketplaceListed";

const getListedItems = async (req: any, res: any) => { 
  try {
    const { skip, limit, sort, sortDir, seller, nftAddress } = req.body;
    const pipeline: any = [
      {
        $match: {completed: false}
      }
    ]

    if (seller != '') {
			let match: any = {};
			match = { seller };
			pipeline.splice(0, 0, { "$match": match });
    }
    if (nftAddress != '') {
			let match: any = {};
			match = { nftAddress };
			pipeline.splice(0, 0, { "$match": match });
    }
    pipeline.push({ $count: 'totalCount' });
    let totalCount = await MarketplaceListed.aggregate(pipeline);
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
    const retData = await MarketplaceListed.aggregate(pipeline);

    return res.status(200).json({status: "success", data: retData, totalCount})
  } catch (e) {
    console.log(e)
    return res.status(400).json({status: "failed"})
  }
}

const getTotalListedAmount = async (req: any, res: any) => {
  try {
    const { nftAddress, tokenId, seller } = req.body;
    const pipeline: any = [
      {
        $match: {
          nftAddress,
          tokenId,
          seller,
          completed: false
        }
      },
      {
        $lookup: {
          from: "marketplacesales",
          let: { listingId: "$listingId" },
          pipeline: [
            {
              $match: {
                $expr:
                  { $and:
                    [
                      { $eq: ["$$listingId", "$listingId" ] },
                    ]
                  }
                
              }
            },
            {
              $group: {
                "_id": {listingId: "$listingId"},
                "amount": {$sum: {"$toDouble": "$amount"}},
              }
            },
          ],
          as: 'totalSold'
        }
      },
      {$unwind: {
        "path": "$totalSold",
        "preserveNullAndEmptyArrays": true
      }},
      {
        $project: {
          amount: 1,
          totalSold: 1
        }
      },
    ];
    const retData = await MarketplaceListed.aggregate(pipeline);
    return res.status(200).json({ status: "success", data: retData });
  } catch (e) {
    console.log(e)
		return res.status(400).json({status: "failed"})
  }
}

export default {
  getListedItems,
  getTotalListedAmount
}