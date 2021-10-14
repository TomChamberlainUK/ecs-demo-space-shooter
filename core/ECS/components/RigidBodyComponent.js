import { Component } from './Component.js';
import { Vector2 } from '../../math/Vector2.js';

class Collider {
  constructor({
    shape = '',
    position = { x: 0, y: 0 },
    scale = 1,
    rotation = 0
  }) {
    this.shape = shape;
    this.vertices = [];
    this.transform = {
      position: new Vector2(position),
      scale,
      rotation
    }
  }
}

class LineCollider extends Collider {
  constructor({
    length = 32,
    ...args
  }) {
    super({
      shape: 'line',
      ...args
    });
    this.length = length;
    this.start = new Vector2({ x: 0, y: -length / 2 });
    this.end = new Vector2({ x: 0, y: length / 2 });
    this.vertices = [this.start, this.end];
    this.direction = this.end.subtract(this.start).getUnit();
  }
}

class RectangleCollider extends Collider {
  constructor({
    width = 16,
    height = 16,
    ...args
  }) {
    super({
      shape: 'rectangle',
      ...args
    });
    this.width = width;
    this.height = height;
    this.min = new Vector2({
      x: -this.width / 2,
      y: -this.height / 2
    });
    this.max = new Vector2({
      x: this.width / 2,
      y: this.height / 2
    });
    this.vertices = [
      new Vector2({ x: this.min.x, y: this.min.y }),
      new Vector2({ x: this.max.x, y: this.min.y }),
      new Vector2({ x: this.min.x, y: this.max.y }),
      new Vector2({ x: this.max.x, y: this.max.y })
    ];
    this.direction = this.vertices[0].subtract(this.vertices[1]).getUnit();
  }
}

class CircleCollider extends Collider {
  constructor({
    radius = 16,
    ...args
  }) {
    super({
      shape: 'circle',
      ...args
    });
    this.radius = radius;
    this.direction = new Vector2({ x: 0, y: -radius }).getUnit();
  }
}


class RigidBodyComponent extends Component {
  constructor({
    colliders = [],
    collisionsEnabled = false,
    collisionTypes = [],
    density = 0.3,
    restitution = 0.8,
    staticFriction = 0.5,
    dynamicFriction = 0.5
  }) {
    super({ name: 'rigid-body'});
    this.colliders = colliders;
    this.collisionsEnabled = collisionsEnabled;
    this.collisionTypes = collisionTypes;
    this.density = density;
    this.restitution = restitution;
    this.staticFriction = staticFriction;
    this.dynamicFriction = dynamicFriction;
  }
}

export class RigidBodyCircleComponent extends RigidBodyComponent {
  constructor({
    radius = 16,
    ...args
  }) {
    super({
      colliders: [new CircleCollider({ radius })],
      ...args
    });
    this.area = Math.PI * radius * radius;
    if (this.density === 0) {
      this.mass = 0;
      this.inverseMass = 0;
      this.inertia = 0;
      this.inverseInertia = 0;
    } else {
      this.mass = this.area * this.density;
      this.inverseMass = 1 / this.mass;
      this.inertia = 0.5 * this.mass * radius * radius;
      this.inverseInertia = 1 / this.inertia;
    }
  }
}

export class RigidBodyLineComponent extends RigidBodyComponent {
  constructor({
    length = 32,
    ...args
  }) {
    super({
      colliders: [new LineCollider({ length })],
      ...args
    });
    this.area = this.length;
    if (this.density === 0) {
      this.mass = 0;
      this.inverseMass = 0;
      this.inertia = 0;
      this.inverseInertia = 0;
    } else {
      this.mass = this.area * this.density;
      this.inverseMass = 1 / this.mass;
      this.inertia = this.mass + (length * length) / 12;
      this.inverseInertia = 1 / this.inertia;
    }
  }

}

export class RigidBodyRectangleComponent extends RigidBodyComponent {
  constructor({
    width = 16,
    height = 16,
    ...args
  }) {
    super({
      colliders: [new RectangleCollider({ width, height })],
      ...args
    });
    this.area = width * height;
    if (this.density === 0) {
      this.mass = 0;
      this.inverseMass = 0;
      this.inertia = 0;
      this.inverseInertia = 0;
    } else {
      this.mass = this.area * this.density;
      this.inverseMass = 1 / this.mass;
      this.inertia = this.mass * (width * width + height * height) / 12;
      this.inverseInertia = 1 / this.inertia;
    }
  }
}

export class RigidBodyCapsuleComponent extends RigidBodyComponent {
  constructor({
    radius = 16,
    length = 32,
    ...args
  }) {
    super({
      colliders: [
        new RectangleCollider({
          width: radius * 2,
          height: length
        }),
        new CircleCollider({
          radius,
          position: {
            x: 0,
            y: -length / 2
          }
        }),
        new CircleCollider({
          radius,
          position: {
            x: 0,
            y: length / 2
          }
        })
      ],
      ...args
    });
    this.area = Math.PI * radius * radius + length * radius * 2;
    if (this.density === 0) {
      this.mass = 0;
      this.inverseMass = 0;
      this.inertia = 0;
      this.inverseInertia = 0;
    } else {
      this.mass = this.area * this.density;
      this.inverseMass = 1 / this.mass;
      this.inertia = this.mass * ((radius * 2) * (radius * 2) + (length + radius * 2) * (length + radius * 2)) / 12; // This is the rectangular calculation - calculate capsule inertia
      this.inverseInertia = 1 / this.inertia;
    }
  }
}