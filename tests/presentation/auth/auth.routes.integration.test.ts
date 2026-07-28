import '../../mocks/email-sender.mock'
import request from 'supertest'
import { testServer } from "../../test-server";
import { prisma } from '../../../src/data/prisma';
import { mockSendEmail } from '../../mocks/email-sender.mock';
import { envs } from '../../../src/config/envs';

describe('auth.routes', () => {

    beforeAll(() => {
        testServer.start();
    })

    afterAll(async () => {
        testServer.close();
        await prisma.$disconnect();
    })

    afterEach(async () => {
        await prisma.user.deleteMany();
    })

    describe('POST /api/auth/register', () => {

        it('should register a new user successfully', async () => {

            const newUserData = {
                name: "Test User",
                email: "test@testting.com",
                password: "Password123"
            }

            const { body } = await request(testServer.app)
                .post('/api/auth/register')
                .send({
                    name: newUserData.name,
                    email: newUserData.email,
                    password: newUserData.password
                })
                .expect(201)

            expect(body).toEqual({
                user: {
                    id: expect.any(String),
                    name: newUserData.name,
                    email: newUserData.email,
                    roles: ['USER'],
                    isEmailValidated: false,
                    isActive: true
                },
                message: 'A verification email has been sent to your email address'
            })

            expect(mockSendEmail).toHaveBeenCalledTimes(1);
            expect(mockSendEmail).toHaveBeenCalledWith({
                from: envs.EMAIL_ADDRESS,
                subject: "Validate your email",
                to: newUserData.email,
                html: expect.stringContaining(`${envs.FRONTEND_BASE_URL}/auth/validate-email`)
            });
        })

        it('should return 400 if email is already in use', async () => {

            const newUserData = {
                name: "Test User",
                email: "test@testting.com",
                password: "Password123"
            }

            await prisma.user.create({
                data: {
                    name: "testing",
                    email: newUserData.email,
                    password: 'Password122'
                }
            })

            const { body } = await request(testServer.app)
                .post('/api/auth/register')
                .send({
                    name: newUserData.name,
                    email: newUserData.email,
                    password: newUserData.password
                })
                .expect(400)

            expect(body).toEqual({ code: 400, message: 'User email already registered' })
            expect(mockSendEmail).not.toHaveBeenCalled();
        })

        it('should return 400 when required fields are missing', async () => {

            const newUserData = {
                name: "Test User",
                password: "Password123"
            }

            const { body } = await request(testServer.app)
                .post('/api/auth/register')
                .send({
                    name: newUserData.name,
                    password: newUserData.password
                })
                .expect(400)
            const userCount = await prisma.user.count();

            expect(body).toEqual({
                statusCode: 400,
                message: 'Bad Request',
                errors: { email: ['email must be a string', 'email must be an email'] }
            })
            expect(userCount).toBe(0)
            expect(mockSendEmail).not.toHaveBeenCalled();
        })
    })
})