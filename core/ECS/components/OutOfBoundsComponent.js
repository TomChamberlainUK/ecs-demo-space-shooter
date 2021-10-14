import { Component } from './Component.js';

// Prevents collision objects from leaving its bounds
export class OutOfBoundsComponent extends Component {
  constructor({
    width = 1024, // m
    height = 1024 // m
  }) {
    super({ name: 'out-of-bounds' });
    this.width = width;
    this.height = height;
  }
}