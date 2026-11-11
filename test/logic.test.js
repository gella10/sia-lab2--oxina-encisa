const test = require('node:test');
const assert = require('node:assert');
const { computeSchedule, computeEndTime } = require('../src/logic');

test('120 minutes with 25/5/15 and a long break every 4 fits 4 pomodoros', () => {
  assert.deepStrictEqual(computeSchedule(120, 25, 5, 15, 4), {
    pomodoros: 4,
    focusMinutes: 100,
    breakMinutes: 15,
    usedMinutes: 115,
    leftoverMinutes: 5
  });
});

test('50 minutes with 25/5 fits 2 pomodoros and 1 short break', () => {
  const result = computeSchedule(60, 25, 5, 15, 4);
  assert.strictEqual(result.pomodoros, 2);
  assert.strictEqual(result.breakMinutes, 5);
});

test('starting at 14:00 and using 115 minutes ends at 15:55', () => {
  assert.strictEqual(computeEndTime('14:00', 115), '15:55');
});

test('the end time wraps past midnight: 23:30 plus 60 minutes is 00:30', () => {
  assert.strictEqual(computeEndTime('23:30', 60), '00:30');
});

test('study time of 0 is not allowed', () => {
  assert.throws(() => computeSchedule(0, 25, 5, 15, 4));
});

test('study time shorter than one focus session is not allowed', () => {
  assert.throws(() => computeSchedule(10, 25, 5, 15, 4));
});

test('a start time that is not HH:MM is not allowed', () => {
  assert.throws(() => computeEndTime('25:99', 30));
});