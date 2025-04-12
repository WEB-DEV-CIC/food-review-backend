const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Admin Route Protection', () => {
    let server;
    let adminToken;
    let userToken;

    beforeAll(async () => {
        // Start the server on a different port for testing
        server = app.listen(5001);

        // Create admin user
        const admin = new User({
            name: 'Test Admin',
            email: 'testadmin@example.com',
            password: 'admin123',
            role: 'admin'
        });
        await admin.save();

        // Create regular user
        const user = new User({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'user123',
            role: 'user'
        });
        await user.save();

        // Login as admin
        const adminRes = await request(server)
            .post('/api/v1/auth/login')
            .send({
                email: 'testadmin@example.com',
                password: 'admin123'
            });
        adminToken = adminRes.body.token;

        // Login as regular user
        const userRes = await request(server)
            .post('/api/v1/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'user123'
            });
        userToken = userRes.body.token;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
        await server.close();
    });

    test('Admin can access admin routes', async () => {
        const res = await request(server)
            .get('/api/v1/admin/foods')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(res.statusCode).toBe(200);
    });

    test('Regular user cannot access admin routes', async () => {
        const res = await request(server)
            .get('/api/v1/admin/foods')
            .set('Authorization', `Bearer ${userToken}`);
        
        expect(res.statusCode).toBe(403);
    });

    test('Unauthenticated user cannot access admin routes', async () => {
        const res = await request(server)
            .get('/api/v1/admin/foods');
        
        expect(res.statusCode).toBe(401);
    });
}); 