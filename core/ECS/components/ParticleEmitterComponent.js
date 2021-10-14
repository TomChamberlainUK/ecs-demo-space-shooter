import { Component } from './Component.js';
import { Vector2 } from '../../math/Vector2.js';

export class ParticleEmitterComponent extends Component {
  constructor({
    ParticleEntity = null,
    particleType = null,
    particleDuration = 1,
    particleSpeed = 50,
    particleSpeedMultiplier = 1,
    particleDirection = { x: 0, y: 0 },
    particleDirectionNoise = 0,
    particleRadius = 8,
    emissionRate = 0.1,
    isEmitting = false
  }) {
    super({ name: 'particle-emitter' });
    this.ParticleEntity = ParticleEntity;
    this.particleType = particleType;
    this.particleDuration = particleDuration;
    this.particleSpeed = particleSpeed;
    this.particleSpeedMultiplier = particleSpeedMultiplier;
    this.particleDirection = new Vector2(particleDirection);
    this.particleDirectionNoise = particleDirectionNoise;
    this.particleRadius = particleRadius;
    this.emissionRate = emissionRate;
    this.lastEmitted = null;
    this.isEmitting = isEmitting;
  }
}