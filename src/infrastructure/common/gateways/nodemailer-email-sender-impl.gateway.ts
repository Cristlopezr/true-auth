import { EmailOptions, EmailSender } from "../../../domain/common/gateways/email-sender";
import nodemailer from 'nodemailer'

export class NodemailerEmailSenderImpl implements EmailSender {

    private transporter;

    constructor(private readonly user: string, private readonly pass: string) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass
            }
        })
    }

    sendEmail = async (options: EmailOptions): Promise<void> => {
        const { to, from, subject, html } = options;
        await this.transporter.sendMail({
            to,
            from,
            subject,
            html
        })
    }
}