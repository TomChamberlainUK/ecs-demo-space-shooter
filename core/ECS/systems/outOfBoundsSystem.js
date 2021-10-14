export function outOfBoundsSystem(entities) {

  // Loop through all valid out of bounds entities
  entities.forEach(_entity => {
    if (!_entity.hasComponents('out-of-bounds', 'transform')) return;

    // Get out of bounds entity boundary
    const boundary = getOutOfBoundsEdges(_entity);
    
    // Loop through all valid collision-enabled entities
    entities.forEach(_otherEntity => {
      if (!_otherEntity.hasComponents('transform')) return;

      // Get relevant components for collision entity
      const transform = _otherEntity.getComponent('transform');

      // If the entity exceeds any of the boundaries, return it to within bounds and reverse velocity based on restitution (bounce effect)
      if (transform.position.x < boundary.left) {
        transform.position.x = boundary.left;
      } else if (transform.position.x > boundary.right) {
        transform.position.x = boundary.right;
      }
      if (transform.position.y < boundary.top) {
        transform.position.y = boundary.top;
      } else if (transform.position.y > boundary.bottom) {
        transform.position.y = boundary.bottom;
      }

    });
  });
}

function getOutOfBoundsEdges(entity) {
  const { position } = entity.components['transform'];
  const { width, height } = entity.components['out-of-bounds'];
  return {
    left: position.x - width / 2,
    right: position.x + width / 2,
    top: position.y - height / 2,
    bottom: position.y + height / 2,
  }
}




























// export function outOfBoundsSystem(entities) {

//   // Loop through all valid out of bounds entities
//   entities.forEach(_entity => {
//     if (!_entity.hasComponents('out-of-bounds', 'transform')) return;

//     // Get out of bounds entity boundary
//     const boundary = getOutOfBoundsEdges(_entity);
    
//     // Loop through all valid collision-enabled entities
//     entities.forEach(_otherEntity => {
//       if (!_otherEntity.hasComponents('rigid-body', 'kinetic', 'transform')) return;

//       // Get relevant components for collision entity
//       const entity = {
//         rigidBody: _otherEntity.getComponent('rigid-body'),
//         transform: _otherEntity.getComponent('transform'),
//         kinetic: _otherEntity.getComponent('kinetic')
//       }

//       // Skip any entities that aren't physics collision enabled
//       if (!entity.rigidBody.collisionsEnabled || !entity.rigidBody.collisionTypes.includes('physics')) return;

//       // If entity is circular
//       if (entity.rigidBody.shape === 'circle') {
        
//         // Get edges of circle
//         const circleEdges = getCircleEdges(_otherEntity);

//         // If the entity exceeds any of the boundaries, return it to within bounds and reverse velocity based on restitution (bounce effect)
//         if (circleEdges.left < boundary.left) {
//           entity.transform.position.x = boundary.left + entity.rigidBody.radius * entity.transform.scale;
//           entity.kinetic.velocity.x *= -entity.rigidBody.restitution;
//         } else if (circleEdges.right > boundary.right) {
//           entity.transform.position.x = boundary.right - entity.rigidBody.radius * entity.transform.scale;
//           entity.kinetic.velocity.x *= -entity.rigidBody.restitution;
//         }
//         if (circleEdges.top < boundary.top) {
//           entity.transform.position.y = boundary.top + entity.rigidBody.radius * entity.transform.scale;
//           entity.kinetic.velocity.y *= -entity.rigidBody.restitution;
//         } else if (circleEdges.bottom > boundary.bottom) {
//           entity.transform.position.y = boundary.bottom - entity.rigidBody.radius * entity.transform.scale;
//           entity.kinetic.velocity.y *= -entity.rigidBody.restitution;
//         }

//       }

//     });
//   });
// }

// function getOutOfBoundsEdges(entity) {
//   const { position } = entity.components['transform'];
//   const { width, height } = entity.components['out-of-bounds'];
//   return {
//     left: position.x - width / 2,
//     right: position.x + width / 2,
//     top: position.y - height / 2,
//     bottom: position.y + height / 2,
//   }
// }

// function getCircleEdges(entity) {
//   const { position, scale } = entity.components['transform'];
//   const { radius } = entity.components['rigid-body'];
//   return {
//     left: position.x - radius * scale,
//     right: position.x + radius * scale,
//     top: position.y - radius * scale,
//     bottom: position.y + radius * scale
//   }
// }