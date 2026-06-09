const dotenv = require("dotenv");

dotenv.config();

function getEnv() {
  const PORT = process.env.PORT || 3000;
  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/my-express-app";
  const NODE_ENV = process.env.NODE_ENV || "development";

  return { PORT, MONGODB_URI, NODE_ENV };
}

module.exports = { getEnv };

export { getEnv };
