const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeGithubUsername } = require('../controllers/analyzeController');

test('normalizeGithubUsername strips URLs and keeps valid usernames', () => {
  assert.equal(normalizeGithubUsername('https://github.com/john-doe/'), 'john-doe');
  assert.equal(normalizeGithubUsername('github.com/jane-doe'), 'jane-doe');
  assert.equal(normalizeGithubUsername('@alice'), 'alice');
  assert.equal(normalizeGithubUsername(''), '');
});
