import { ECS } from '../core/ECS/ECS.js';

export class Coin extends ECS.Entity {
  constructor({
    position
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position
    })
    .addComponent(ECS.components.kinetic)
    .addComponent(ECS.components.rigidBodyCircle, {
      radius: 4,
      collisionsEnabled: true,
      collisionTypes: ['pickuppable', 'physics'],
    })
    .addComponent(ECS.components.destroyable)
    .addComponent(ECS.components.renderCircle, {
      radius: 4,
      fillColor: 'yellow'
    });
  }
}