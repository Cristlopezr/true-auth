export type EmailOptions = {
    from: string;
    to: string;
    subject: string;
    html: string
}


export interface EmailSender {
    sendEmail(options: EmailOptions): Promise<void>
}