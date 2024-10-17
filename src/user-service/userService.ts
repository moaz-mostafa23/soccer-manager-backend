import bcrypt from 'bcryptjs';
import { BadRequest, Conflict, Unauthorized } from 'http-errors';
import { UserInput } from './interfaces';
import UserRepository from './userRepository';
import TokenService from '../libs/common/tokenService';
import EmailService from './emailService';
import crypto from 'crypto';

class UserService {
    constructor(
        private userRepository = UserRepository,
        private tokenService = TokenService,
        private emailService = EmailService,
    ) { }

    async registerUser(input: UserInput) {
        const { email, password } = input;

        const userEmail = email.trim();

        await this.checkUserExistence(userEmail);

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h

        const newUser = await this.userRepository.create({
            email: userEmail,
            password: hashedPassword,
            verification_token: verificationToken,
            verification_token_expires: verificationTokenExpires,
        });

        await this.emailService.sendVerificationEmail(userEmail, verificationToken);

        return {
            user: newUser,
            token: this.tokenService.generateJwtToken(newUser.id),
        };
    }

    async verifyEmail(token: string) {
        const users = await this.userRepository.list({ verification_token: token });

        if (!users.length) {
            throw new BadRequest('Invalid token');
        }

        const user = users[0];

        if (user.verification_token_expires && user.verification_token_expires < new Date()) {
            throw new BadRequest('Token has expired');
        }

        await this.userRepository.update(user.id, {
            is_verified: true,
            verification_token: null,
            verification_token_expires: null,
        });


        return { user, token: this.tokenService.generateJwtToken(user.id) };
    }

    async checkUserExistence(email: string) {
        const user = await this.userRepository.findByEmail(email.trim());

        if (user) {
            throw new Conflict('User already exists');
        }
    }

    async loginUser(input: UserInput) {
        const { email, password } = input;

        const user = await this.userRepository.findByEmail(email.trim());
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Unauthorized('Invalid credentials');
        }

        if (!user.is_verified) {
            throw new Unauthorized('Please verify your email before logging in');
        }

        return {
            user: user,
            token: this.tokenService.generateJwtToken(user.id),
        };
    }

}

export default new UserService();
