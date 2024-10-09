import bcrypt from 'bcryptjs';
import { BadRequest, UnprocessableEntity } from 'http-errors';
import { UserInput, RegisteredUser } from '../libs/interfaces';
import { generateToken } from './utils';
import UserRepository from './UserRepository';

class UserService {
    constructor(private userRepository = UserRepository) { }

    async registerUser(input: UserInput): Promise<RegisteredUser> {
        const { email, password } = input;

        if (!email || !password) {
            throw new BadRequest('Please provide email and password');
        }

        const userEmail = email.trim();
        const userPassword = password.trim();

        await this.checkUserExistence(userEmail);

        const hashedPassword = await bcrypt.hash(userPassword, 10);

        const newUser = await this.userRepository.create({
            email: userEmail,
            password: hashedPassword,
        });

        const token = generateToken(newUser.id);

        return {
            ...newUser,
            token,
        };
    }

    async checkUserExistence(email: string) {
        const userExists = await this.userRepository.userExists(email);

        if (userExists) {
            throw new UnprocessableEntity('User already exists');
        }
    }

    async loginUser(input: UserInput) {
        const { email, password } = input;

        if (!email || !password) {
            throw new BadRequest('Please provide email and password');
        }

        const userEmail = email.trim();
        const userPassword = password.trim();

        const user = await this.userRepository.findByEmail(userEmail);

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
    }
}

export default new UserService();
