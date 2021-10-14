import { Time } from '../../Time.js';

export function particleSystem(entities) {

  // Loop through relevant entities
  for (const entity of entities) {
    if (!entity.hasComponents('transform', 'particle', 'lifespan', 'render')) continue;

    // Get relevant components
    const transform = entity.getComponent('transform');
    const particle = entity.getComponent('particle');
    const lifespan = entity.getComponent('lifespan');
    const render = entity.getComponent('render');

    // Handle each particle type
    switch (particle.type) {
      case 'fire': {
        // set render color and size based on time
        const elapsedTime = Time.checkTimeSince(lifespan.start);
        const lifespanAlpha = elapsedTime / lifespan.duration;

        const r = 255 * (1 - lifespanAlpha);
        const g = 255 * (1 - lifespanAlpha * 2);
        const b = 255 * (1 - lifespanAlpha * 8);
        const a = 1;

        const radius = Math.max(particle.radius * (1 - lifespanAlpha), 0);

        render.fillColor = `rgba(${r},${g},${b},${a})`;
        render.radius = radius * transform.scale;

        break;
      }

      case 'nitros': {
        // set render color and size based on time
        const elapsedTime = Time.checkTimeSince(lifespan.start);
        const lifespanAlpha = elapsedTime / lifespan.duration;

        const r = 255 * (1 - lifespanAlpha * 8);
        const g = 255 * (1 - lifespanAlpha);
        const b = 255 * (1 - lifespanAlpha * 2);
        const a = 1;

        const radius = Math.max(particle.radius * (1 - lifespanAlpha), 0);

        render.fillColor = `rgba(${r},${g},${b},${a})`;
        render.radius = radius * transform.scale;

        break;
      }

      case 'blue-fire': {
        // set render color and size based on time
        const elapsedTime = Time.checkTimeSince(lifespan.start);
        const lifespanAlpha = elapsedTime / lifespan.duration;

        const r = 255 * (1 - lifespanAlpha * 8);
        const g = 255 * (1 - lifespanAlpha * 2);
        const b = 255 * (1 - lifespanAlpha);
        const a = 1;

        const radius = Math.max(particle.radius * (1 - lifespanAlpha), 0);

        render.fillColor = `rgba(${r},${g},${b},${a})`;
        render.radius = radius * transform.scale;

        break;
      }

      case 'smoke': {
        // set render color and size based on time
        const elapsedTime = Time.checkTimeSince(lifespan.start);
        const lifespanAlpha = elapsedTime / lifespan.duration;

        const r = 255 * (1 - lifespanAlpha);
        const g = 255 * (1 - lifespanAlpha);
        const b = 255 * (1 - lifespanAlpha);
        const a = 0.5 * (1 - lifespanAlpha);

        const radius = Math.max(particle.radius * (1 - lifespanAlpha / 4), 0);

        render.fillColor = `rgba(${r},${g},${b},${a})`;
        render.radius = radius * transform.scale;

        break;
      }
    }

  }

}