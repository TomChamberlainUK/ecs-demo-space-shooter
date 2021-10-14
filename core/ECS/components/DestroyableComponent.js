import { Component } from './Component.js';

export class DestroyableComponent extends Component {
  constructor() {
    super({ name: 'destroyable' });
    this.destroy = false;
  }
}