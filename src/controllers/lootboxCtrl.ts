import prand from "pure-rand";
import { v4 } from "uuid";
import { ethers } from 'ethers';
import { LootList } from '../models/LootList';
import { createSignature } from '../libs/lib';

const seed = 42;
let rng = prand.mersenne(seed);

const setLoot = async (req: any, res: any) => { 
  try { 
    const { lootList } = req.body;
    await Promise.all(
      lootList.map(async (item: any) => {
        let loot = await LootList.findOne({nftAddress: item.nftAddress, tokenId: item.tokenId, lootboxId: item.lootboxId});
        if (!loot) {
          loot = new LootList();
        }
        loot.nftAddress = item.nftAddress;
        loot.tokenId = item.tokenId;
        loot.lootboxId = item.lootboxId;
        if (item.probability) {
          loot.probability = item.probability;
        }
        if (item.maxAmount) {
          loot.maxAmount = item.maxAmount;
        }
        if (item.isLimited) {
          loot.isLimited = item.isLimited;
        }
        await loot.save();
      })
    )
    return res.status(200).json({ status: "success" });
  } catch (e) {
    console.log(e)
		return res.status(400).json({status: "failed"})
  }
}

const openLootbox = async (req: any, res: any) => {
  try {
    const { account, lootboxId } = req.query;
    let randomNumber;
    const lootList = await LootList.find({isLimited: false, lootboxId});
    const weightedList: any = [];
    for (let i = 0; i < lootList.length; i++) {
      for (let j = 0; j < lootList[i].probability; j++) {
        weightedList.push(i);
      }
    }
    
    [randomNumber, rng] = prand.uniformIntDistribution(0, weightedList.length)(rng);
    
    const nftAddress = lootList[weightedList[randomNumber]].nftAddress;
    const tokenId = lootList[weightedList[randomNumber]].tokenId;
    
    const signature = createSignature(
      account,
      nftAddress,
      tokenId,
      ethers.utils.hashMessage(v4())
    );
    return res.status(200).json({signature, nftAddress, tokenId});
  } catch (e) {
    console.log(e)
		return res.status(400).json({status: "failed"})
  }
}

export default {
  setLoot,
  openLootbox
};