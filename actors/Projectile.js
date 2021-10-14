import { ECS } from '../core/ECS/ECS.js';

export class Projectile extends ECS.Entity {
  constructor({
    position,
    velocity,
    damage = 20,
    team = 'neutral',
    fillColor = 'cyan'
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position
    })
    .addComponent(ECS.components.kinetic, {
      velocity
    })
    .addComponent(ECS.components.rigidBodyCircle, {
      radius: 4,
      collisionsEnabled: true,
      collisionTypes: ['damaging']
    })
    .addComponent(ECS.components.damaging, {
      damage,
      team
    })
    .addComponent(ECS.components.lifespan, {
      duration: 5
    })
    .addComponent(ECS.components.destroyable)
    .addComponent(ECS.components.renderCircle, {
      radius: 4,
      fillColor,
      layer: -1
    });
  }
}