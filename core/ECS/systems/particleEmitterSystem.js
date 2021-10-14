import { Game } from '../../Game.js';
import { Time } from '../../Time.js';
import { Vector2 } from '../../math/Vector2.js';
import { getRandomArbitrary } from '../../utility/random.js';

export function particleEmitterSystem(entities) {

  // Loop through valid components
  for (const entity of entities) {
    if (!entity.hasComponents('transform', 'particle-emitter')) continue;

    // Get relevant components
    const transform = entity.getComponent('transform');
    const particleEmitter = entity.getComponent('particle-emitter');

    if (particleEmitter.isEmitting) {

      // Check if particle emitter is ready to emit
      if (!particleEmitter.lastEmitted || Time.checkTimeout(particleEmitter.lastEmitted, particleEmitter.emissionRate)) {
        particleEmitter.lastEmitted = Time.getTimestamp();

        // The scene is required to spawn/generate particles
        const scene = Game.getCurrentScene();

        let velocity = particleEmitter.particleDirection.multiplyBy(particleEmitter.particleSpeed * particleEmitter.particleSpeedMultiplier);

        // If the entity is kinetic, pass velocity to particles
        if (entity.hasComponent('kinetic')) {
          const kinetic = entity.getComponent('kinetic');
          velocity = velocity.add(kinetic.velocity);
        }

        // Create random noise for particle direction vector
        const directionNoise = new Vector2({
          x: getRandomArbitrary(-particleEmitter.particleDirectionNoise, particleEmitter.particleDirectionNoise),
          y: getRandomArbitrary(-particleEmitter.particleDirectionNoise, particleEmitter.particleDirectionNoise)
        });

        // Add a particle to the scene
        scene.addEntity(new particleEmitter.ParticleEntity({
          position: transform.position,
          scale: transform.scale,
          velocity: velocity.add(directionNoise),
          duration: particleEmitter.particleDuration,
          type: particleEmitter.particleType
        }));

      }

    }

  }

}