import { Team, TeamTable, User, UserTable } from '../libs/db/schema';
import db from '../libs/config/drizzle.config';
import { DrizzleRepository } from '../libs/repositories/DrizzleRepository';
import { ITeamRepository } from '../libs/common/interfaces';

class TeamRepository extends DrizzleRepository<typeof TeamTable, Team> implements ITeamRepository {
    constructor() {
        super(db, TeamTable, 'id');
    }

    async findByUserId(userId: string): Promise<Team | null> {
        const users = await this.list({ user_id: userId }, { limit: 1 });
        return users.length > 0 ? users[0] : null;
    }
}

export default new TeamRepository();
