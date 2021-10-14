import { Game } from '../Game.js';
import { Vector2 } from '../math/Vector2.js';
import { getTFMatrix2D } from '../math/Matrix.js';

// Map key codes to key names
const keyboardKeys = {
  left: 37,
  right: 39,
  up: 38,
  down: 40,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90,
  shift: 16,
  space: 32,
}

// An array where index represents keys and value will be a boolean to denote whether or not the key is pressed
const pressedKeys = [];

// Store mouse info
const mouse = {
  position: { x: 0, y: 0 },
  scroll: 1,
  leftClick: false,
  middleClick: false,
  rightClick: false
}

// Catch key presses
window.addEventListener('keydown', e => pressedKeys[e.keyCode] = true);
window.addEventListener('keyup', e => pressedKeys[e.keyCode] = false);

// Catch clicks
window.addEventListener('mousedown', e => {
  if (e.button === 0) mouse.leftClick = true;
  if (e.button === 1) mouse.middleClick = true;
  if (e.button === 2) mouse.rightClick = true;
});
window.addEventListener('mouseup', e => {
  if (e.button === 0) mouse.leftClick = false;
  if (e.button === 1) mouse.middleClick = false;
  if (e.button === 2) mouse.rightClick = false;
});

// Prevent right click context menu
window.addEventListener('contextmenu', e => e.preventDefault());

// Catch mouse movement
window.addEventListener('mousemove', e => {
  mouse.position.x = e.clientX;
  mouse.position.y = e.clientY;
});

// Catch mouse wheel scroll
window.addEventListener('wheel', e => {
  mouse.scroll -= e.deltaY / 100;
  mouse.scroll = Math.min(Math.max(mouse.scroll, 0.5), 5);
});

function isPressed(keyName) {
  if (keyName === 'left-click') return mouse.leftClick;
  if (keyName === 'middle-click') return mouse.middleClick;
  if (keyName === 'right-click') return mouse.rightClick;
  const key = keyboardKeys[keyName];
  return pressedKeys[key];
}

function getMousePosition() {
  return new Vector2(mouse.position);
}

function getMouseScroll() {
  return mouse.scroll;
}

function resetMouseScroll() {
  mouse.scroll = 1;
}

function getWorldMousePosition() {

  // Get current scene camera
  const currentCamera = Game.getCurrentScene().currentCamera;

  // Get relevant components
  const transform = currentCamera.getComponent('transform');
  const camera = currentCamera.getComponent('camera');


  // Calculate camera edge
  const cameraMin = new Vector2({
    x: -camera.viewport.width / 2 / camera.zoom,
    y: -camera.viewport.height / 2 / camera.zoom
  });

  // Get view space mouse position
  const mousePosition = getMousePosition();

  // Convert to world space
  let worldMousePosition = new Vector2({
    x: cameraMin.x + mousePosition.x / camera.zoom,
    y: cameraMin.y + mousePosition.y / camera.zoom
  });

  const tfMatrix = getTFMatrix2D().rotate(transform.rotation);
  worldMousePosition = tfMatrix.multiplyVector(worldMousePosition);
  tfMatrix.release();

  worldMousePosition = worldMousePosition.add(transform.position);

  // Debug world mouse position
  // Game.addDebugCircle({
  //   position: worldMousePosition,
  //   fillColor: 'cyan'
  // });
  Game.addDebugLine({
    position: worldMousePosition,
    start: { x: 0, y: -5 },
    end: { x: 0, y: 5 },
    strokeColor: 'cyan'
  });
  Game.addDebugLine({
    position: worldMousePosition,
    start: { x: -5, y: 0 },
    end: { x: 5, y: 0 },
    strokeColor: 'cyan'
  });

  return worldMousePosition;
}

export const KeyboardAndMouseInput = {
  isPressed,
  getMousePosition,
  getWorldMousePosition,
  getMouseScroll,
  resetMouseScroll
}