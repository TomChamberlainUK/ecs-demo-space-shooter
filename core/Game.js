// Canvas
const canvas = document.querySelector('#canvas');
  canvas.width = canvas.scrollWidth;
  canvas.height = canvas.scrollHeight;

const ctx = canvas.getContext('2d');

window.addEventListener('resize', () => {
  canvas.width = canvas.scrollWidth;
  canvas.height = canvas.scrollHeight;
});


// Scene
let currentScene = null;

function setCurrentScene(scene) {
  currentScene = scene;
}

function getCurrentScene() {
  return currentScene;
}


// Debug
let debugItems = [];

function getDebugItems() {
  return debugItems;
}

function addDebugCircle({
  shape = 'circle',
  radius = 2,
  fillColor = 'red',
  strokeColor = '',
  position = { x: 0, y: 0 }
}) {
  debugItems.push({
    shape,
    radius,
    fillColor,
    strokeColor,
    position
  });
}

function addDebugRectangle({
  shape = 'rectangle',
  width = 8,
  height = 8,
  fillColor = '',
  strokeColor = 'red',
  position = { x: 0, y: 0 }
}) {
  debugItems.push({
    shape,
    width,
    height,
    fillColor,
    strokeColor,
    position
  });
}

function addDebugLine({
  shape = 'line',
  position = { x: 0, y: 0 },
  start = { x: 0, y: 0 },
  end = { x: 0, y: 0 },
  strokeColor = 'red'
}) {
  debugItems.push({
    shape,
    position,
    start,
    end,
    strokeColor
  });
}

function hasDebugItems() {
  return debugItems.length > 0;
}

function clearDebugItems() {
  debugItems = [];
}

// API
export const Game = {
  getCurrentScene,
  setCurrentScene,
  canvas,
  ctx,

  getDebugItems,
  addDebugCircle,
  addDebugRectangle,
  addDebugLine,
  hasDebugItems,
  clearDebugItems
}