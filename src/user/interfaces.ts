import { User } from "../libs/db/schema";
import { BaseRepository } from "../libs/repositories/BaseRepository";

export interface UserInput {
    email: string;
    password: string;
}

export interface IUserRepository extends BaseRepository<User> {
    findByEmail(email: string): Promise<User | null>;
}
