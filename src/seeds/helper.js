import { faker } from '@faker-js/faker';

export const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
};

export { faker as fakerInstance } from '@faker-js/faker';
