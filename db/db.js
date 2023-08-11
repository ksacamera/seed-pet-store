const { Client } = require('pg');
const client = new Client('postgres://localhost:5432/seed_pet_store');

module.exports = client;