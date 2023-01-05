import { Router } from 'express';
import streamCtrl from '../controllers/streamCtrl';
import podMerkleCtrl from '../controllers/podMerkleCtrl';
import Erc721Ctrl from '../controllers/erc721Ctrl';
import Erc1155Ctrl from '../controllers/erc1155Ctrl';
import KampCtrl from '../controllers/kampCtrl';
import MarketplaceCtrl from '../controllers/marketplaceCtrl';
import StyleKampCtrl from '../controllers/styleKampCtrl';
import LootboxCtrl from '../controllers/lootboxCtrl';
import MetadataCtrl from '../controllers/metadataCtrl';

export const streamRoute = Router();
streamRoute.post("/erc721NFTTransfer", streamCtrl.ERC721NftTransferCtrl);
streamRoute.post("/styleKampNFTWithERC1155", streamCtrl.styleKampNFTWithERC1155);
streamRoute.post("/marketplaceItemListed", streamCtrl.marketplaceItemListed);
streamRoute.post("/erc1155NFTTransfer", streamCtrl.erc1155NFTTransfer);
streamRoute.post("/claimReward", streamCtrl.claimReward);

export const ApiRoute = Router();
ApiRoute.post("/setPodMerkletree", podMerkleCtrl.setPodMerkletree)
ApiRoute.post("/getPodMerkletree", podMerkleCtrl.getPodMerkletree)

ApiRoute.post("/getNkMainNfts", Erc721Ctrl.getNkMainNfts);
ApiRoute.post("/getCountByTrait", Erc721Ctrl.getCountByTrait);
ApiRoute.post("/getKampNfts", KampCtrl.getKampNfts);
ApiRoute.post("/getErc1155Nfts", Erc1155Ctrl.getErc1155Nfts);
ApiRoute.post("/getListedItems", MarketplaceCtrl.getListedItems);
ApiRoute.post("/getTotalListedAmount", MarketplaceCtrl.getTotalListedAmount);

ApiRoute.post("/styleKamp/setStartTime", StyleKampCtrl.setStartTime);
ApiRoute.get("/styleKamp/getStartTime", StyleKampCtrl.getStartTime);
ApiRoute.post("/styleKamp/getTotalKampNftCount", StyleKampCtrl.getTotalKampNftCount);
ApiRoute.post("/styleKamp/getKampScore", StyleKampCtrl.getKampScore);
ApiRoute.post("/styleKamp/getKampRank", StyleKampCtrl.getKampRank);
ApiRoute.post("/styleKamp/getKampRankList", StyleKampCtrl.getKampRankList);

ApiRoute.post("/lootbox/setLoot", LootboxCtrl.setLoot);
ApiRoute.get("/lootbox/openLootbox", LootboxCtrl.openLootbox);

ApiRoute.get("/metadata/updateCharacter", MetadataCtrl.updateCharacter);

export const GameApiRoute = Router();
GameApiRoute.post("/saveItems", KampCtrl.saveItems);
GameApiRoute.post("/loadKamp", KampCtrl.loadKamp);
GameApiRoute.post("/getKampList", KampCtrl.getKampList);
