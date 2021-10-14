import { Game } from '../../Game.js';

export function cameraSystem(entities) {

  // Loop through valid camera entities
  for (const entity of entities) {
    if (!entity.hasComponents('camera', 'transform')) continue;

    // Get relevant camera components
    const camera = entity.getComponent('camera');
    const transform = entity.getComponent('transform');
    const kinetic = entity.getComponent('kinetic');

    // If the camera is set to follow another entity
    if (camera.followedEntity) {

      // Get relevant followed entity components
      const followedTransform = camera.followedEntity.getComponent('transform');
      const followedKinetic = camera.followedEntity.getComponent('kinetic');

      // Debug deadzone
      // Game.addDebugRectangle({
      //   position: transform.position,
      //   width: camera.deadzone.max.x / camera.zoom - camera.deadzone.min.x / camera.zoom,
      //   height: camera.deadzone.max.y / camera.zoom - camera.deadzone.min.y / camera.zoom
      // });

      // If followed entity has reached any deadzone edge in relation to camera entity, adjust camera position to follow
      if (followedTransform.position.x < transform.position.x + camera.deadzone.min.x / camera.zoom) {
        transform.position.x = followedTransform.position.x + camera.deadzone.max.x / camera.zoom
      } else if (followedTransform.position.x > transform.position.x + camera.deadzone.max.x / camera.zoom) {
        transform.position.x = followedTransform.position.x + camera.deadzone.min.x / camera.zoom
      }

      if (followedTransform.position.y < transform.position.y + camera.deadzone.min.y / camera.zoom) {
        transform.position.y = followedTransform.position.y + camera.deadzone.max.y / camera.zoom
      } else if (followedTransform.position.y > transform.position.y + camera.deadzone.max.y / camera.zoom) {
        transform.position.y = followedTransform.position.y + camera.deadzone.min.y / camera.zoom
      }

      // Match rotation
      if (camera.followEntityRotation) {

        // const currentRotation = transform.rotation;
        // const targetRotation  = followedTransform.rotation;
        // const difference = targetRotation - currentRotation;
        // const shortestAngle = difference % Math.PI;

        // if (shortestAngle < 0) {
        //   transform.rotation += Math.max(difference / 30, -0.025);
        // } else if (shortestAngle > 0) {
        //   transform.rotation += Math.min(difference / 30, 0.025);
        // }

        // Link angular rotation to directional movement
        const currentRotation = transform.rotation;
        const direction = followedKinetic.velocity.getUnit();
        const targetRotation = Math.atan2(direction.y, direction.x) + Math.PI / 2;
        const difference = targetRotation - currentRotation;
        const shortestAngle = difference % Math.PI;

        if (shortestAngle < 1) {
          transform.rotation += Math.max(difference / 100, -0.005);
        } else if (shortestAngle > 1) {
          transform.rotation += Math.min(difference / 100, 0.005);
        }

      }

    }
  }
}




























// export function cameraSystem(entities) {
  
//   // Loop through valid camera entities
//   entities.forEach(_entity => {
//     if (!_entity.hasComponents('transform', 'camera')) return;

//     // Get relevant camera components
//     const entity = {
//       transform: _entity.getComponent('transform'),
//       camera: _entity.getComponent('camera')
//     }

//     // If the camera is set to follow another entity
//     if (entity.camera.followEntity) {

//       // Get relevant followed entity components
//       const followedEntity = {
//         transform: entity.camera.followEntity.getComponent('transform')
//       }

//       // If followed entity has reached any deadzone edge in relation to camera entity, adjust camera position to follow
//       if (followedEntity.transform.position.x < entity.transform.position.x - entity.camera.deadzone.width / 2) {
//         entity.transform.position.x = followedEntity.transform.position.x + entity.camera.deadzone.width / 2;
//       } else if (followedEntity.transform.position.x > entity.transform.position.x + entity.camera.deadzone.width / 2) {
//         entity.transform.position.x = followedEntity.transform.position.x - entity.camera.deadzone.width / 2;
//       }
//       if (followedEntity.transform.position.y < entity.transform.position.y - entity.camera.deadzone.height / 2) {
//         entity.transform.position.y = followedEntity.transform.position.y + entity.camera.deadzone.height / 2;
//       } else if (followedEntity.transform.position.y > entity.transform.position.y + entity.camera.deadzone.height / 2) {
//         entity.transform.position.y = followedEntity.transform.position.y - entity.camera.deadzone.height / 2;
//       }

//     }

//   });
// }