/* eslint-disable */
export default {
  displayName: 'chess-but-better',
  coverageDirectory: 'test-coverage',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  transform: {
    '^.+\\.svg$': '<rootDir>/src/view/resources/svgTransform.ts',
  },
};
