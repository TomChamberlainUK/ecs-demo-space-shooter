import { Game } from './core/Game.js';
import { Time } from './core/Time.js';
import { scene } from './sandbox.js';

Game.setCurrentScene(scene);
console.log(scene);

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

gameloop();