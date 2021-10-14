import { ECS } from '../core/ECS/ECS.js';

import { RockDebris } from './RockDebris.js';
import { SmokeEmitter } from './SmokeEmitter.js';

export class Rock extends ECS.Entity {
  constructor({
    position,
    scale = 1,
    radius = 8,
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position,
      scale
    })
    .addComponent(ECS.components.kinetic)
    .addComponent(ECS.components.rigidBodyCircle, {
      collisionsEnabled: true,
      collisionTypes: ['physics', 'damageable'],
      density: 0.6,
      restitution: 0.1,
      radius
    })
    .addComponent(ECS.components.damageable, {
      health: scale * 20
    })
    .addComponent(ECS.components.destroyable)
    .addComponent(ECS.components.destructable, {
      debrisClasses: [RockDebris, SmokeEmitter],
      debrisCount: 6,
      debrisParameters: {
        radius: 2
      }
    })
    .addComponent(ECS.components.renderCircle, {
      radius,
      fillColor: 'grey'
    });
  }
}