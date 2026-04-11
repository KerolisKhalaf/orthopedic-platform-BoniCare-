import request from 'supertest';
import express from 'express';
import errorHandler from '@/middleware/errorHandler.js';
import AppError from '@/utils/AppError.js';

// Mock Express app for testing
const app = express();
app.use(express.json());

// Test route that throws a 404 AppError
app.get('/test-404', (req, res, next) => {
  next(new AppError('Resource not found', 404));
});

// Test route that throws a 400 AppError with validation errors
app.post('/test-400-validation', (req, res, next) => {
  const errors = [{ field: 'name', message: 'Name is required' }];
  next(new AppError('Validation failed', 400, errors));
});

// Test route that throws a generic 500 error (non-operational)
app.get('/test-500-generic', (req, res, next) => {
  next(new Error('Something unexpected happened'));
});

// Test route that throws a 500 operational error
app.get('/test-500-operational', (req, res, next) => {
  next(new AppError('Database down', 500));
});


// Mount the error handler
app.use(errorHandler);

describe('Error Handler Middleware', () => {
  let originalNodeEnv;

  beforeAll(() => {
    originalNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv; // Reset NODE_ENV after each test
  });

  // Test for 404 Not Found error (Development)
  test('should return a 404 operational error response in development', async () => {
    process.env.NODE_ENV = 'development';
    const res = await request(app).get('/test-404');

    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Resource not found');
    expect(res.body.stack).toBeDefined();
    expect(res.body.errors).toBeNull();
  });

  // Test for 400 Validation error (Development)
  test('should return a 400 operational error with validation errors in development', async () => {
    process.env.NODE_ENV = 'development';
    const res = await request(app).post('/test-400-validation');

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.stack).toBeDefined();
    expect(res.body.errors).toEqual([{ field: 'name', message: 'Name is required' }]);
  });

  // Test for 500 generic error (Development)
  test('should return a 500 generic error response in development', async () => {
    process.env.NODE_ENV = 'development';
    const res = await request(app).get('/test-500-generic');

    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Something unexpected happened'); // Message from generic Error
    expect(res.body.stack).toBeDefined();
    expect(res.body.errors).toBeUndefined(); // Generic errors don't have this
  });

  // Test for 500 operational error (Development)
  test('should return a 500 operational error response in development', async () => {
    process.env.NODE_ENV = 'development';
    const res = await request(app).get('/test-500-operational');

    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Database down');
    expect(res.body.stack).toBeDefined();
    expect(res.body.errors).toBeNull();
  });

  // Test for 404 Not Found error (Production)
  test('should return a 404 operational error response in production without stack', async () => {
    process.env.NODE_ENV = 'production';
    const res = await request(app).get('/test-404');

    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Resource not found');
    expect(res.body.stack).toBeUndefined();
    expect(res.body.errors).toBeNull();
  });

  // Test for 400 Validation error (Production)
  test('should return a 400 operational error with validation errors in production without stack', async () => {
    process.env.NODE_ENV = 'production';
    const res = await request(app).post('/test-400-validation');

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.stack).toBeUndefined();
    expect(res.body.errors).toEqual([{ field: 'name', message: 'Name is required' }]);
  });

  // Test for 500 generic error (Production)
  test('should return a generic 500 error response in production without stack', async () => {
    process.env.NODE_ENV = 'production';
    const res = await request(app).get('/test-500-generic');

    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Something went very wrong!');
    expect(res.body.stack).toBeUndefined();
    expect(res.body.errors).toBeUndefined();
  });

  // Test for 500 operational error (Production)
  test('should return a 500 operational error response in production without stack', async () => {
    process.env.NODE_ENV = 'production';
    const res = await request(app).get('/test-500-operational');  

    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Database down');
    expect(res.body.stack).toBeUndefined();
    expect(res.body.errors).toBeNull();
  });

  // Test for Mongoose CastError (Production)
  test('should handle Mongoose CastError in production', async () => {
    process.env.NODE_ENV = 'production';
    const castErrApp = express();
    castErrApp.get('/test-cast-error', (req, res, next) => {
      const err = new Error('Cast Error');
      err.name = 'CastError';
      err.path = 'id';
      err.value = 'invalid-id';
      next(err);
    });
    castErrApp.use(errorHandler);

    const res = await request(castErrApp).get('/test-cast-error');

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid id: invalid-id');
  });

  // Test for Mongoose Duplicate Key Error (Production)
  test('should handle Mongoose Duplicate Key Error in production', async () => {
    process.env.NODE_ENV = 'production';
    const dupErrApp = express();
    dupErrApp.get('/test-dup-error', (req, res, next) => {
      const err = new Error('Duplicate key');
      err.code = 11000;
      err.errmsg = 'E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "test@example.com" }';
      next(err);
    });
    dupErrApp.use(errorHandler);

    const res = await request(dupErrApp).get('/test-dup-error');

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Duplicate field value: "test@example.com"');
  });

  // Test for Mongoose ValidationError (Production)
  test('should handle Mongoose ValidationError in production', async () => {
    process.env.NODE_ENV = 'production';
    const valErrApp = express();
    valErrApp.get('/test-val-error', (req, res, next) => {
      const err = new Error('Validation failed');
      err.name = 'ValidationError';
      err.errors = {
        name: { path: 'name', message: 'Name is required' },
        email: { path: 'email', message: 'Email is invalid' }
      };
      next(err);
    });
    valErrApp.use(errorHandler);

    const res = await request(valErrApp).get('/test-val-error');

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid input data.');
    expect(res.body.errors).toEqual([
      { field: 'name', message: 'Name is required' },
      { field: 'email', message: 'Email is invalid' }
    ]);
  });
  });
