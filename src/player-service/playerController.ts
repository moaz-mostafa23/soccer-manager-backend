import { Request, Response, NextFunction } from 'express';
import PlayerService from './playerService';

export const getPlayersByTeam = async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    const players = await PlayerService.getPlayersByTeam(teamId);
    res.status(200).json(players);
};

export const transferPlayer = async (req: Request, res: Response, next: NextFunction) => {
    const { playerId, newTeamId, askingPrice } = req.body;
    const result = await PlayerService.transferPlayer(playerId, newTeamId, askingPrice);
    res.status(200).json(result);
};

export const getPlayerById = async (req: Request, res: Response, next: NextFunction) => {
    const { playerId } = req.params;
    const player = await PlayerService.getPlayer(playerId);
    res.status(200).json(player);
};
