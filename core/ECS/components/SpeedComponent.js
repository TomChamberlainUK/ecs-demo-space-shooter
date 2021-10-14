import { Component } from './Component.js';

export class SpeedComponent extends Component {
  constructor({
    force = 1000,
    torque = 24000,
    boostMultiplier = 1.25
  }) {
    super({ name: 'speed' });
    this.force = force;
    this.torque = torque;
    this.boostMultiplier = boostMultiplier;
  }
}