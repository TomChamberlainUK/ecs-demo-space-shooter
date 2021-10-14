import { KeyboardAndMouseInput as input } from '../../input/KeyboardAndMouseInput.js';

export function controllerSystem(entities) {

  // Loop through valid controller entities
  for (const entity of entities) {
    if (!entity.hasComponent('controller')) continue;

    // Get relevant components
    const controller = entity.getComponent('controller');

    // Apply commands to pawn
    if (controller.pawn) {
      const { commands } = controller.pawn.getComponent('controlled');
      
      // Apply commands as per behaviours
      // Mover behaviour
      if (controller.behaviours.includes('mover')) {
        commands['move-up'] = input.isPressed('w') || input.isPressed('up');
        commands['move-down'] = input.isPressed('s') || input.isPressed('down');
        commands['move-left'] = input.isPressed('a') || input.isPressed('left');
        commands['move-right'] = input.isPressed('d') || input.isPressed('right');
        commands['boost'] = input.isPressed('shift');
      }
      // Steerer behaviour
      if (controller.behaviours.includes('steerer')) {
        commands['accelerate'] = input.isPressed('w') || input.isPressed('up');
        commands['brake'] = input.isPressed('s') || input.isPressed('down');
        commands['move-left'] = input.isPressed('q');
        commands['move-right'] = input.isPressed('e');
        commands['rotate-cw'] = input.isPressed('d') || input.isPressed('right');
        commands['rotate-ccw'] = input.isPressed('a') || input.isPressed('left');
        commands['boost'] = input.isPressed('shift');
      }
      // Shooter behaviour
      if (controller.behaviours.includes('shooter')) {
        commands['shoot'] = input.isPressed('left-click');
        commands['target'] = input.getWorldMousePosition();
      }
      // Platformer behaviour
      if (controller.behaviours.includes('platformer')) {
        commands['jump'] = input.isPressed('space');
      }
      // Rotater behaviour
      if (controller.behaviours.includes('rotater')) {
        commands['rotate-cw'] = input.isPressed('e');
        commands['rotate-ccw'] = input.isPressed('q');
      }

      // AI plugins
      if (controller.behaviours.includes('moverAI')) {
        const transform = controller.pawn.getComponent('transform');
        const kinetic = controller.pawn.getComponent('kinetic');
        const targetTransform = controller.target.getComponent('transform');
        const maxVelocity = 150;
        commands['move-up'] = transform.position.y > targetTransform.position.y && kinetic.velocity.y > -maxVelocity;
        commands['move-down'] = transform.position.y < targetTransform.position.y && kinetic.velocity.y < maxVelocity;
        commands['move-left'] = transform.position.x > targetTransform.position.x && kinetic.velocity.x > -maxVelocity;
        commands['move-right'] = transform.position.x < targetTransform.position.x && kinetic.velocity.x < maxVelocity;
      }
      if (controller.behaviours.includes('shooterAI')) {
        const transform = controller.pawn.getComponent('transform');
        const targetTransform = controller.target.getComponent('transform');
        const maxDistance = 400;
        commands['target'] = targetTransform.position;
        commands['shoot'] = transform.position.subtract(targetTransform.position).getLengthSquared() < maxDistance * maxDistance;
      }

    }

    // Apply controls to camera
    if (controller.camera) {
      const camera = controller.camera.getComponent('camera');

      // Apply zoom from scroll or reset zoom
      if (input.isPressed('middle-click')) input.resetMouseScroll();
      camera.zoom = input.getMouseScroll();
      
    }

  } 
}