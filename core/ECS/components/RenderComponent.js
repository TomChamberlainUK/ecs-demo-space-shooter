import { Component } from './Component.js';
import { Vector2 } from '../../math/Vector2.js';

class RenderComponent extends Component {
  constructor({
    type = null,
    layer = 0
  }) {
    super({ name: 'render' });
    this.type = type;
    this.layer = layer;
  }
}

class RenderGeometryComponent extends RenderComponent {
  constructor({
    shape = null,
    fillColor = null,
    strokeColor = null,
    ...args
  }) {
    super({
      type: 'geometry',
      ...args
    });
    this.shape = shape;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
  }
}

export class RenderCircleComponent extends RenderGeometryComponent {
  constructor({
    radius = 16, // m
    ...args
  }) {
    super({
      shape: 'circle',
      ...args
    });
    this.radius = radius;

    // Find furthest posible length from center for render culling
    this.renderRadius = this.radius;
  }
}

export class RenderCapsuleComponent extends RenderGeometryComponent {
  constructor({
    renderDirection = false,
    radius = 16, // m
    length = 32, // m
    ...args
  }) {
    super({
      shape: 'capsule',
      ...args
    });
    this.radius = radius;
    this.length = length;
    this.start = new Vector2({ x: 0, y: length / 2 });
    this.end = new Vector2({ x: 0, y: -length / 2 });
    this.direction = this.end.subtract(this.start).getUnit();
    this.angle = Math.acos(Vector2.dot(this.direction, new Vector2({ x: 1, y: 0 })));
    if (Vector2.cross(this.direction, new Vector2({ x: 1, y: 0 })) > 0) {
      this.angle *= -1;
    }
    // Renderer system will render a line to indicate direction
    this.renderDirection = renderDirection;

    // Find furthest posible length from center for render culling
    this.renderRadius = this.length / 2 + this.radius;
  }
}

export class RenderLineComponent extends RenderGeometryComponent {
  constructor({
    length = 32, // m
    ...args
  }) {
    super({
      shape: 'line',
      ...args
    });
    this.length = length;
    this.start = new Vector2({ x: 0, y: -length / 2 });
    this.end = new Vector2({ x: 0, y: length / 2 });
    this.direction = this.end.subtract(this.start).getUnit();

    // Find furthest posible length from center for render culling
    this.renderRadius = this.length / 2;
  }
}

export class RenderRectangleComponent extends RenderGeometryComponent {
  constructor({
    width = 16, // m
    height = 16, // m
    ...args
  }) {
    super({
      shape: 'rectangle',
      ...args
    });
    this.width = width;
    this.height = height;

    // Find furthest posible length from center for render culling
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    this.renderRadius = Math.sqrt((halfWidth * halfWidth) + (halfHeight * halfHeight));
  }
}