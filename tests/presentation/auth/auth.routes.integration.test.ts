import '../../mocks/email-sender.mock'
import request from 'supertest'
import { testServer } from "../../test-server";
import { prisma } from '../../../src/data/prisma';

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

    it('should register a new user successfully', async () => {
        await request(testServer.app)
            .post('/api/auth/register')
            .send({
                name: "Test User",
                email: "test@testting.com",
                password: "Password123"
            })
            .expect(201)
    })
})