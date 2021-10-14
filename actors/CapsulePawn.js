import { ECS } from '../core/ECS/ECS.js';
import { Projectile } from './Projectile.js';
import { Particle } from './Particle.js';

export class CapsulePawn extends ECS.Entity {
  constructor({
    position,
    rotation,
    scale,
    radius = 16,
    length = 32,
    renderDirection = false
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position,
      rotation,
      scale,
    })
    .addComponent(ECS.components.kinetic)
    .addComponent(ECS.components.rigidBodyCapsule, {
      collisionsEnabled: true,
      collisionTypes: ['physics', 'pickupper','damageable'],
      radius,
      length,
      restitution: 0.1,
      // density: 0.8,
      staticFriction: 0.3,
      dynamicFriction: 0.3
    })
    .addComponent(ECS.components.controlled, {
      behaviours: ['steerer', 'shooter']
    })
    .addComponent(ECS.components.speed, {
      force: 100000,
      // torque: 600000,
      torque: 1200000,
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
    .addComponent(ECS.components.particleEmitter, {
      ParticleEntity: Particle,
      particleType: 'fire',
      particleDirectionNoise: 15,
      emissionRate: 0.1
    })
    .addComponent(ECS.components.direction)
    .addComponent(ECS.components.renderCapsule, {
      renderDirection,
      radius,
      length,
      strokeColor: 'black',
      fillColor: 'white'
    })
    .addComponent(ECS.components.debug, {
      transform: true,
      kinetic: true
    });
  }
}