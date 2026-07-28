export const mockSendEmail = jest.fn().mockResolvedValue(true);

jest.mock('../../src/infrastructure/common/gateways/nodemailer-email-sender-impl.gateway', () => {
    return {
        NodemailerEmailSenderImpl: jest.fn().mockImplementation(() => {
            return {
                sendEmail: mockSendEmail,
            };
        }),
    };
});