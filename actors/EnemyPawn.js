import { ECS } from '../core/ECS/ECS.js';
import { Particle } from './Particle.js';
import { Projectile } from './Projectile.js';
import { ShipDebris } from './ShipDebris.js';
import { SmokeEmitter } from './SmokeEmitter.js';

export class EnemyPawn extends ECS.Entity {
  constructor({
    position,
    scale,
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
      radius: 16,
      restitution: 0.1
    })
    .addComponent(ECS.components.controlled, {
      behaviours: ['mover', 'shooter']
    })
    .addComponent(ECS.components.particleEmitter, {
      ParticleEntity: Particle,
      particleType: 'fire',
      particleSpeed: 25,
      particleDirectionNoise: 15,
      emissionRate: 0.1
    })
    .addComponent(ECS.components.speed, {
      force: 10000,
      boostMultiplier: 1.25
    })
    .addComponent(ECS.components.weapon, {
      ProjectileEntity: Projectile,
      projectileSpeed: 200,
      fireRate: 1,
      projectileProps: {
        fillColor: 'rgb(255,77,77)',
        team: 'enemy'
      }
    })
    .addComponent(ECS.components.damageable, {
      health: 60,
      team: 'enemy'
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
      fillColor: 'rgb(32, 32, 32)',
      strokeColor: 'white'
    });
  }
}