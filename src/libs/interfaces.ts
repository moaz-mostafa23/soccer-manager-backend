import { User } from "./db/schema";

export interface UserInput {
    email: string;
    password: string;
}

export interface RegisteredUser extends User {
    token: string;
}


export interface QueryCriteria {
    limit?: number;
    offset?: number;
}

export interface Entity<ID> {
    id: ID;
}
