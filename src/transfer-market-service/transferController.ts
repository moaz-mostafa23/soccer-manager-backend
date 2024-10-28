import { Request, Response, NextFunction } from 'express';
import { TransferService } from './transferService';

const transferService = new TransferService();

export const listOnMarket = async (req: Request, res: Response, next: NextFunction) => {
    const { playerId, askingPrice, teamId } = req.body; //TODO use library for validation
    const transferListing = await transferService.listOnMarket(playerId, askingPrice, teamId);
    res.status(201).json(transferListing);
};


export const getTransferList = async (req: Request, res: Response, next: NextFunction) => {
    const { filters } = req.body;
    const transferList = await transferService.getTransferList(filters);
    res.status(200).json(transferList);
}

export const buyPlayer = async (req: Request, res: Response, next: NextFunction) => {
    const { listingId, buyerTeamId } = req.body;
    const result = await transferService.buy(listingId, buyerTeamId);
    res.status(200).json(result);
}

