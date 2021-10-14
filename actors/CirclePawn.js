import { ECS } from '../core/ECS/ECS.js';
import { Particle } from './Particle.js';
import { Projectile } from './Projectile.js';
import { ShipDebris } from './ShipDebris.js';
import { SmokeEmitter } from './SmokeEmitter.js';

export class CirclePawn extends ECS.Entity {
  constructor({
    position,
    scale,
    fillColor = 'white',
    strokeColor,
    speedForce = 100000
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position,
      scale
    })
    .addComponent(ECS.components.kinetic)
    .addComponent(ECS.components.rigidBodyCircle, {
      collisionsEnabled: true,
      collisionTypes: ['physics', 'pickupper', 'damageable'],
      radius: 16,
      restitution: 0.1
    })
    .addComponent(ECS.components.controlled, {
      behaviours: ['mover', 'shooter']
    })
    .addComponent(ECS.components.particleEmitter, {
      ParticleEntity: Particle,
      particleType: 'fire',
      particleSpeed: 0,
      particleDirectionNoise: 15,
      emissionRate: 0.1
    })
    .addComponent(ECS.components.speed, {
      force: speedForce,
      boostMultiplier: 1.25
    })
    .addComponent(ECS.components.weapon, {
      ProjectileEntity: Projectile,
      projectileProps: {
        fillColor: 'cyan',
        team: 'allied'
      }
    })
    .addComponent(ECS.components.damageable, {
      health: 100,
      team: 'allied'
    })
    .addComponent(ECS.components.destroyable)
    .addComponent(ECS.components.destructable, {
      debrisClasses: [ShipDebris, SmokeEmitter],
      debrisCount: 6,
      debrisParameters: {
        radius: 2
      }
    })
    .addComponent(ECS.components.renderCircle, {
      radius: 16,
      fillColor,
      strokeColor
    })
    .addComponent(ECS.components.debug, {
      // transform: true,
      // kinetic: true,
      damageable: true
    });
  }
}