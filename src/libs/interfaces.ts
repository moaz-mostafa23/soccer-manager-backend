import { User } from "./db/schema";

export interface UserInput {
    email: string;
    password: string;
}

export interface RegisteredUser extends User {
    token: string;
}

export interface IRepository<T, K> {
    create(values: Partial<T>): Promise<K>;
    find(whereClause: Partial<K>): Promise<K[]>;
    findById(id: number): Promise<K | null>;
    update(id: number, values: Partial<K>): Promise<void>;
    delete(id: number): Promise<void>;
}
