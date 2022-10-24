require("dotenv").config({ path: "./vars/.env" });

module.exports = {
    SECRET: process.env.JWT_SECRET
};