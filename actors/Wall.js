import { ECS } from '../core/ECS/ECS.js';

export class Wall extends ECS.Entity {
  constructor({
    position,
    scale,
    rotation,
    length
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position,
      scale,
      rotation
    })
    .addComponent(ECS.components.kinetic)
    .addComponent(ECS.components.rigidBodyLine, {
      collisionsEnabled: true,
      collisionTypes: ['physics', 'block-projectiles'],
      density: 0,
      restitution: 0.4,
      staticFriction: 0.4,
      dynamicFriction: 0.6,
      length
    })
    .addComponent(ECS.components.renderLine, {
      length,
      strokeColor: 'white'
    })
  }
}