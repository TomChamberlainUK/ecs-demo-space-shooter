export function rotaterBehaviour(_entity) {

  // Ensure entity has all required components
  if (!_entity.hasComponents('transform', 'kinetic', 'rigid-body', 'controlled', 'speed')) return;

  // Get relevant entity components
  const entity = {
    transform: _entity.getComponent('transform'),
    kinetic: _entity.getComponent('kinetic'),
    rigidBody: _entity.getComponent('rigid-body'),
    controlled: _entity.getComponent('controlled'),
    speed: _entity.getComponent('speed'),
  }

  // Get relevant physics data
  const torque = entity.speed.torque;

  // Init acceleration to be added
  let angularAcceleration = 0;

  // Perform commands
  if (entity.controlled.commands['rotate-ccw']) {
    entity.kinetic.angularAcceleration -= torque;
  }
  if (entity.controlled.commands['rotate-cw']) {
    entity.kinetic.angularAcceleration += torque;
  }

  // Update entity acceleration
  entity.kinetic.angularAcceleration += angularAcceleration;
  
}