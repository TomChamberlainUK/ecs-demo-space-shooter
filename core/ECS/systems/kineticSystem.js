import { Time } from '../../Time.js';
import { Vector2 } from '../../math/Vector2.js';

export function kineticSystem(entities) {

  // Loop through valid kinetic entities
  entities.forEach(entity => {
    if (!entity.hasComponents('transform', 'kinetic')) return;

    // Get relevant components
    const transform = entity.getComponent('transform');
    const kinetic = entity.getComponent('kinetic');

    // Get time delta for physics calculation: velocity is the time derivative of position; acceleration is the time derivative of velocity
    const deltaTime = Time.getFixedTimeStep();

    // const epsilon = 0.3;

    // const epsilonSquared = epsilon * epsilon;

    // // Implement velocity via semi-implicit euler method
    // if (kinetic.velocity.getLengthSquared() < epsilonSquared && kinetic.acceleration.getLengthSquared() < epsilonSquared) {
    //   return;
    // }

    // Recalculate position from velocity, velocity from acceleration, and reset acceleration
    kinetic.velocity = kinetic.velocity.add(kinetic.acceleration.multiplyBy(deltaTime));
    transform.position = transform.position.add(kinetic.velocity.multiplyBy(deltaTime));
    kinetic.acceleration = new Vector2({});

    // Recalculate rotation from angular velocity, angular velocity from angular acceleration, and reset angular acceleration
    kinetic.angularVelocity += kinetic.angularAcceleration * deltaTime;
    transform.rotation += kinetic.angularVelocity * deltaTime;
    kinetic.angularAcceleration = 0;

  });











// import { Time } from '../../Time.js';
// import { Vector2 } from '../../math/Vector2.js';

// export function kineticSystem(entities) {

//   // Loop through valid kinetic entities
//   entities.forEach(_entity => {
//     if (!_entity.hasComponents('transform', 'kinetic')) return;

//     // Get relevant components
//     const entity = {
//       transform: _entity.getComponent('transform'),
//       kinetic: _entity.getComponent('kinetic')
//     }

//     // Get time delta for physics calculation: velocity is the time derivative of position; acceleration is the time derivative of velocity
//     const deltaTime = Time.getFixedTimeStep();

//     // Implement velocity via semi-implicit euler method

//     // Recalculate position from velocity, velocity from acceleration, and reset acceleration
//     entity.kinetic.velocity = entity.kinetic.velocity.add(entity.kinetic.acceleration.multiplyBy(deltaTime));
//     entity.transform.position = entity.transform.position.add(entity.kinetic.velocity.multiplyBy(deltaTime));
//     entity.kinetic.acceleration = new Vector2({});

//     // Recalculate rotation from angular velocity, angular velocity from angular acceleration, and reset angular acceleration
//     entity.kinetic.angularVelocity += entity.kinetic.angularAcceleration * deltaTime;
//     entity.transform.rotation += entity.kinetic.angularVelocity * deltaTime;
//     entity.kinetic.angularAcceleration = 0;

//   });

}