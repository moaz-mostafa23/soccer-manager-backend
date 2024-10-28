import { Player, Team, User, TransferListing } from "../db/schema";
import { BaseRepository } from "../repositories/BaseRepository";

export interface QueryCriteria {
    limit?: number;
    offset?: number;
}
export interface IUserRepository extends BaseRepository<User> {
    findByEmail(email: string): Promise<User | null>;
}

export interface ITeamRepository extends BaseRepository<Team> {
    findByUserId(userId: string): Promise<Team | null>;
}

export interface IPlayerRepository extends BaseRepository<Player> {
    getPlayersByTeamId(teamId: string): Promise<Player[] | null>;
    transferPlayer(playerId: string, newTeamId: string, newMarketValue: number): Promise<void>;
    batchCreatePlayers(playersData: any[]): Promise<Player[]>;
}

export interface ITransferRepository extends BaseRepository<TransferListing> {
    // findByUserId(userId: string): Promise<TransferListing | null>;
}


