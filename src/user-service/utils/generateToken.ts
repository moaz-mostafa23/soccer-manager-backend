import * as jwt from 'jsonwebtoken';

const generateToken = (id: number): string =>
    jwt.sign({ user: { id } }, process.env.JWT_SECRET!, {
        expiresIn: '60d',
    });

export default generateToken;
