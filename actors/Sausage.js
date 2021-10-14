import { ECS } from '../core/ECS/ECS.js';

export class Sausage extends ECS.Entity {
  constructor({
    position,
    scale,
    rotation,
    radius = 4,
    length = 16
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
      collisionTypes: ['physics'],
      radius,
      length,
      density: 0.3,
      restitution: 0.2
    })
    .addComponent(ECS.components.renderCapsule, {
      radius,
      length,
      fillColor: 'brown'
    })
  }
}