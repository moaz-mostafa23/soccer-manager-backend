import { Request, Response, NextFunction } from 'express';
import { TeamService } from './teamService';

const teamService = new TeamService();

export const generateTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, teamName } = req.body;
        const team = await teamService.createTeamForUser(userId, teamName);
        res.status(201).json(team);
    } catch (error) {
        next(error);
    }
};


// TODO: this is shit fix it
export const getUserTeamWithPlayers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;
        const team = await teamService.getTeamWithPlayers(userId);
        res.status(201).json(team);
    } catch (error) {
        next(error);
    }
};
