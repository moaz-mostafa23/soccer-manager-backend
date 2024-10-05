import { UserTable } from '../db/schema';
import db from '../config/drizzle.config';
import BaseRepository from './BaseRepositories';
import { User } from '../interfaces';


class UserRepository extends BaseRepository<typeof UserTable, User> {
    constructor() {
        super(UserTable, db);
    }

    async findByEmail(email: string): Promise<User | null> {
        const users = await this.find({ email });
        return users[0] || null;
    }

    async userExists(email: string): Promise<boolean> {
        const users = await this.find({ email });
        return users.length > 0;
    }
}

export default new UserRepository();
