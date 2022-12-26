import { KampNFTMetadata } from '../models/KampNFTMetadata';
import { User } from '../models/_User';

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

const saveItems = async (req: any, res: any) => {
	try {
		const MAX_ITEMS_SIZE = 288;
		const { kampId, name, description, items } = req.body;
		if (items.length >= MAX_ITEMS_SIZE) {
			res.status(400).json({message: 'Item list too big', result: 'RESULT_ITEMS_LENGTH_NOT_ALLOWED'});
			return;
		}
		const kampNft = await KampNFTMetadata.findOne({ tokenId: kampId });
		if (!kampNft) {
			res.status(404).json({message: 'The Kamp has not been found', result: 'RESULT_KAMP_NOT_FOUND'})
			return;
		}
		kampNft.name = name;
		kampNft.description = description;
		kampNft.items = items;
		await kampNft.save();
		res.status(200).json({message:'', result: '', "kamp": kampNft})
	} catch (e) {
		console.log(e)
		res.status(400).json({ status:'fail', message: 'Something is wrong' })
	}
}

const loadKamp = async (req: any, res: any) => { 
	try { 
		const { address, kampId } = req.body;
		const user = await User.findOne({ethAddress: address});

    if (user === null) {
        res.status(404).json({message: '', result: ''});
    } else {
        const kamp = await KampNFTMetadata.findOne({_id: kampId});
        if (kamp == null) {
            res.status(404).json({message: '', result: ''});
        } else {
            res.status(200).json({message: '', result: '', "kamp": kamp});
        }
    }
	} catch (e) {
		console.log(e)
		res.status(400).json({ status:'fail', message: 'Something is wrong' })
	}
}

// Gets the list of all the user's Kamps
const getKampList = async (req: any, res: any) => { 
	try {
		const { address } = req.body;
	
		const kamps = await KampNFTMetadata.find({owner: address});
		res.status(200).json({message: '', result: '', "kamps": kamps});
	} catch (e) {
		console.log(e)
		res.status(400).json({ status:'fail', message: 'Something is wrong' })
	}
};

export default {
	getKampNfts,
	saveItems,
	loadKamp,
	getKampList
}