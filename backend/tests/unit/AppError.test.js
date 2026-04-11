import AppError from '@/utils/AppError.js';

describe('AppError', () => {
  test('should create an operational error with status fail for 4xx codes', () => {
    const error = new AppError('Not Found', 404);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Not Found');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
    expect(error.errors).toBeNull();
  });

  test('should create an operational error with status error for 5xx codes', () => {
    const error = new AppError('Internal Server Error', 500);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Internal Server Error');
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('error');
    expect(error.isOperational).toBe(true);
    expect(error.errors).toBeNull();
  });

  test('should include validation errors if provided', () => {
    const validationErrors = [{ field: 'email', message: 'Invalid email' }];
    const error = new AppError('Validation Failed', 400, validationErrors);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Validation Failed');
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
    expect(error.errors).toEqual(validationErrors);
  });

  test('should capture stack trace', () => {
    const error = new AppError('Test Error', 400);
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('Test Error');
    expect(error.stack).toContain('AppError');
  });
});
