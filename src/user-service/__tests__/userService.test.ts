import UserService from '../userService';
import UserRepository from '../userRepository';
import TokenService from '../../libs/common/tokenService';
import EmailService from '../emailService';
import bcrypt from 'bcryptjs';

jest.mock('../userRepository');
jest.mock('../../libs/common/tokenService');
jest.mock('../emailService');
jest.mock('bcryptjs');

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should register a new user and send verification email', async () => {
            const mockUserInput = { email: 'test@example.com', password: 'Password123' };
            const mockUser = { id: '1', email: 'test@example.com', is_verified: false };

            (UserRepository.userExists as jest.Mock).mockResolvedValue(false);
            (UserRepository.create as jest.Mock).mockResolvedValue(mockUser);
            (TokenService.generateToken as jest.Mock).mockReturnValue('mockVerificationToken');
            (EmailService.sendVerificationEmail as jest.Mock).mockResolvedValue(true);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const result = await UserService.registerUser(mockUserInput);

            expect(UserRepository.userExists).toHaveBeenCalledWith(mockUserInput.email);
            expect(UserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                email: mockUserInput.email,
                password: 'hashedPassword',
            }));
            expect(EmailService.sendVerificationEmail).toHaveBeenCalledWith(
                mockUserInput.email,
                'mockVerificationToken'
            );
            expect(result).toEqual(mockUser);
        });

        it('should throw an error if user already exists', async () => {
            const mockUserInput = { email: 'existing@example.com', password: 'Password123' };

            (UserRepository.userExists as jest.Mock).mockResolvedValue(true);

            await expect(UserService.registerUser(mockUserInput)).rejects.toThrow('User already exists');
        });
    });

    describe('loginUser', () => {
        it('should log in a user and return a token', async () => {
            const mockUserInput = { email: 'test@example.com', password: 'Password123' };
            const mockUser = { id: '1', email: 'test@example.com', password: 'hashedPassword', is_verified: true };

            (UserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (TokenService.generateJwtToken as jest.Mock).mockReturnValue('mockJwtToken');

            const result = await UserService.loginUser(mockUserInput);

            expect(UserRepository.findByEmail).toHaveBeenCalledWith(mockUserInput.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(mockUserInput.password, mockUser.password);
            expect(TokenService.generateJwtToken).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual({
                email: mockUser.email,
                token: 'mockJwtToken',
            });
        });

        it('should throw an error if the user credentials are invalid', async () => {
            const mockUserInput = { email: 'test@example.com', password: 'wrongPassword' };

            (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);

            await expect(UserService.loginUser(mockUserInput)).rejects.toThrow('Invalid credentials');
        });
    });
});
