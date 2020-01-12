module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    //change DB_URL to DATABASE_URL for development, change back to DB_URL for production
    DB_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/restaurants',
    TEST_DB_URL: process.env.TEST_DB_URL || "postgresql://postgres@localhost/restaurants-test",
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000', 
  }