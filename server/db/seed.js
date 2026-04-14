// db/seed.js
const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  await pool.query('DROP TABLE IF EXISTS users');
  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    )
  `);

  const [aliceHash, bobHash, carolHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('hunter2', SALT_ROUNDS),
    bcrypt.hash('opensesame', SALT_ROUNDS),
  ]);

  const query = 'INSERT INTO users (username, password_hash) VALUES ($1, $2)';
  await pool.query(query, ['alice', aliceHash]);
  await pool.query(query, ['bob', bobHash]);
  await pool.query(query, ['carol', carolHash]);

  console.log('Database seeded.');
};

seed()
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
