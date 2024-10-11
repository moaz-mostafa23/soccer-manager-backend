import nodemailer from 'nodemailer';
import UserRepository from './UserRepository';
import { BadRequest } from 'http-errors';


class EmailService {
    constructor(
        private userRepository = UserRepository
    ) { }

    async sendVerificationEmail(email: string, token: string) {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verificationUrl = `123/verify-email?token=${token}`;
        await transporter.sendMail({
            from: '"Fantasy Football App" <no-reply@fantasyapp.com>',
            to: email,
            subject: 'Verify your email',
            text: `Please verify your email by clicking on this link: ${verificationUrl}`,
        });
    }
}

export default new EmailService();