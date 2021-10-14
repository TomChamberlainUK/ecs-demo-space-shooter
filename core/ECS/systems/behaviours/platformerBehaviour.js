import { Vector2 } from '../../../math/Vector2.js';

export function platformerBehaviour(entity) {

  // Ensure entity has all required components
  if (!entity.hasComponents('controlled', 'transform', 'kinetic')) return;

  // Get relevant entity components
  const controlled = entity.getComponent('controlled');
  const transform = entity.getComponent('transform');
  const kinetic = entity.getComponent('kinetic');

  const boostMultiplier = 1.5;

  let maxSpeed = 150;
  let speed = 50;

  // Perform commands
  if (controlled.commands['boost']) {
    maxSpeed *= boostMultiplier;
    speed *= boostMultiplier;
  }
  if (controlled.commands['move-left']) {
    // transform.position.x -= speed;
    if (kinetic.velocity.x > -maxSpeed) {
      kinetic.velocity.x -= speed;
    }
  }
  if (controlled.commands['move-right']) {
    // transform.position.x += speed;
    if (kinetic.velocity.x < maxSpeed) {
      kinetic.velocity.x += speed;
    }
  }
  if (controlled.commands['jump']) {
    // Apply impulse
    kinetic.velocity.y -= 100;
  }


}