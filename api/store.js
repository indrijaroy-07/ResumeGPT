// Simple in-memory store for demo purposes
const { randomUUID } = require('crypto');

const users = [];
const analyses = [];

module.exports = {
  users,
  analyses,
  genId: randomUUID,
};
