import { User, UserTable } from '../db/schema';
import db from '../config/drizzle.config';
import { eq } from 'drizzle-orm';
import { BaseRepository } from './BaseRepositories';

class UserRepository extends BaseRepository<typeof UserTable, "id", User> {
    constructor() {
        super(db, UserTable, 'id');
    }

    async findByEmail(email: string): Promise<User | null> {
        const users = await this.list({ email }, 1, 1);
        return users.length > 0 ? users[0] : null;
    }

    async userExists(email: string): Promise<boolean> {
        const user = await this.list({ email }, 1, 1);
        console.log('user', user);
        return user.length > 0;
    }
}

export default new UserRepository();
