require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT,
    },
    jwtSecret: process.env.JWT_SECRET,
};