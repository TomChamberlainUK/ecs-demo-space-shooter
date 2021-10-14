import { Component } from './Component.js';

export class ParticleComponent extends Component {
  constructor({
    type = null,
    radius = 8
  }) {
    super({ name: 'particle' });
    this.type = type;
    this.radius = radius;
  }
}