import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/__test__/*.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/__test__/*.ts?(x)',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 50, // conditional
      functions: 50, // how many defined functions are called during test
      lines: 50, // lines of code execute in the test
      statements: 50,
    },
  },
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: {
    '@/(.*)': ['<rootDir>/$1'],
  },
};

export default config;