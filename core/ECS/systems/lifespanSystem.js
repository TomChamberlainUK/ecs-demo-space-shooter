import { Time } from '../../Time.js';

export function lifespanSystem(entities) {

  // Loop through valid lifespan entities
  entities.forEach(_entity => {
    if (!_entity.hasComponents('lifespan', 'destroyable')) return;

    // Get relevant entity components
    const entity = {
      destroyable: _entity.getComponent('destroyable'),
      lifespan: _entity.getComponent('lifespan')
    }

    // Set entity to be destroyed if lifespan has expired
    if (Time.checkTimeout(entity.lifespan.start, entity.lifespan.duration)) {
      entity.destroyable.destroy = true;
    }

  });
  
}