import { Game } from '../../Game.js';
import { Time } from '../../Time.js';
import { round } from '../../utility/round.js';

// Settings
const fontSize = 12;
const lineHeight = 1.5;
const color = 'yellow';
const offset = {
  x: 4,
  y: 4
}

export function debugRendererSystem(entities) {

  // Create a array to hold displayed logs
  const logs = [];

  // Log fps
  logs.push(`FPS: ${round(1 / Time.getVariableTimeStep())}`)

  // Loop through each relevant entity
  for (const entity of entities) {
    if (!entity.hasComponent('debug')) continue;

    const debug = entity.getComponent('debug');

    // Log transform if applicable
    if (entity.hasComponent('transform') && debug.transform) {
      const transform = entity.getComponent('transform');
      logs.push(
        'Position',
        `   x: ${round(transform.position.x)}`,
        `   y: ${round(transform.position.y)}`,
        'Rotation',
        `      ${round(transform.rotation)}`,
        'Scale',
        `      ${round(transform.scale)}`
      );
    }

    // Log kinetic if applicable
    if (entity.hasComponent('kinetic') && debug.kinetic) {
      const kinetic = entity.getComponent('kinetic');
      logs.push(
        'Velocity',
        `   x: ${round(kinetic.velocity.x)}`,
        `   y: ${round(kinetic.velocity.y)}`,
        'Angular Velocity',
        `      ${round(kinetic.angularVelocity)}`
      );
    }

    // Log rigid-body if applicable
    if (entity.hasComponent('rigid-body') && debug.rigidBody) {
      const rigidBody = entity.getComponent('rigid-body');
      logs.push(
        'Shape',
        `      ${rigidBody.shape}`,
        'Collisions Enabled',
        `      ${rigidBody.collisionsEnabled}`,
        'Collision Types',
        `      ${rigidBody.collisionTypes.join(', ')}`,
        'Density',
        `      ${rigidBody.density}`,
        'Restitution',
        `      ${rigidBody.restitution}`,
      );
    }

    // Log controlled if applicable
    if (entity.hasComponent('controlled') && debug.controlled) {
      const controlled = entity.getComponent('controlled');
      logs.push(
        'Behaviours',
        `      ${controlled.behaviours.join(', ')}`,
      );
    }

    // Log speed if applicable
    if (entity.hasComponent('speed') && debug.speed) {
      const speed = entity.getComponent('speed');
      logs.push(
        'Acceleration Force',
        `      ${speed.force}N`,
        'Torque',
        `      ${speed.torque}Nm`,
        'Boost Multiplier',
        `      ${speed.boostMultiplier}x`,
      );
    }

    // Log weapon if applicable
    if (entity.hasComponent('weapon') && debug.weapon) {
      const weapon = entity.getComponent('weapon');
      logs.push(
        'Projectile speed',
        `      ${weapon.projectileSpeed}`,
        'Fire rate',
        `      ${weapon.fireRate}`,
      );
    }

    // Log damageable if applicable
    if (entity.hasComponent('damageable') && debug.damageable) {
      const damageable = entity.getComponent('damageable');
      logs.push(
        'Health',
        `      ${damageable.health}/${damageable.maxHealth}`,
      );
    }

  }

  // Set log styling
  Game.ctx.fillStyle = color;
  Game.ctx.font = `${fontSize}px sans-serif`;

  // Write logs to screen
  logs.forEach((log, i) => {
    Game.ctx.fillText(
      log,
      offset.x,
      offset.y + fontSize + (i * fontSize * lineHeight)
    );
  })


  if (Game.hasDebugItems()) {
    const debugItems = Game.getDebugItems();

    const _camera = Game.getCurrentScene().currentCamera;
    const camera = {
      transform: _camera.getComponent('transform'),
      camera: _camera.getComponent('camera')
    }
    const cameraEdge = {
      left: camera.transform.position.x - camera.camera.viewport.width / 2,
      top: camera.transform.position.y - camera.camera.viewport.height / 2
    }

    // Translate current context to take camera position into account
    Game.ctx.save();

    // Change origin to be centered - canvas default is top left
    Game.ctx.translate(camera.camera.viewport.width / 2, camera.camera.viewport.height / 2);

    // Apply camera transformations
    Game.ctx.scale(camera.camera.zoom, camera.camera.zoom);
    Game.ctx.rotate(-camera.transform.rotation);
    Game.ctx.translate(-camera.transform.position.x, -camera.transform.position.y);

    for (const item of debugItems) {

      // Save rendering context and move to position
      Game.ctx.save();
      Game.ctx.translate(item.position.x, item.position.y);
      Game.ctx.beginPath();

      // Draw debug shape
      switch (item.shape) {

        case 'circle': {
          Game.ctx.arc(
            0,
            0,
            item.radius,
            0,
            Math.PI * 2
          );
          break;
        }

        case 'rectangle': {
          Game.ctx.rect(
            -item.width / 2,
            -item.height / 2,
            item.width,
            item.height
          );
          break;
        }

        case 'line': {
          Game.ctx.moveTo(
            item.start.x,
            item.start.y
          );
          Game.ctx.lineTo(
            item.end.x,
            item.end.y
          );
          break;
        }

      }

      // Render shape and restore canvas context
      Game.ctx.closePath();
      if (item.fillColor) {
        Game.ctx.fillStyle = item.fillColor;
        Game.ctx.fill();
      }
      if (item.strokeColor) {
        Game.ctx.strokeStyle = item.strokeColor;
        Game.ctx.stroke();
      }
      Game.ctx.restore();
    }

    // Restore canvas context from camera position
    Game.ctx.restore();
    Game.clearDebugItems();

  }


}