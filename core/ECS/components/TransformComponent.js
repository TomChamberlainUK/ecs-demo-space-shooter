import { Component } from './Component.js';
import { Vector2 } from '../../math/Vector2.js';

export class TransformComponent extends Component {
  constructor({
    position = { x: 0, y: 0 },
    rotation = 0,
    scale = 1
  }) {
    super({ name: 'transform' });
    this.position = new Vector2(position);
    this.rotation = rotation;
    this.scale = scale;
    // For linear interpolation
    this.previousPosition = new Vector2(position);
    this.previousRotation = new Vector2(rotation);
    this.previousScale = scale;
  }
}