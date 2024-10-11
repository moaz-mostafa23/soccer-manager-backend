import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

class TokenService {
    generateToken(): string {
        return crypto.randomBytes(32).toString('hex'); //TODO: make it expire aftre some time
    }

    generateJwtToken(id: string) {
        jwt.sign({ user: { id } }, process.env.JWT_SECRET!, {
            expiresIn: '60d',
        });
    }

    verifyToken(token: string): boolean {
        return !!token; //TODO: Implement token verification
    }
}

export default new TokenService();
