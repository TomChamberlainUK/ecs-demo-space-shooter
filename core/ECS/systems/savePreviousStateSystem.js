import { Vector2 } from '../../math/Vector2.js';

// Save entity previous transform state to be used during rendering for linear interpolation
// This must be done at the start of a physics update (before any changes are made to transform)

export function savePreviousStateSystem(entities) {
  // Loop through valid transform entites
  entities.forEach(_entity => {
    if (!_entity.hasComponent('transform')) return;

    // Get relevant components
    const entity = {
      transform: _entity.getComponent('transform')
    }

    // Save position
    entity.transform.previousPosition = new Vector2(entity.transform.position);
    entity.transform.previousRotation = entity.transform.rotation;
    entity.transform.previousScale = entity.transform.scale;
  });
}