import { ECS } from '../core/ECS/ECS.js';

export class Particle extends ECS.Entity {
  constructor({
    position,
    scale,
    velocity,
    type,
    radius,
    duration = 1
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position,
      scale
    })
    .addComponent(ECS.components.kinetic, {
      velocity
    })
    .addComponent(ECS.components.destroyable)
    .addComponent(ECS.components.particle, {
      type,
      radius
    })
    .addComponent(ECS.components.lifespan, {
      duration
    })
    .addComponent(ECS.components.renderCircle, {
      layer: -1
    });
  }
}