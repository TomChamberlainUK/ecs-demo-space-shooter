import { Game } from '../../Game.js';
import { getRandomIntInclusive } from '../../utility/random.js';

export function destructableSystem(entities) {

  // Loop through valid destructable entities
  for (const entity of entities) {
    if (!entity.hasComponents('destructable', 'destroyable', 'transform', 'kinetic')) continue;

    const destroyable = entity.getComponent('destroyable');

    // When the entity is marked to be destroyed
    if (destroyable.destroy) {

      const transform = entity.getComponent('transform');
      const kinetic = entity.getComponent('kinetic');
      const destructable = entity.getComponent('destructable');

      const scene = Game.getCurrentScene();

      // Add new debris entities to the scene according to the debris count
      for (let i = 0; i < destructable.debrisCount; i++) {

        const randomClassIndex = getRandomIntInclusive(0, destructable.debrisClasses.length - 1);
        const Debris = destructable.debrisClasses[randomClassIndex];

        const debris = new Debris({
          position: transform.position,
          scale: Math.random() * transform.scale,
          velocity: {
            x: kinetic.velocity.x + getRandomIntInclusive(-100, 100),
            y: kinetic.velocity.y + getRandomIntInclusive(-100, 100)
          },
          angularVelocity: getRandomIntInclusive(-10, 10),
          ...destructable.debrisParameters
        });

        scene.addEntity(debris);
      }
    }

  }
}