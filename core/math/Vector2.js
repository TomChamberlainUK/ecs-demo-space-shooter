export class Vector2 {
  constructor({ x = 0, y = 0 }) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    return new Vector2({
      x: this.x + vector.x,
      y: this.y + vector.y
    });
  }

  subtract(vector) {
    return new Vector2({
      x: this.x - vector.x,
      y: this.y - vector.y
    });
  }

  multiplyBy(multiplier) {
    return new Vector2({
      x: this.x * multiplier,
      y: this.y * multiplier
    });
  }

  divideBy(divider) {
    return new Vector2({
      x: this.x / divider,
      y: this.y / divider
    });
  }

  getNormal() {
    return new Vector2({ x: -this.y, y: this.x });
  }

  getUnit() { // poor performance
    const length = this.getLength();
    if (length === 0) return new Vector2({ x: 0, y: 0 }) // prevent division by zero
    else return this.divideBy(length);
  }

  getUnitNormal() { // poor performance
    return this.getNormal().getUnit();
  }

  getLength() { // poor performance
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  getLengthSquared() { // save performance when measuring if a^2 + b^2 === c^2
    return this.x * this.x + this.y * this.y;
  }

  static dot(vectorA, vectorB) {
    return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
  }

  static cross(vectorA, vectorB) {
    return vectorA.x * vectorB.y - vectorA.y * vectorB.x
  }
}