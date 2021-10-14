import { Component } from './Component.js';
import { Vector2 } from '../../math/Vector2.js';

// Allows the entity to change position, requires transform
export class KineticComponent extends Component {
  constructor({
    velocity = { x: 0, y: 0 }, // m/s^2
    acceleration = { x: 0, y: 0 }, // m/s^3
    angularVelocity = 0, // r/s^2
    angularAcceleration = 0 // r/s^3
  }) {
    super({ name: 'kinetic' });
    this.velocity = new Vector2(velocity);
    this.acceleration = new Vector2(acceleration);
    this.angularVelocity = angularVelocity;
    this.angularAcceleration = angularAcceleration;
  }
}