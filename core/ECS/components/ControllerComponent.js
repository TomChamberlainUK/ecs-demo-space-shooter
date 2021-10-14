import { Component } from './Component.js';

export class ControllerComponent extends Component {
  constructor({
    defaultPawn = null,
    pawn = null,
    camera = null,
    behaviours = [] // eg. mover, shooter, etc.
  }) {
    super({ name: 'controller' });
    this.defaultPawn = defaultPawn;
    this.pawn = pawn;
    this.camera = camera;
    this.behaviours = behaviours;
  }
}