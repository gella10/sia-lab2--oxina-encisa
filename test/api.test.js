const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

let server;
let baseUrl;

test.before(() => {
  server = app.listen(0);
  baseUrl = 'http://localhost:' + server.address().port;
});

test.after(() => {
  server.close();
});

test('GET /health says the app is ok', async () => {
  const response = await fetch(baseUrl + '/health');
  const data = await response.json();
  assert.strictEqual(response.status, 200);
  assert.strictEqual(data.status, 'ok');
});

test('POST /api/plan gives 4 pomodoros and a 15:55 finish', async () => {
  const response = await fetch(baseUrl + '/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      totalMinutes: 120, focusMinutes: 25, shortBreak: 5,
      longBreak: 15, cycle: 4, startTime: '14:00'
    })
  });
  const data = await response.json();
  assert.strictEqual(data.pomodoros, 4);
  assert.strictEqual(data.endTime, '15:55');
});

test('POST /api/plan rejects a study time of 0 with status 400', async () => {
  const response = await fetch(baseUrl + '/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      totalMinutes: 0, focusMinutes: 25, shortBreak: 5,
      longBreak: 15, cycle: 4, startTime: '14:00'
    })
  });
  assert.strictEqual(response.status, 400);
});