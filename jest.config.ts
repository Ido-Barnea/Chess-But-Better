/* eslint-disable */
export default {
  displayName: 'chess-but-better',
  coverageDirectory: 'test-coverage',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/core/**/*.test.ts'],
  transform: {
    '^.+\\.svg$': '<rootDir>/core/view/resources/svgTransform.ts',
  },
};
