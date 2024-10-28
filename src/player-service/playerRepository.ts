import { Player, PlayerTable, Team, TeamTable, User, UserTable } from '../libs/db/schema';
import db from '../libs/config/drizzle.config';
import { DrizzleRepository } from '../libs/repositories/DrizzleRepository';
import { IPlayerRepository, ITeamRepository } from '../libs/common/interfaces';

class PlayerRepository extends DrizzleRepository<typeof PlayerTable, Player> implements IPlayerRepository {
    constructor() {
        super(db, PlayerTable, 'id');
    }

    async getPlayersByTeamId(teamId: string): Promise<Player[] | null> {
        const players = await this.list({ team_id: teamId });
        return players;
    }

    async transferPlayer(playerId: string, newTeamId: string, newMarketValue: number) {
        await this.update(playerId, { team_id: newTeamId, market_value: String(newMarketValue) });
    }

    async batchCreatePlayers(playersData: Player[]): Promise<Player[]> {
        const insertedPlayers = await db.insert(PlayerTable)
            .values(playersData)
            .returning();
        return insertedPlayers;
    }
}

export default new PlayerRepository();
