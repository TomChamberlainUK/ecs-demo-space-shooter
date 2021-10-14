import { ECS } from '../core/ECS/ECS.js';

export class OutOfBounds extends ECS.Entity {
  constructor({
    position,
    width = 1024,
    height = 1024
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position
    })
    .addComponent(ECS.components.outOfBounds, {
      width,
      height
    })
    .addComponent(ECS.components.renderRectangle, {
      width,
      height,
      strokeColor: 'white'
    });
  }
}