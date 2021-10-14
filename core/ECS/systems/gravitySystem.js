import { Vector2 } from '../../math/Vector2.js';

export function gravitySystem(entities) {

  for (const entity of entities) {
    if (!entity.hasComponents('rigid-body', 'kinetic')) continue;

    const rigidBody = entity.getComponent('rigid-body');
    const kinetic = entity.getComponent('kinetic');

    // const gravityStrength = 9.81; // ms^2
    const gravityStrength = 0;

    let gravityForce = new Vector2({ x: 0, y: gravityStrength });

    // Prevent gravity on massless entities - useful for platforms
    if (rigidBody.mass !== 0) {
      kinetic.acceleration = kinetic.acceleration.add(gravityForce);
    }
  }

}