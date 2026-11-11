// The "brain" of the app. The automated tests check these functions.

function checkWhole(value, name, min) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min) {
    throw new Error(name + ' must be a whole number, at least ' + min);
  }
}

// Returns the plan. Example: 120 min, 25 focus, 5 short, 15 long, long break every 4
// -> 4 pomodoros, 100 focus, 15 break, 115 used, 5 leftover
function computeSchedule(totalMinutes, focus, shortBreak, longBreak, cycle) {
  checkWhole(totalMinutes, 'Study time', 1);
  checkWhole(focus, 'Focus length', 1);
  checkWhole(shortBreak, 'Short break', 0);
  checkWhole(longBreak, 'Long break', 0);
  checkWhole(cycle, 'Pomodoros before a long break', 1);
  if (totalMinutes < focus) {
    throw new Error('Study time must be at least one focus session');
  }

  let time = 0;
  let count = 0;
  let breakMinutes = 0;
  while (time + focus <= totalMinutes) {
    time += focus;
    count++;
    const pause = count % cycle === 0 ? longBreak : shortBreak;
    if (time + pause + focus <= totalMinutes) {
      time += pause;
      breakMinutes += pause;
    } else {
      break; // no room for another pomodoro, so skip the last break
    }
  }
  return {
    pomodoros: count,
    focusMinutes: count * 10,
    breakMinutes: breakMinutes,
    usedMinutes: time,
    leftoverMinutes: totalMinutes - time
  };
}

// Returns the finish time as HH:MM. Example: start "14:00", 115 minutes -> "15:55"
function computeEndTime(startTime, minutes) {
  if (typeof startTime !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) {
    throw new Error('Start time must look like HH:MM (example 14:00)');
  }
  checkWhole(minutes, 'Minutes', 0);
  const [h, m] = startTime.split(':').map(Number);
  const total = (h * 60 + m + minutes) % 1440;
  const hh = String(Math.floor(total / 60)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return hh + ':' + mm;
}

module.exports = { computeSchedule, computeEndTime };