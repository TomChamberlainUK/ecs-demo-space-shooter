import { Component } from './Component.js';

export class DamagingComponent extends Component {
  constructor({
    damage = 20,
    team = 'neutral'
  }) {
    super({ name: 'damaging' });
    this.damage = damage;

    this.team = team;
  }
}