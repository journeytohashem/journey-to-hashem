import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['lib/**/*.test.js', 'components/**/*.test.{js,jsx}'],
  },
});
