import { Component } from './Component.js';

export class DestructableComponent extends Component {
  constructor({
    debrisClasses = [],
    debrisCount = 4,
    debrisParameters = {}
  }) {
    super({ name: 'destructable' });
    this.debrisClasses = debrisClasses;
    this.debrisCount = debrisCount;
    this.debrisParameters = debrisParameters;
  }
}