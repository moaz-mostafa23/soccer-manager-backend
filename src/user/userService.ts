import bcrypt from 'bcryptjs';
import { BadRequest, UnprocessableEntity, Unauthorized } from 'http-errors';
import { UserInput } from './interfaces';
import { User } from '../libs/db/schema';
import UserRepository from './UserRepository';
import TokenService from '../libs/common/tokenService';
import EmailService from './emailService';

class UserService {
    constructor(
        private userRepository = UserRepository,
        private tokenService = TokenService,
        private emailService = EmailService,
    ) { }

    async registerUser(input: UserInput): Promise<User> {
        const { email, password } = input;

        if (!email || !password) {
            throw new BadRequest('Please provide email and password');
        }

        const userEmail = email.trim();
        const userPassword = password.trim();

        await this.checkUserExistence(userEmail);

        const hashedPassword = await bcrypt.hash(userPassword, 10);

        const verificationToken = this.tokenService.generateToken();

        const newUser = await this.userRepository.create({
            email: userEmail,
            password: hashedPassword,
            verification_token: verificationToken,
        });

        await this.emailService.sendVerificationEmail(userEmail, verificationToken);

        return newUser;
    }

    async verifyEmail(token: string) {
        const users = await this.userRepository.list({ verification_token: token });

        console.log(users, 'users');

        if (!users.length) {
            throw new BadRequest('Invalid or expired token');
        }

        const user = users[0];

        await this.userRepository.update(user.id, { is_verified: true, verification_token: null });
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
            throw new Unauthorized('Please provide email and password');
        }

        const user = await this.userRepository.findByEmail(email.trim());
        if (!user || !(await bcrypt.compare(password.trim(), user.password))) {
            throw new Unauthorized('Invalid credentials');
        }

        if (!user.is_verified) {
            throw new Unauthorized('Please verify your email before logging in');
        }

        return {
            email: user.email,
            token: this.tokenService.generateJwtToken(user.id),
        };
    }

}

export default new UserService();
