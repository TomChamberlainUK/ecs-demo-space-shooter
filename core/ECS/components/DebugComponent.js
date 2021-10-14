import { Component } from './Component.js';

// Currently just labels entity to be tracked by debug renderer 
export class DebugComponent extends Component {
  constructor({
    transform = false,
    kinetic = false,
    rigidBody = false,
    controller = false,
    speed = false,
    weapon = false,
    damageable = false
  }) {
    super ({ name: 'debug' });
    this.transform = transform;
    this.kinetic = kinetic;
    this.rigidBody = rigidBody;
    this.controller = controller;
    this.speed = speed;
    this.weapon = weapon;
    this.damageable = damageable;
  }
}