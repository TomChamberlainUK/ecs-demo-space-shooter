import { ECS } from '../core/ECS/ECS.js';

// 1 meter square
export class UnitSquare extends ECS.Entity {
  constructor({
    position,
    rotation,
    scale,
    width = 1,
    height = 1,
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
    .addComponent(ECS.components.renderRectangle, {
      fillColor: 'orange',
      width,
      height
    });
  }
}