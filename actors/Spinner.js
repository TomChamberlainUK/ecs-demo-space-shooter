import { ECS } from '../core/ECS/ECS.js';

export class Spinner extends ECS.Entity {
  constructor({
    position,
    scale,
    rotation,
    renderDirection = false,
    radius = 16
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position,
      scale,
      rotation
    })
    .addComponent(ECS.components.kinetic)
    .addComponent(ECS.components.rigidBodyCapsule, {
      collisionsEnabled: true,
      collisionTypes: ['physics', 'block-projectiles'],
      radius,
      restitution: 0.1
    })
    .addComponent(ECS.components.renderCapsule, {
      renderDirection,
      radius,
      fillColor: 'white'
    })
  }
}