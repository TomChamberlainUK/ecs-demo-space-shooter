import { ECS } from '../core/ECS/ECS.js';

export class WallPawn extends ECS.Entity {
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
      length
    })
    .addComponent(ECS.components.controlled, {
      behaviours: ['steerer']
    })
    .addComponent(ECS.components.speed)
    .addComponent(ECS.components.direction)
    .addComponent(ECS.components.renderLine, {
      length,
      strokeColor: 'white'
    })
    .addComponent(ECS.components.debug, {
      transform: true,
      kinetic: true
    })
  }
}