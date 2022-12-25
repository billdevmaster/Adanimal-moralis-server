import { ERC1155NFTMetadata } from '../models/ERC1155NFTMetadata';

const getErc1155Nfts = async (req: any, res: any) => { 
  try { 
    const { sort, sortDir, owner, nftAddress } = req.body;
    const pipeline: any = [
      {
        $lookup: {
          from: "erc1155nfttransfers",
          let: { owner: "$owner", nftAddress: "$nftAddress", tokenId: "$tokenId" },
          pipeline: [
            {
              $match: {
                $expr:
                  { $and:
                    [
                      { $eq: ["$$owner", "$from" ] },
                      { $eq: ["$$nftAddress", "$nftAddress" ] },
                      { $eq: ["$$tokenId", "$tokenId" ] },
                    ]
                  }
              }
            },
            {
              $group: {
                _id: {},
                amount: {$sum: "$amount"}
              }
            }
          ],
          as: "sendAmount"
        },
      },
      {
        $unwind: {
          "path": "$sendAmount",
          "preserveNullAndEmptyArrays": true
        }
      },
      {
        $lookup: {
          from: "erc1155nfttransfers",
          let: { owner: "$owner", nftAddress: "$nftAddress", tokenId: "$tokenId" },
          pipeline: [
            {
              $match: {
                $expr:
                  { $and:
                    [
                      { $eq: ["$$owner", "$to" ] },
                      { $eq: ["$$nftAddress", "$nftAddress" ] },
                      { $eq: ["$$tokenId", "$tokenId" ] },
                    ]
                  }
              }
            },
            {
              $group: {
                _id: {},
                amount: {$sum: "$amount"}
              }
            }
          ],
          as: "receiveAmount"
        },
      },
      {
        $unwind: {
          "path": "$receiveAmount",
          "preserveNullAndEmptyArrays": true
        }
      },
      {
        $addFields: {
          amount: {
            $cond: [
              { $ifNull: ["$sendAmount.amount", false] },
              { $subtract: ["$receiveAmount.amount", "$sendAmount.amount"] },
              "$receiveAmount.amount"
            ]
          }
        }
      }
    ];
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
      const sortOption: any = {}
      sortOption[sort] = sortDir;
			pipeline.push({ "$sort": sortOption });
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