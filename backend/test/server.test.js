const request = require('supertest');
let app, server;

describe('Server API Tests', () => {
  beforeAll(() => {
    const serverInstance = require('../index');
    app = serverInstance.app;
    server = serverInstance.server;
  });

  afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
  });

  describe('GET /', () => {
    it('should respond with "Express app is running"', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Express app is running');
    });
  });

  describe('POST /addprogram', () => {
    it('should add a new program', async () => {
      const newProgram = {
        name: 'Test Program',
        image: 'test-image.jpg',
        description: 'Test description',
        participants: 10,
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      };

      const response = await request(app)
        .post('/addprogram')
        .send(newProgram);

      expect(response.statusCode).toBe(200);
    }, 10000);
  });

  describe('GET /allprograms', () => {
    it('should fetch all programs', async () => {
      const response = await request(app).get('/allprograms');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /signup', () => {
    it('should register a new user', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      };


      const response = await request(app)
        .post('/signup')
        .send(newUser);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /login', () => {
    it('should log in a user', async () => {
      const user = {
        email: 'johndoe@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/login')
        .send(user);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /updateprofile', () => {
    it('should update user profile', async () => {
      const updateData = {
        email: 'johndoe@example.com',
        firstName: 'JohnUpdated',
        lastName: 'DoeUpdated',
        password: 'newpassword123'
      };

      const response = await request(app)
        .post('/updateprofile')
        .send(updateData);

      expect(response.statusCode).toBe(200);
    });
  });


  describe('POST /addapplication', () => {
    it('should add a new application form', async () => {
      const newApplication = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        phone: '1234567890',
        university: 'Test University',
        program: 'Test Program',
        motivationLetter: 'Motivation letter content',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'Pending'
      };

      const response = await request(app)
        .post('/addapplication')
        .send(newApplication);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('GET /allapplications', () => {
    it('should fetch all application forms', async () => {
      const response = await request(app).get('/allapplications');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /removeapplication', () => {
    it('should remove an application form', async () => {
      const response = await request(app)
        .post('/removeapplication')
        .send({ id: 1 });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /removeprogram', () => {
    it('should remove a program', async () => {
      const response = await request(app)
        .post('/removeprogram')
        .send({ id: 1 });

      expect(response.statusCode).toBe(200);
    });
  });
});  