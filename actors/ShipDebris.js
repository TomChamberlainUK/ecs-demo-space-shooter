import { ECS } from '../core/ECS/ECS.js';

export class ShipDebris extends ECS.Entity {
  constructor({
    position,
    scale,
    velocity,
    fillColor = 'grey',
    strokeColor
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position,
      scale
    })
    .addComponent(ECS.components.kinetic, {
      velocity
    })
    .addComponent(ECS.components.rigidBodyCircle, {
      radius: 2,
      collisionsEnabled: true,
      collisionTypes: ['physics'],
      density: 0.6,
      restitution: 0.1
    })
    .addComponent(ECS.components.destroyable)
    .addComponent(ECS.components.lifespan, {
      duration: 15
    })
    .addComponent(ECS.components.renderCircle, {
      radius: 2,
      fillColor,
      strokeColor
    });
  }
}