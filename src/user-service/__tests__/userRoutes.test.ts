import request from 'supertest';
import app from '../../app';
import UserService from '../userService';

jest.mock('../userService');

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        it('should return 400 if user already exists', async () => {
            const mockUserInput = { email: 'existing@example.com', password: 'Password123' };

            (UserService.registerUser as jest.Mock).mockRejectedValue({
                message: 'User already exists',
                status: 400,
            });

            const response = await request(app)
                .post('/api/users/register')
                .send(mockUserInput)
                .expect(400);

            expect(UserService.registerUser).toHaveBeenCalledWith(mockUserInput);
            expect(response.body.message).toEqual('User already exists');
        });
    });

    describe('POST /login', () => {
        it('should return 400 for invalid credentials', async () => {
            const mockUserInput = { email: 'test@example.com', password: 'wrongPassword' };

            (UserService.loginUser as jest.Mock).mockRejectedValue({
                message: 'Invalid credentials',
                status: 400,
            });

            const response = await request(app)
                .post('/api/users/login')
                .send(mockUserInput)
                .expect(400);

            expect(UserService.loginUser).toHaveBeenCalledWith(mockUserInput);
            expect(response.body.message).toEqual('Invalid credentials');
        });
    });
});
