const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
//    reporters: [
//     'default',
//     ['jest-html-reporters', {
//       publicPath: './test-reports',
//       filename: 'report.html',
//       pageTitle: 'Doctor Directory Test Report',
//       includeConsoleLog: true,  // Capture your console.log summaries
//       expand: true,
//       openReport: false
//     }]],
  // Optional: Handle module path aliases
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1',
  // },
};

module.exports = createJestConfig(customJestConfig);
