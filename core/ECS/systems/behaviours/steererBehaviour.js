import { Vector2 } from '../../../math/Vector2.js';
import { getTFRotationMatrix2 } from '../../../math/Matrix.js';

export function steererBehaviour(entity) {

  // Ensure entity has all required components
  if (!entity.hasComponents('transform', 'kinetic', 'rigid-body', 'controlled', 'speed', 'direction', 'particle-emitter')) return;

  // Get relevant entity components
  const transform = entity.getComponent('transform');
  const kinetic = entity.getComponent('kinetic');
  const rigidBody = entity.getComponent('rigid-body');
  const controlled = entity.getComponent('controlled');
  const speed = entity.getComponent('speed');
  const direction = entity.getComponent('direction');
  const particleEmitter = entity.getComponent('particle-emitter');

  // Get relevant physics data
  let force = speed.force;
  const torque = speed.torque;
  const boostMultiplier = speed.boostMultiplier;
  const inverseMass = rigidBody.inverseMass;
  const inverseInertia = rigidBody.inverseInertia;

  // Rotate direction using matrix, then release back to pool
  const rotationMatrix = getTFRotationMatrix2(transform.rotation);
  const relativeDirection = rotationMatrix.multiplyVector(direction.direction);
  rotationMatrix.release();

  // Init acceleration to be added
  let movementForce = new Vector2({});
  let angularForce = 0;

  // Perform commands
  if (controlled.commands['boost']) { // Increase acceleration force
    force *= boostMultiplier;
    particleEmitter.particleType = 'nitros';
    particleEmitter.particleSpeedMultiplier = boostMultiplier;
  } else {
    particleEmitter.particleType = 'fire';
    particleEmitter.particleSpeedMultiplier = 1;
  }

  if (controlled.commands['accelerate']) { // Enable acceleration in entity direction
    movementForce = movementForce.add(relativeDirection.multiplyBy(force * inverseMass));
    particleEmitter.isEmitting = true;
    particleEmitter.particleDirection = relativeDirection.multiplyBy(-1);
  } else {
    particleEmitter.isEmitting = false;
  }

  if (controlled.commands['brake']) { // Air brakes
    movementForce = movementForce.add(kinetic.velocity.multiplyBy(-1));
  }

  if (controlled.commands['move-left']) { // Track left
    movementForce = movementForce.subtract(relativeDirection.getNormal().multiplyBy(force / 2 * inverseMass));
  }

  if (controlled.commands['move-right']) { // Track right
    movementForce = movementForce.add(relativeDirection.getNormal().multiplyBy(force / 2 * inverseMass));
  }
  
  if (controlled.commands['rotate-cw']) { // Rotate entity clockwise
    angularForce += torque * inverseInertia;
  }

  if (controlled.commands['rotate-ccw']) { // Rotate entity counter-clockwise
    angularForce -= torque * inverseInertia;
  }
  

  // Integrate forces into acceleration
  kinetic.acceleration = kinetic.acceleration.add(movementForce);
  kinetic.angularAcceleration += angularForce;
  
}