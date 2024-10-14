import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

class TokenService {
    generateToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    generateJwtToken(id: string) {
        return jwt.sign({ user: { id } }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });
    }
}

export default new TokenService();
