import { Vector2 } from '../../../math/Vector2.js';

export function moverBehaviour(entity) {

  // Ensure entity has all required components
  if (!entity.hasComponents('transform', 'kinetic', 'rigid-body', 'controlled', 'speed', 'particle-emitter')) return;

  // Get relevant entity components
  const kinetic = entity.getComponent('kinetic');
  const rigidBody = entity.getComponent('rigid-body');
  const controlled = entity.getComponent('controlled');
  const speed = entity.getComponent('speed');
  const particleEmitter = entity.getComponent('particle-emitter');

  // Get relevant physics data
  let force = speed.force;
  const boostMultiplier = speed.boostMultiplier;
  const inverseMass = rigidBody.inverseMass;

  // Init force vector for movement to be used for direction
  const direction = new Vector2({});

  // Perform commands
  if (controlled.commands['boost']) {
    force *= boostMultiplier;
    particleEmitter.particleType = 'nitros';
    particleEmitter.particleSpeedMultiplier = boostMultiplier;
  } else {
    particleEmitter.particleType = 'fire';
    particleEmitter.particleSpeedMultiplier = 1;
  }
  if (controlled.commands['move-left']) {
    direction.x -= 1;
  }
  if (controlled.commands['move-right']) {
    direction.x += 1;
  }
  if (controlled.commands['move-up']) {
    direction.y -= 1;
  }
  if (controlled.commands['move-down']) {
    direction.y += 1;
  }
  // Emit particles if moving
  if (
    controlled.commands['move-left'] ||
    controlled.commands['move-right'] ||
    controlled.commands['move-up'] ||
    controlled.commands['move-down']
  ) {
    particleEmitter.isEmitting = true;
  } else {
    particleEmitter.isEmitting = false;
  }

  // Update entity acceleration
  const movementForce = direction.getUnit().multiplyBy(force * inverseMass);
  kinetic.acceleration = kinetic.acceleration.add(movementForce);

  // Set particles to direction to opposite of acceleration direction
  particleEmitter.particleDirection = direction.multiplyBy(-1);



}




























// import { Vector2 } from '../../../math/Vector2.js';

// export function moverBehaviour(_entity) {

//   // Ensure entity has all required components
//   if (!_entity.hasComponents('transform', 'kinetic', 'rigid-body', 'controlled', 'speed')) return;

//   // Get relevant entity components
//   const entity = {
//     transform: _entity.getComponent('transform'),
//     kinetic: _entity.getComponent('kinetic'),
//     rigidBody: _entity.getComponent('rigid-body'),
//     controlled: _entity.getComponent('controlled'),
//     speed: _entity.getComponent('speed'),
//     direction: _entity.getComponent('direction')
//   }
//   const particleEmitter = _entity.getComponent('particle-emitter')

//   // Get relevant physics data
//   let force = entity.speed.force;
//   const boostMultiplier = entity.speed.boostMultiplier;
//   const inverseMass = entity.rigidBody.inverseMass;

//   // Init force vector for movement to be used for direction
//   const direction = new Vector2({});

//   // Perform commands
//   if (entity.controlled.commands['boost']) {
//     force *= boostMultiplier;
//   }
//   if (entity.controlled.commands['move-left']) {
//     direction.x -= 1;
//   }
//   if (entity.controlled.commands['move-right']) {
//     direction.x += 1;
//   }
//   if (entity.controlled.commands['move-up']) {
//     direction.y -= 1;
//   }
//   if (entity.controlled.commands['move-down']) {
//     direction.y += 1;
//   }
//   // Emity particles if moving
//   if (entity.controlled.commands['move-left'] ||
//       entity.controlled.commands['move-right'] ||
//       entity.controlled.commands['move-up'] ||
//       entity.controlled.commands['move-down']) {
//         particleEmitter.isEmitting = true;
//       } else {
//         particleEmitter.isEmitting = false;
//       }

//   // Update entity acceleration
//   const movementForce = direction.getUnit().multiplyBy(force * inverseMass);
//   entity.kinetic.acceleration = entity.kinetic.acceleration.add(movementForce);

//   // Set particles to direction to opposite of acceleration direction
//   particleEmitter.particleDirection = direction.multiplyBy(-1);



// }