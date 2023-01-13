import { KampNFTMetadata } from "../models/KampNFTMetadata";
import { NKMainNFTMetadata } from "../models/NKMainNFTMetadata";

const setCharacter = async (req: any, res: any) => {
  try {
    const { metadata }: any = req.body;
    let tokenId: string;
    await Promise.all(Object.keys(metadata).map(async (key: any) => {
      tokenId = key;

      const txQuery = { tokenId };
      const txUpdate: any = {
        $set: {
          name: metadata[key].name,
          description: metadata[key].description,
          externalUrl: metadata[key].external_url,
          image: metadata[key].image,
          rarity: metadata[key].rarity,
          rarityValue: metadata[key].rarityValue,
          tokenId,
          horn: '',
          eyes: '',
          hair: '',
          wings: '',
          tail: '',
          mouth: '',
          body: '',
        }
      };
      await Promise.all(metadata[key].attributes.map(async (trait: any) => {
        txUpdate["$set"][trait.trait_type] = trait.value;
      }));
      await NKMainNFTMetadata.updateOne(txQuery, txUpdate, {upsert: true});
    }));
    return res.status(200).json({ status: "success" });
  } catch (e) {
    console.log(e)
    return res.status(400).json({ status: "failed" });
  }
}

const updateCharacter = async (req: any, res: any) => {
  try {
    const { tokenId, key, value } = req.body;
    const character: any = await NKMainNFTMetadata.findOne({ tokenId });
    character[key] = value;
    await character.save();
    return res.status(200).json({ status: "success" });
  } catch (e) {
    console.log(e)
    return res.status(400).json({ status: "failed" });
  }
}

const updateKamp = async (req: any, res: any) => {
  let status = "failed";
  try {
    const { tokenId, key, value } = req.body;
    const kampNft: any = await KampNFTMetadata.findOne({ tokenId });
    if (kampNft) {
      kampNft[key] = value;
      await kampNft.save();
      status = "success"
    }
    return res.status(200).json({ status });
  } catch (e) {
    console.log(e)
    return res.status(400).json({ status: "failed" });
  }
}

export default {
  setCharacter,
  updateCharacter,
  updateKamp
};