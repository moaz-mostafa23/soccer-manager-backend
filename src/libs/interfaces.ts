export interface UserInput {
    email: string;
    password: string;
}

export interface User {
    id: number;
    email: string;
    password: string;
    isVerified: boolean;
}

export interface RegisteredUser extends User {
    token: string;
}