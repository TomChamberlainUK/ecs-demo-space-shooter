// Time
const fixedTimeStep = 1 / 60; // Used for accurate recreatable physics
let variableTimeStep = 0; // Used for rendering
let lastTimestamp = window.performance.now();
let timeAccumulator = 0;
const maxAccumulator = Math.max(0.25, fixedTimeStep);

function updateTime(timestamp) {
  const deltaTime = (timestamp - lastTimestamp) / 1000;
  variableTimeStep = deltaTime;
  timeAccumulator += deltaTime;
  if (timeAccumulator > maxAccumulator) timeAccumulator = maxAccumulator; // Prevent spiral of death from trying to catch up on physics updates
  lastTimestamp = timestamp;
}

function shouldUpdatePhysics() {
  if (timeAccumulator >= fixedTimeStep) {
    timeAccumulator -= fixedTimeStep;
    return true;
  } else {
    return false;
  }
}

function getFixedTimeStep() {
  return fixedTimeStep;
}

function getVariableTimeStep() {
  return variableTimeStep;
}

function getTimestamp() {
  return lastTimestamp;
}

function getAccumulatedTime() {
  return timeAccumulator;
}

function checkTimeout(startingTimestamp, duration) { // DOMHighResTimestamps and seconds
  return lastTimestamp - startingTimestamp > duration * 1000;
}

function checkTimeSince(timestamp) { // returns seconds since timestamp
  return (lastTimestamp - timestamp) / 1000;
}


// API
export const Time = {
  updateTime,
  shouldUpdatePhysics,
  getVariableTimeStep,
  getFixedTimeStep,
  getTimestamp,
  getAccumulatedTime,
  checkTimeout,
  checkTimeSince
}