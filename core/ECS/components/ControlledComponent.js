import { Component } from './Component.js';

// Indicates an entity will receive input
export class ControlledComponent extends Component {
  constructor({
    behaviours = [] // eg. mover, shooter, etc.
  }) {
    super({ name: 'controlled' });
    this.behaviours = behaviours;
    this.commands = {}; // These are set 
  }
}
