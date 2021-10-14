import { moverBehaviour } from './behaviours/moverBehaviour.js';
import { shooterBehaviour } from './behaviours/shooterBehaviour.js';
import { steererBehaviour } from './behaviours/steererBehaviour.js';
import { rotaterBehaviour } from './behaviours/rotaterBehaviour.js';
import { platformerBehaviour } from './behaviours/platformerBehaviour.js';

export function controlledEntitiesSystem(entities) {

  // Loop through valid controller entities
  entities.forEach(_entity => {
    if (!_entity.hasComponent('controlled')) return;

    // Get relevant components
    const entity = {
      controlled: _entity.getComponent('controlled')
    }
    
    // Check entity behaviours and apply behaviour systems as applicable
    if (entity.controlled.behaviours.includes('mover')) {
      moverBehaviour(_entity);
    }
    if (entity.controlled.behaviours.includes('steerer')) {
      steererBehaviour(_entity);
    }
    if (entity.controlled.behaviours.includes('shooter')) {
      shooterBehaviour(_entity);
    }

    if (entity.controlled.behaviours.includes('platformer')) {
      platformerBehaviour(_entity);
    }
    if (entity.controlled.behaviours.includes('rotater')) {
      rotaterBehaviour(_entity);
    }
    
  });

}