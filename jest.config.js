/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(@electra)/)'
  ],
  collectCoverageFrom: [
    './src/**/*.ts',
    '!**/*.d.ts',
    '!src/Mock/*.ts'
  ]
};
