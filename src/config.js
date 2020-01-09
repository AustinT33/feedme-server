module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/restaurants',
    TEST_DB_URL: process.env.TEST_DB_URL || "postgresql://postgres@localhost/restaurants-test",
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000', 
  }