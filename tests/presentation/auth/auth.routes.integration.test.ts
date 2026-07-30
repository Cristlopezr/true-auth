import '../../mocks/email-sender.mock'
import request from 'supertest'
import { testServer } from "../../test-server";
import { prisma } from '../../../src/data/prisma';
import { mockSendEmail } from '../../mocks/email-sender.mock';
import { envs } from '../../../src/config/envs';
import { BcryptEncrypterImpl } from '../../../src/infrastructure/auth/adapters/bcrypt-encrypter-impl.gateway';
import { CONSTANTS } from '../../../src/config/constants';

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

        it('Should register a new user successfully', async () => {

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

        it('Should return 400 if email is already in use', async () => {

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

        it('Should return 400 when required fields are missing', async () => {

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
                errors: { email: expect.any(Array) }
            })
            expect(userCount).toBe(0)
            expect(mockSendEmail).not.toHaveBeenCalled();
        })
    })

    describe('POST /api/auth/login', () => {

        it('Should login a user successfully', async () => {

            const user = {
                name: "Test",
                password: "Password123",
                email: "test@user.com"
            }

            const encrypter = new BcryptEncrypterImpl();
            const hashedPassword = await encrypter.hashPassword(user.password, CONSTANTS.SALT_ROUNDS);

            const createdUser = await prisma.user.create({
                data: {
                    name: user.name,
                    password: hashedPassword,
                    email: user.email
                }
            })

            const res = await request(testServer.app)
                .post('/api/auth/login')
                .send({
                    password: user.password,
                    email: user.email
                })
                .expect(200)


            const session = await prisma.session.findFirst({
                where: {
                    userId: createdUser.id
                }
            })
            expect(session).not.toBeNull();
            expect(session?.isRevoked).toBe(false)

            const cookies = res.get('Set-Cookie');
            expect(cookies).toBeDefined()
            expect(cookies?.[0]).toContain('sessionId')

            expect(res.body).toEqual({
                user: {
                    id: expect.any(String),
                    name: user.name,
                    email: user.email,
                    roles: ['USER'],
                    isEmailValidated: false,
                    isActive: true
                },
                accessToken: expect.any(String)
            })
        })

        it('Should return 401 invalid credentials if user is not found', async () => {

            const res = await request(testServer.app)
                .post('/api/auth/login')
                .send({
                    email: "testingnotfound@test.com",
                    password: "Password123"
                }).expect(401)

            const sessions = await prisma.session.count();
            expect(res.body).toEqual({ code: 401, message: 'Invalid credentials' });
            expect(sessions).toBe(0)
            const cookies = res.get('Set-Cookie');
            expect(cookies).toBeUndefined();
        })

        it('Should return 400 when required field is missing', async () => {
            const { body } = await request(testServer.app)
                .post('/api/auth/login')
                .send({
                    email: "test@test.com"
                })
                .expect(400)

            expect(body).toEqual({
                statusCode: 400,
                message: 'Bad Request',
                errors: {
                    password: expect.any(Array)
                }
            })
        })

    })
})