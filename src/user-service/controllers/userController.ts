import { UserTable } from '../db/schema';
import bcrypt from 'bcryptjs';
import db from '../config/drizzle.config';
import { eq } from 'drizzle-orm';
import { UnprocessableEntity, BadRequest } from 'http-errors';
import { UserInput, RegisteredUser, User } from '../libs/interfaces';
import { generateToken } from '../utils';

export const registerUser = async (input: UserInput): Promise<RegisteredUser> => {

    const { email, password } = input

    if (!email || !password) {
        throw new BadRequest('Please provide email and password');
    }

    const userEmail = email.trim()
    const userPassword = password.trim()

    await checkUserExistence(userEmail);

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const insertedUsers: User[] = await db
        .insert(UserTable)
        .values({
            email: userEmail,
            password: hashedPassword,
        })
        .returning()

    const user = insertedUsers[0];

    return {
        ...user,
        token: generateToken(user.id),
    }
};

export const checkUserExistence = async (email: string) => {
    const existingUser = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.email, email));

    if (existingUser.length > 0) {
        throw new UnprocessableEntity('User already exists');
    }
}

export const loginUser = async (input: UserInput) => {
    const { email, password } = input;

    if (!email || !password) {
        throw new BadRequest('Please provide email and password');
    }

    const userEmail = email.trim()
    const userPassword = password.trim()

    const users: User[] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.email, userEmail))

    const user = users[0];

    if (user) {
        const isMatch = await bcrypt.compare(userPassword, user.password);

        if (isMatch) {
            return {
                email: user.email,
                token: generateToken(user.id),
            };
        }
    }

    throw new BadRequest('Invalid credentials');
};
