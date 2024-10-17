import { Request, Response, NextFunction } from 'express';
import PlayerService from './playerService';


export const getPlayersByTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { teamId } = req.params;
        const players = await PlayerService.getPlayersByTeam(teamId);
        res.status(200).json(players);
    } catch (error) {
        next(error);
    }
};

export const placePlayerOnTransferList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { playerId, askingPrice } = req.body;
        const player = await PlayerService.placePlayerOnTransferList(playerId, askingPrice);
        res.status(200).json(player);
    } catch (error) {
        next(error);
    }
};

export const transferPlayer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { playerId, newTeamId, askingPrice } = req.body;
        const result = await PlayerService.transferPlayer(playerId, newTeamId, askingPrice);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getPlayerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { playerId } = req.params;
        const player = await PlayerService.getPlayer(playerId);
        res.status(200).json(player);
    } catch (error) {
        next(error);
    }
};
