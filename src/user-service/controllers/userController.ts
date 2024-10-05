import bcrypt from 'bcryptjs';
import { BadRequest, UnprocessableEntity } from 'http-errors';
import { UserInput, RegisteredUser, User } from '../../libs/interfaces';
import { generateToken } from '../utils';
import UserRepository from '../../libs/repositories/UserRepository';

export const registerUser = async (input: UserInput): Promise<RegisteredUser> => {
    const { email, password } = input;

    if (!email || !password) {
        throw new BadRequest('Please provide email and password');
    }

    const userEmail = email.trim();
    const userPassword = password.trim();


    await checkUserExistence(userEmail);


    const hashedPassword = await bcrypt.hash(userPassword, 10);


    const newUser = await UserRepository.create({
        email: userEmail,
        password: hashedPassword,
    });

    const token = generateToken(newUser.id);

    return {
        ...newUser,
        token,
    };
};

export const checkUserExistence = async (email: string) => {
    const userExists = await UserRepository.userExists(email);

    if (userExists) {
        throw new UnprocessableEntity('User already exists');
    }
};

export const loginUser = async (input: UserInput) => {
    const { email, password } = input;

    if (!email || !password) {
        throw new BadRequest('Please provide email and password');
    }

    const userEmail = email.trim();
    const userPassword = password.trim();

    const user = await UserRepository.findByEmail(userEmail);

    if (!user) {
        throw new BadRequest('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(userPassword, user.password);
    if (!isMatch) {
        throw new BadRequest('Invalid credentials');
    }

    return {
        email: user.email,
        token: generateToken(user.id),
    };
};
