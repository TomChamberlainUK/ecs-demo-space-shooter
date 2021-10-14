import { Component } from './Component.js';

export class WeaponComponent extends Component {
  constructor({
    ProjectileEntity = null, // Class or constructor for projectile entity emitted
    projectileProps = {}, // Properties to pass to new instances of projectile entity class
    projectileSpeed = 400, // Affects initial velocity
    fireRate = 0.5 // Frequency that projectiles are emitted (seconds)
  }) {
    super({ name: 'weapon' });
    this.ProjectileEntity = ProjectileEntity;
    this.projectileProps = projectileProps;
    this.projectileSpeed = projectileSpeed;
    this.fireRate = fireRate;
    this.lastFired = null;
  }
}