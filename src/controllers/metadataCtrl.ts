import { KampNFTMetadata } from "../models/KampNFTMetadata";

const updateCharacter = async (req: any, res: any) => {
  try {
    /// const { key, value } = req.body;
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
  updateCharacter,
  updateKamp
};