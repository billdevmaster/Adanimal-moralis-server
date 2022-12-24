
import { StyleKampEvent } from '../models/StylekampEvent';
import { StyleKampNutritionHistory } from '../models/StyleKampNutritionHistory'

const setStartTime = async (req: any, res: any) => {
  const { startTime } = req.body;
  try {
    let styleKampEvent = await StyleKampEvent.findOne();
    if (!styleKampEvent) {
      styleKampEvent = new StyleKampEvent();
    }
    styleKampEvent.startTime = new Date(startTime);
    await styleKampEvent.save();
    res.json({status: "success"});
  } catch (e) {
    console.log(e)
    res.json({status: "fail"});
  }
}

const getStartTime = async (req: any, res: any) => {
  try {
    const styleKampEvent = await StyleKampEvent.findOne();
    if (styleKampEvent) {
      res.json({status: "success", startTime: styleKampEvent.startTime});
    } else {
      res.json({status: "success", startTime: null});
    }
  } catch (e) {
    console.log(e)
    res.json({status: "fail"});
  }
}

const getTotalKampNftCount = async (req: any, res: any) => {
  try {
    const { dateRange } = req.body;
    const pipeline: any = [
      {
        $group: {
          _id: {"kampNftId": "$kampNftId"},
          kamps: { "$addToSet": "$kampNftId" }
        }
      },
      {
        $unwind: "$kamps"
      },
      {
        $group: {
          _id: {},
          totalCount: { "$sum" : 1 }
        }
      }
    ];
    if (dateRange && dateRange.length == 2) {
      let match = {};
      const from = new Date(dateRange[0]);
      const to = new Date(dateRange[1]);
      match = {
        updatedAt: {"$gte": from, "$lt": to}
      }
      pipeline.splice(0, 0, {
        $match: match
      });
    }
    if (dateRange && dateRange.length == 1) {
      let match = {};
      const from = new Date(dateRange[0]);
      match = {
        updatedAt: {"$gte": from}
      }
      
      pipeline.splice(0, 0, {
        $match: match
      });
    }
    const retData = await StyleKampNutritionHistory.aggregate(pipeline);
    const totalCount = retData.length > 0 ? retData[0].totalCount : 0;
    return res.status(200).json({ status: "success", totalCount });
  } catch (e) {
    console.log(e)
		return res.status(400).json({status: "failed"})
  }
}

const getKampScore = async (req: any, res: any) => {
  try {
    const { kampId, dateRange } = req.body;
    const pipeline: any = [
      {
        $match: {
          kampNftId: kampId
        }
      },
      {
        $group: {
          _id: "$kampNftId",
          score: {"$sum": "$nutritionScore"}
        }
      }
    ];
    if (dateRange && dateRange.length == 2) {
      let match = {};
      const from = new Date(dateRange[0]);
      const to = new Date(dateRange[1]);
      match = {
        updatedAt: {"$gte": from, "$lt": to}
      }
      
      pipeline.splice(0, 0, {
        $match: match
      });
    }
    if (dateRange && dateRange.length == 1) {
      let match = {};
      const from = new Date(dateRange[0]);
      match = {
        updatedAt: {"$gte": from}
      }
      
      pipeline.splice(0, 0, {
        $match: match
      });
    }
    const retData = await StyleKampNutritionHistory.aggregate(pipeline);
    let score = 0;
    if (retData.length > 0) {
      score = retData[0].score;
    }
    return res.status(200).json({status: "success", score})
  } catch (e) {
    console.log(e)
		return res.status(400).json({status: "failed"})
  }
}

const getKampRank = async (req: any, res: any) => { 
  try { 
    const { dateRange, kampId } = req.body;
    const pipeline: any = [
      {
        $group: {
          _id: {"kampNftId": "$kampNftId"},
          kampId: {"$first": "$kampNftId"},
          score: {"$sum": "$nutritionScore"}
        }
      },
      {
        $sort: {
          score: -1
        }
      },
      {
        $group: {
          _id: {},
          arr: {
            $push: {
              tokenId: "$kampId",
              score: "$score"
            }
          }
        }
      },
      {
        $unwind: {
          "path": "$arr",
          "includeArrayIndex": "ranking"
        }
      },
      { $match: {"arr.tokenId": kampId}}
    ];
    if (dateRange && dateRange.length == 2) {
      let match = {};
      const from = new Date(dateRange[0]);
      const to = new Date(dateRange[1]);
      match = {
        updatedAt: {"$gte": from, "$lt": to}
      }
      
      pipeline.splice(0, 0, {
        $match: match
      });
    }
    if (dateRange && dateRange.length == 1) {
      let match = {};
      const from = new Date(dateRange[0]);
      match = {
        updatedAt: {"$gte": from}
      }
      
      pipeline.splice(0, 0, {
        $match: match
      });
    }
    const retData = await StyleKampNutritionHistory.aggregate(pipeline);
    const rank = retData.length > 0 ? retData[0].ranking + 1 : 0;
    return res.status(200).json({ status: "success", rank });
  } catch (e) {
    console.log(e)
		return res.status(400).json({status: "failed"})
  }
}

const getKampRankList = async (req: any, res: any) => { 
  try {
    const { limit, skip, dateRange, keyword } = req.body;
    const pipeline: any = [
        {
          $lookup: {
            from: "kampnftmetadatas",
            let: { kampNftId: "$kampNftId" },
            pipeline: [
              {
                $match: {
                  $expr:
                    { $and:
                      [
                        { $eq: ["$$kampNftId", "$tokenId" ] },
                      ]
                    }
                    
                }
              },
              {
                $project: {
                  "owner": 1,
                  "image": 1,
                }
              },
            ],
            as: 'kampNft'
          }
        },
        {
          $unwind: "$kampNft"
        },
        { $addFields: {ownerAddress: {$toLower: "$kampNft.owner"}}},
        {
          $lookup: {
            from: '_User',
            let: { "owner": "$ownerAddress" },
            pipeline: [
              {
                $match: {
                  $expr:
                    { $and:
                        [
                        { $eq: ["$$owner", "$ethAddress" ] },
                        ]
                      }
                    
                }
              },
              {
                $project: {
                    "ethAddress": 1,
                    "username": 1,
                    "avatar": 1
                }
              },
            ],
            as: 'user'
          }
        },
        {$unwind: {
            "path": "$user",
            "preserveNullAndEmptyArrays": true
        }},
        {
          $group: {
            _id: {kampNftId: "$kampNftId"},
            score: {"$sum": "$nutritionScore"},
            kampNft: {"$first": "$kampNft"},
            user: {"$first": "$user"},
          }
        },
        {$sort: {score: -1, updateAt: -1}},
        {$skip: skip},
        {$limit: limit},
    ]

    if (dateRange.length == 2) {
      let match = {};
      const from = new Date(dateRange[0]);
      const to = new Date(dateRange[1]);
      match = {
        updatedAt: {"$gte": from, "$lt": to}
      }
      
      pipeline.splice(0, 0, {
        $match: match
      });
    }

    if (dateRange.length == 1) {
      let match = {};
      const from = new Date(dateRange[0]);
      match = {
        updatedAt: {"$gte": from}
      }
      
      pipeline.splice(0, 0, {
        $match: match
      });
    }

    if (keyword != '') {
      const match: any = {};
      if (keyword != '') {
          match["$or"] = [
              {"user.username": {$regex: keyword}},
              {"owner": {$regex: keyword}},
          ]
      }
      if (dateRange.length == 2) {
        pipeline.splice(7, 0, {
          $match: match
        });
      } else {
        pipeline.splice(6, 0, {
          $match: match
        });
      }
    }
    const retData = await StyleKampNutritionHistory.aggregate(pipeline);
    return res.status(200).json({ status: "success", data: retData });
  } catch (e) {
    console.log(e)
		return res.status(400).json({status: "failed"})
  }   
}

export default {
  setStartTime,
  getStartTime,
  getTotalKampNftCount,
  getKampScore,
  getKampRank,
  getKampRankList
};