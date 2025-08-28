const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  requestTimeout: 30000,
  connectionTimeout: 30000,
};

const createPool = async () => {
  try {
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    return pool;
  } catch (err) {
    console.error("Database Connection Failed! ", err);
    throw err;
  }
};

const poolPromise = createPool();

module.exports = {
  sql,
  poolPromise,
};
