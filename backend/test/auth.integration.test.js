const chai = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../app');

dotenv.config({ path: '.env.test' }); // load test DB

const expect = chai.expect;

describe('Integration Test - Register Endpoint', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase(); // optional: cleanup
    await mongoose.disconnect();
  });

  it('should return 201 and success message on valid registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@email.com`,
        password: 'Test@1234'
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('msg', 'User registered successfully');
    expect(res.body).to.have.property('user');
  });
});
