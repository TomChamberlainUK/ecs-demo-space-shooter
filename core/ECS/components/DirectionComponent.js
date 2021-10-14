import { Component } from './Component.js';
import { Vector2 } from '../../math/Vector2.js';

export class DirectionComponent extends Component {
  constructor({
    direction,
    start = { x: 0, y: 1 },
    end = { x: 0, y: -1 }
  }) {
    super({ name: 'direction' });
    if (direction) {
      this.direction = new Vector2(direction);
    } else {
      this.direction = new Vector2(end).subtract(new Vector2(start)).getUnit();
    }
  }
}