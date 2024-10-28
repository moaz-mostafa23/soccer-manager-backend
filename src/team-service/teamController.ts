import { Request, Response, NextFunction } from 'express';
import TeamService from './teamService';


export const generateTeam = async (req: Request, res: Response, next: NextFunction) => {

    const { userId, teamName } = req.body;
    const team = await TeamService.createTeamForUser(userId, teamName);
    res.status(201).json(team);
};


// TODO: this is shit fix it
export const getUserTeamWithPlayers = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    const team = await TeamService.getTeamWithPlayers(userId);
    res.status(201).json(team);
};
