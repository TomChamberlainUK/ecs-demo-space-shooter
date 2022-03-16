import { Game } from './core/Game.js';
import { Time } from './core/Time.js';
import { scene } from './sandbox.js';

// Configure the initial overlay
const overlay = document.querySelector('#js-overlay');
const startButton = document.querySelector('#js-startButton');

startButton.addEventListener('click', () => {
  overlay.classList.add('overlay--hidden');
  gameloop();
});

// Sets the scene for the game
Game.setCurrentScene(scene);

// The main game loop
function gameloop() {
  function step(timestamp) {

    Time.updateTime(timestamp);

    while (Time.shouldUpdatePhysics()) {
      scene.update();
    }

    scene.render();
    
    requestAnimationFrame(step);
    
  }
  requestAnimationFrame(step);
}