import { ECS } from '../core/ECS/ECS.js';

export class CrateDebris extends ECS.Entity {
  constructor({
    position,
    rotation,
    scale,
    velocity,
    angularVelocity,
    width = 4,
    height = 16,
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position,
      rotation,
      scale
    })
    .addComponent(ECS.components.kinetic, {
      velocity,
      angularVelocity
    })
    .addComponent(ECS.components.rigidBodyRectangle, {
      collisionsEnabled: true,
      collisionTypes: ['physics'],
      density: 0.3,
      restitution: 0.2,
      staticFriction: 0.2,
      dynamicFriction: 0.3,
      width,
      height
    })
    .addComponent(ECS.components.destroyable)
    .addComponent(ECS.components.lifespan, {
      duration: 15
    })
    .addComponent(ECS.components.renderRectangle, {
      fillColor: 'SaddleBrown',
      width,
      height
    });
  }
}