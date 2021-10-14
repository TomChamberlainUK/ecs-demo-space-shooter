import { ECS } from '../core/ECS/ECS.js';

export class BoxPawn extends ECS.Entity {
  constructor({
    position,
    rotation,
    scale,
    width = 48,
    height = 64
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position,
      rotation,
      scale
    })
    .addComponent(ECS.components.kinetic)
    .addComponent(ECS.components.rigidBodyRectangle, {
      collisionsEnabled: true,
      collisionTypes: ['physics'],
      density: 0.3,
      restitution: 0.2,
      width,
      height
    })
    .addComponent(ECS.components.controlled, {
      behaviours: ['steerer']
    })
    .addComponent(ECS.components.speed, {
      force: 100000,
      torque: 2400000,
      boostMultiplier: 1.25
    })
    .addComponent(ECS.components.direction)
    .addComponent(ECS.components.renderRectangle, {
      fillColor: 'white',
      width,
      height
    })
    .addComponent(ECS.components.debug, {
      transform: true,
      kinetic: true
    });
  }
}