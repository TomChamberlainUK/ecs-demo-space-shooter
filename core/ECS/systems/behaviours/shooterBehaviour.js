import { Game } from '../../../Game.js';
import { Time } from '../../../Time.js';

export function shooterBehaviour(entity) {

  // Check if shoot command has been received
  const controlled = entity.getComponent('controlled');
  if (controlled.commands.shoot && controlled.commands.target) {

    // Get relevant components
    const transform = entity.getComponent('transform');
    const kinetic = entity.getComponent('kinetic');
    const weapon = entity.getComponent('weapon');

    // Check if weapon cooldown has finished
    if (!weapon.lastFired || Time.checkTimeout(weapon.lastFired, weapon.fireRate)) {
      weapon.lastFired = Time.getTimestamp();

      // Calculate direction
      const direction = controlled.commands.target.subtract(transform.position)
                                                  .getUnit();

      // Spawn new projectile
      Game.getCurrentScene().addEntity(new weapon.ProjectileEntity({
        position: transform.position,
        velocity: direction.multiplyBy(weapon.projectileSpeed).add(kinetic.velocity),
        ...weapon.projectileProps
      }));

    }
  }
}

















// import { Game } from '../../../Game.js';
// import { Time } from '../../../Time.js';
// import { Vector2 } from '../../../math/Vector2.js';

// export function shooterBehaviour(entity) {

//   const { commands } = entity.components['controlled'];
  
//   if (commands['shoot'] && commands['target']) {

//     const { weapon, transform, kinetic } = entity.components;

//     if (!weapon.lastFired || Time.checkTimeout(weapon.lastFired, weapon.fireRate)) {
//       weapon.lastFired = Time.getTimestamp();

//       const target = new Vector2(commands['target']);
//       const direction = target.subtract(transform.position).getUnit();

//       Game.getCurrentScene().addEntity(new weapon.ProjectileEntity({
//         position: transform.position,
//         velocity: direction.multiplyBy(weapon.projectileSpeed).add(kinetic.velocity),
//         ...weapon.projectileProps
//       }));

//     }
//   }
// }