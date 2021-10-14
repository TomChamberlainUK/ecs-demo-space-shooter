import { ECS } from '../core/ECS/ECS.js';
import { Particle } from './Particle.js';

export class SmokeEmitter extends ECS.Entity {
  constructor({
    position,
    scale
  }) {
    super()
    .addComponent(ECS.components.transform, {
      position,
      scale
    })
    .addComponent(ECS.components.particleEmitter, {
      ParticleEntity: Particle,
      particleType: 'smoke',
      particleDuration: 0.5,
      particleDirectionNoise: 25,
      particleRadius: 6,
      emissionRate: 0.2,
      isEmitting: true
    })
    .addComponent(ECS.components.lifespan, {
      duration: 0.125
    })
    .addComponent(ECS.components.destroyable)
    .addComponent(ECS.components.debug, {
      kinetic: true
    });
  }
}