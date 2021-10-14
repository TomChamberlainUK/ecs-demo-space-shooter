import { Component } from './Component.js';

export class DamageableComponent extends Component {
  constructor({
    health = 100,
    team = 'neutral'
  }) {
    super({ name: 'damageable' });
    this.maxHealth = health;
    this.health = health;

    this.team = team;
  }
}