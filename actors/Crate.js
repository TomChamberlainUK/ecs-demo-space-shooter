import { ECS } from '../core/ECS/ECS.js';

import { CrateDebris } from './CrateDebris.js';
import { RockDebris } from './RockDebris.js';
import { SmokeEmitter } from './SmokeEmitter.js';
import { Coin } from './Coin.js';

export class Crate extends ECS.Entity {
  constructor({
    position,
    rotation,
    scale,
    width = 32,
    height = 32,
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
      collisionTypes: ['physics', 'damageable'],
      density: 0.3,
      restitution: 0.2,
      staticFriction: 0.2,
      dynamicFriction: 0.3,
      width,
      height
    })
    .addComponent(ECS.components.damageable, {
      health: scale * 20
    })
    .addComponent(ECS.components.destroyable)
    .addComponent(ECS.components.destructable, {
      debrisClasses: [CrateDebris, RockDebris, SmokeEmitter, Coin],
      debrisCount: 6,
      debrisParameters: {
        radius: 2
      }
    })
    .addComponent(ECS.components.renderRectangle, {
      fillColor: 'SaddleBrown',
      width,
      height
    });
  }
}