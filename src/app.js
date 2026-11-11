const express = require('express');
const path = require('path');
const { computeSchedule, computeEndTime } = require('./logic');
const { version } = require('../package.json');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check: the pipeline calls this to see if the app is alive
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: version });
});

// The main feature of the app
app.post('/api/plan', (req, res) => {
  try {
    const totalMinutes = Number(req.body.totalMinutes);
    const focusMinutes = Number(req.body.focusMinutes);
    const shortBreak = Number(req.body.shortBreak);
    const longBreak = Number(req.body.longBreak);
    const cycle = Number(req.body.cycle);
    const startTime = req.body.startTime;

    const schedule = computeSchedule(totalMinutes, focusMinutes, shortBreak, longBreak, cycle);
    const endTime = computeEndTime(startTime, schedule.usedMinutes);
    res.json({ ...schedule, endTime: endTime });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = app;