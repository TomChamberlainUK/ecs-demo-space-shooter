import { Component } from './Component.js';

export class LifespanComponent extends Component {
  constructor({
    duration = 0 // s
  }) {
    super({ name: 'lifespan' });
    this.duration = duration;
    this.start = performance.now();
  }
}