import { User, UserTable } from '../libs/db/schema';
import db from '../libs/config/drizzle.config';
import { DrizzleRepository } from '../libs/repositories/DrizzleRepository';
import { IUserRepository } from '../libs/common/interfaces';

class UserRepository extends DrizzleRepository<typeof UserTable, User> implements IUserRepository {
    constructor() {
        super(db, UserTable, 'id');
    }

    async findByEmail(email: string): Promise<User | null> {
        const users = await this.list({ email }, { limit: 1 });
        return users.length > 0 ? users[0] : null;
    }
}

export default new UserRepository();
