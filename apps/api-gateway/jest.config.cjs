module.exports = {
  roots: ['<rootDir>/src'],
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^@app/common$': '<rootDir>/../../libs/common/src',
    '^@app/events$': '<rootDir>/../../libs/events/src',
    '^@app/contracts$': '<rootDir>/../../libs/contracts/src',
    '^@app/proto$': '<rootDir>/../../libs/proto',
  },
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
