import { ECS } from '../core/ECS/ECS.js';
import { Projectile } from './Projectile.js'

export class PlatformerPawn extends ECS.Entity {
  constructor({
    position,
    rotation,
    scale,
    width = 90,
    height = 180, // 1.8 meters
    speedForce = 100000,
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
      restitution: 0,
      width,
      height
    })
    .addComponent(ECS.components.controlled, {
      behaviours: ['platformer', 'shooter']
    })
    .addComponent(ECS.components.weapon, {
      ProjectileEntity: Projectile
    })
    .addComponent(ECS.components.speed, {
      force: speedForce,
      boostMultiplier: 1.25
    })
    .addComponent(ECS.components.renderRectangle, {
      fillColor: 'white',
      width,
      height
    })
    .addComponent(ECS.components.debug, {
      transform: true,
      kinetic: true
    });
  }
}