module.exports = {
  // Используем babel для трансформации
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  // Окружение для тестов (jsdom для DOM-тестов)
  testEnvironment: 'node',
  testMatch: [
    '**/src/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/index.js',
    '!src/**/*.spec.js',
  ],
  // Отчеты о покрытии
  coverageReporters: ['text', 'html', 'lcov'],
  // Игнорировать папки
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};