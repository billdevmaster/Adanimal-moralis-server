import { Router } from 'express';
import streamCtrl from '../controllers/streamCtrl';

export const streamRoute = Router();

streamRoute.post("/erc721NFTTransfer", streamCtrl.ERC721NftTransferCtrl);
streamRoute.post("/styleKampNFTWithERC1155", streamCtrl.styleKampNFTWithERC1155);
streamRoute.post("/marketplaceItemListed", streamCtrl.marketplaceItemListed);
streamRoute.post("/erc1155NFTTransfer", streamCtrl.erc1155NFTTransfer);
