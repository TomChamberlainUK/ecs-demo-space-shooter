import { Vector2 } from './Vector2.js';

// 3x3 matrix
// export class TFMatrix3 {
//   constructor(data = [
//     1, 0, 0,
//     0, 1, 0,
//     0, 0, 1
//   ]) {
//     this.data = data;
//   }

//   multiplyVector(vector) {
//     return multiplyMatrix3AndVector2(this, vector);
//   }

//   scale(amount) {
//     return multiplyMatrices3(new TFScaleMatrix3(amount), this);
//   }

//   rotate(radian) {
//     return multiplyMatrices3(new TFRotationMatrix3(radian), this);
//   }

//   translate({ x, y }) {
//     return multiplyMatrices3(new TFTranslationMatrix3({ x, y }), this);
//   }
// }

// export class TFTranslationMatrix3 extends TFMatrix3 {
//   constructor({ x = 0, y = 0 }) {
//     super([
//       1, 0, 0,
//       0, 1, 0,
//       x, y, 1
//     ]);
//   }
// }

// export class TFRotationMatrix3 extends TFMatrix3 {
//   constructor(angle = 0) {
//     super([
//       Math.cos(angle),  Math.sin(angle),  0,
//       -Math.sin(angle), Math.cos(angle),  0,
//       0,                0,                1
//     ]);
//   }
// }

// export class TFScaleMatrix3 extends TFMatrix3 {
//   constructor(amount = 1) {
//     super([
//       amount, 0,      0,
//       0,      amount, 0,
//       0,      0,      1
//     ]);
//   }
// }


// 2D matrix - a 3x2 matrix optimised for 2D calculations
class TFMatrix2D {
  constructor(data = [
    1, 0,
    0, 1,
    0, 0,
  ]) {
    this.data = new Float64Array(data);
  }

  reset(
    a = 1, b = 0,
    c = 0, d = 1,
    e = 0, f = 0
  ) {
    this.data[0] = a;
    this.data[1] = b;
    this.data[2] = c;
    this.data[3] = d;
    this.data[4] = e;
    this.data[5] = f;
  }

  release() {
    tfMatrix2DPool.push(this);
  }
  
  clone(matrix2D) {
    this.data[0] = matrix2D.data[0];
    this.data[1] = matrix2D.data[1];
    this.data[2] = matrix2D.data[2];
    this.data[3] = matrix2D.data[3];
    this.data[4] = matrix2D.data[4];
    this.data[5] = matrix2D.data[5];
  }

  multiplyVector(vector) {
    return multiplyMatrix2DAndVector2(this, vector);
  }

  scale(amount) {
    return multiplyMatrices2D(getTFScaleMatrix2D(amount), this);
  }

  rotate(radian) {
    return multiplyMatrices2D(getTFRotationMatrix2D(radian), this);
  }

  translate({ x, y }) {
    return multiplyMatrices2D(getTFTranslationMatrix2D({ x, y }), this);
  }
}

// 2x2 matrix
export class TFMatrix2 {
  constructor(data = [
    1, 0,
    0, 1
  ]) {
    this.data = new Float64Array(data);
  }

  reset(
    a = 1, b = 0,
    c = 0, d = 1
  ) {
    this.data[0] = a;
    this.data[1] = b;
    this.data[2] = c;
    this.data[3] = d;
  }

  release() {
    tfMatrix2Pool.push(this);
  }

  multiplyVector(vector) {
    return multiplyMatrix2AndVector2(this, vector);
  }

  scale(amount) {
    return multiplyMatrices2(new TFScaleMatrix2(amount), this);
  }

  rotate(radian) {
    return multiplyMatrices2(new TFRotationMatrix2(radian), this);
  }
}

// Init static memory pools
const tfMatrix2DPool = [];
for (let i = 0; i < 100; i++) {
  tfMatrix2DPool.push(new TFMatrix2D());
}

const tfMatrix2Pool = [];
for (let i = 0; i < 2; i++) {
  tfMatrix2Pool.push(new TFMatrix2());
}

// 2D Matrix - a 3x2 matrix optimised for 2D calculations
export function getNewMatrix2D(
  a = 1, b = 0,
  c = 0, d = 1,
  e = 0, f = 0
) {
  const matrix = tfMatrix2DPool.pop();

  if (matrix !== undefined) {

    matrix.reset(a, b, c, d, e, f);
    return matrix;

  } else {
    console.warn('No matrix available');
  }
}

export function getTFMatrix2D() {
  return getNewMatrix2D(
    1, 0,
    0, 1,
    0, 0
  );
}

export function getTFTranslationMatrix2D({ x = 0, y = 0 }) {
  return getNewMatrix2D(
    1, 0,
    0, 1,
    x, y
  );
}

export function getTFRotationMatrix2D(angle = 0) {
  return getNewMatrix2D(
    Math.cos(angle),  Math.sin(angle),
    -Math.sin(angle), Math.cos(angle),
    0,                0
  );
}

export function getTFScaleMatrix2D(amount = 1) {
  return getNewMatrix2D(
    amount, 0,
    0,      amount,
    0,      0
  );
}


// 2x2
export function getNewMatrix2(
  a = 1, b = 0,
  c = 0, d = 1
) {
  const matrix = tfMatrix2Pool.pop();

  if (matrix !== undefined) {

    matrix.reset(a, b, c, d);
    return matrix;

  } else {
    console.warn('No matrix available');
  }
}

export function getTFMatrix2() {
  return getNewMatrix2(
    1, 0,
    0, 1
  );
}

export function getTFRotationMatrix2(angle = 0) {
  return getNewMatrix2(
    Math.cos(angle),  Math.sin(angle),
    -Math.sin(angle), Math.cos(angle)
  );
}

export function getTFScaleMatrix2(amount = 1) {
  return getNewMatrix2(
    amount, 0,
    0,      amount
  );
}

// Matrices multiplication
// function multiplyMatrices3(matrixA, matrixB) {

//   return new TFMatrix3([
//     // column 0
//     (matrixA.data[0] * matrixB.data[0]) + (matrixA.data[3] * matrixB.data[1]) + (matrixA.data[6] * matrixB.data[2]),
//     (matrixA.data[1] * matrixB.data[0]) + (matrixA.data[4] * matrixB.data[1]) + (matrixA.data[7] * matrixB.data[2]),
//     (matrixA.data[2] * matrixB.data[0]) + (matrixA.data[5] * matrixB.data[1]) + (matrixA.data[8] * matrixB.data[2]),
//     // column 1
//     (matrixA.data[0] * matrixB.data[3]) + (matrixA.data[3] * matrixB.data[4]) + (matrixA.data[6] * matrixB.data[5]),
//     (matrixA.data[1] * matrixB.data[3]) + (matrixA.data[4] * matrixB.data[4]) + (matrixA.data[7] * matrixB.data[5]),
//     (matrixA.data[2] * matrixB.data[3]) + (matrixA.data[5] * matrixB.data[4]) + (matrixA.data[8] * matrixB.data[5]),
//     // column 2
//     (matrixA.data[0] * matrixB.data[6]) + (matrixA.data[3] * matrixB.data[7]) + (matrixA.data[6] * matrixB.data[8]),
//     (matrixA.data[1] * matrixB.data[6]) + (matrixA.data[4] * matrixB.data[7]) + (matrixA.data[7] * matrixB.data[8]),
//     (matrixA.data[2] * matrixB.data[6]) + (matrixA.data[5] * matrixB.data[7]) + (matrixA.data[8] * matrixB.data[8]),
//   ]);

// }

function multiplyMatrices2D(matrixA, matrixB) {

  // Cache relevant values
  const a0 = matrixA.data[0],
    a1 = matrixA.data[1],
    a2 = matrixA.data[2],
    a3 = matrixA.data[3],
    a4 = matrixA.data[4],
    a5 = matrixA.data[5],
    b0 = matrixB.data[0],
    b1 = matrixB.data[1],
    b2 = matrixB.data[2],
    b3 = matrixB.data[3],
    b4 = matrixB.data[4],
    b5 = matrixB.data[5];

  const newMatrix = getNewMatrix2D(
    // column 0
    (a0 * b0) + (a2 * b1),
    (a1 * b0) + (a3 * b1),
    // column 1
    (a0 * b2) + (a2 * b3),
    (a1 * b2) + (a3 * b3),
    // column 2
    (a0 * b4) + (a2 * b5) + a4,
    (a1 * b4) + (a3 * b5) + a5
  );

  matrixA.release();
  matrixB.release();

  return newMatrix;

}

function multiplyMatrices2(matrixA, matrixB) {

  // Cache relevant values
  const a0 = matrixA.data[0],
    a1 = matrixA.data[1],
    a2 = matrixA.data[2],
    a3 = matrixA.data[3],
    b0 = matrixB.data[0],
    b1 = matrixB.data[1],
    b2 = matrixB.data[2],
    b3 = matrixB.data[3];

  const newMatrix = getNewMatrix2([
    // column 0
    (a0 * b0) + (a2 * b1),
    (a1 * b0) + (a3 * b1),
    // column 1
    (a0 * b2) + (a2 * b3),
    (a1 * b2) + (a3 * b3),
  ]);

  matrixA.release();
  matrixB.release();

  return newMatrix;

}

// Matrix vector multiplication
function multiplyMatrix3AndVector2(matrix, vector) {

  return new Vector2({
    x: (vector.x * matrix.data[0]) + (vector.y * matrix.data[3]) + matrix.data[6], 
    y: (vector.x * matrix.data[1]) + (vector.y * matrix.data[4]) + matrix.data[7] 
  });

}

function multiplyMatrix2DAndVector2(matrix, vector) {

  return new Vector2({
    x: (vector.x * matrix.data[0]) + (vector.y * matrix.data[2]) + matrix.data[4], 
    y: (vector.x * matrix.data[1]) + (vector.y * matrix.data[3]) + matrix.data[5] 
  });

}

function multiplyMatrix2AndVector2(matrix, vector) {

  return new Vector2({
    x: (vector.x * matrix.data[0]) + (vector.y * matrix.data[2]),
    y: (vector.x * matrix.data[1]) + (vector.y * matrix.data[3])
  });

}















// import { Vector2 } from './Vector2.js';

// const pool = [];

// export function getNewMatrix3(data = [
//   1, 0, 0,
//   0, 1, 0,
//   0, 0, 1
// ]) {
//   const matrix = pool.pop();

//   if (matrix !== undefined) {

//     matrix.reset(data);
//     return matrix;

//   } else {

//     console.warn('No matrix available');

//   }

// }

// export function getTFMatrix3() {
//   const matrix = pool.pop();

//   if (matrix !== undefined) {

//     matrix.reset([
//       1, 0, 0,
//       0, 1, 0,
//       0, 0, 1
//     ]);
//     return matrix;

//   } else {

//     console.warn('No matrix available');

//   }

// }

// export function getTFTranslationMatrix3({ x = 0, y = 0 }) {
//   const matrix = pool.pop();

//   if (matrix !== undefined) {

//     matrix.reset([
//       1, 0, 0,
//       0, 1, 0,
//       x, y, 1
//     ]);
//     return matrix;

//   } else {

//     console.warn('No matrix available');

//   }

// }

// export function getTFRotationMatrix3(angle = 0) {
//   const matrix = pool.pop();

//   if (matrix !== undefined) {

//     matrix.reset([
//       Math.cos(angle),  Math.sin(angle),  0,
//       -Math.sin(angle), Math.cos(angle),  0,
//       0,                0,                1
//     ]);
//     return matrix;

//   } else {

//     console.warn('No matrix available');

//   }

// }

// export function getTFScaleMatrix3(amount = 1) {
//   const matrix = pool.pop();

//   if (matrix !== undefined) {

//     matrix.reset([
//       amount, 0,      0,
//       0,      amount, 0,
//       0,      0,      1
//     ]);
//     return matrix;

//   } else {

//     console.warn('No matrix available');

//   }

// }



// export class TFMatrix3 {
//   constructor(data = [
//     1, 0, 0,
//     0, 1, 0,
//     0, 0, 1
//   ]) {
//     this.data = data;
//   }

//   reset(data = [
//     1, 0, 0,
//     0, 1, 0,
//     0, 0, 1
//   ]) {
//     this.data = data;
//   }

//   release() {
//     pool.push(this);
//   }

//   multiplyVector(vector) {
//     return multiplyMatrixAndVector(this, vector);
//   }

//   scale(amount) {
//     return multiplyMatrices(getTFScaleMatrix3(amount), this);
//   }

//   rotate(radian) {
//     return multiplyMatrices(getTFRotationMatrix3(radian), this);
//   }

//   translate({ x, y }) {
//     return multiplyMatrices(getTFTranslationMatrix3({ x, y }), this);
//   }
// }

// // export class TFTranslationMatrix3 extends TFMatrix3 {
// //   constructor({ x = 0, y = 0 }) {
// //     super([
// //       1, 0, 0,
// //       0, 1, 0,
// //       x, y, 1
// //     ]);
// //   }
// // }

// // export class TFRotationMatrix3 extends TFMatrix3 {
// //   constructor(angle = 0) {
// //     super([
// //       Math.cos(angle),  Math.sin(angle),  0,
// //       -Math.sin(angle), Math.cos(angle),  0,
// //       0,                0,                1
// //     ]);
// //   }
// // }

// // export class TFScaleMatrix3 extends TFMatrix3 {
// //   constructor(amount = 1) {
// //     super([
// //       amount, 0,      0,
// //       0,      amount, 0,
// //       0,      0,      1
// //     ]);
// //   }
// // }

// export function multiplyMatrices(matrixA, matrixB) {

//   const newMatrix = getNewMatrix3([
//     // column 0
//     (matrixA.data[0] * matrixB.data[0]) + (matrixA.data[3] * matrixB.data[1]) + (matrixA.data[6] * matrixB.data[2]),
//     (matrixA.data[1] * matrixB.data[0]) + (matrixA.data[4] * matrixB.data[1]) + (matrixA.data[7] * matrixB.data[2]),
//     (matrixA.data[2] * matrixB.data[0]) + (matrixA.data[5] * matrixB.data[1]) + (matrixA.data[8] * matrixB.data[2]),
//     // column 1
//     (matrixA.data[0] * matrixB.data[3]) + (matrixA.data[3] * matrixB.data[4]) + (matrixA.data[6] * matrixB.data[5]),
//     (matrixA.data[1] * matrixB.data[3]) + (matrixA.data[4] * matrixB.data[4]) + (matrixA.data[7] * matrixB.data[5]),
//     (matrixA.data[2] * matrixB.data[3]) + (matrixA.data[5] * matrixB.data[4]) + (matrixA.data[8] * matrixB.data[5]),
//     // column 2
//     (matrixA.data[0] * matrixB.data[6]) + (matrixA.data[3] * matrixB.data[7]) + (matrixA.data[6] * matrixB.data[8]),
//     (matrixA.data[1] * matrixB.data[6]) + (matrixA.data[4] * matrixB.data[7]) + (matrixA.data[7] * matrixB.data[8]),
//     (matrixA.data[2] * matrixB.data[6]) + (matrixA.data[5] * matrixB.data[7]) + (matrixA.data[8] * matrixB.data[8]),
//   ]);

//   matrixA.release();
//   matrixB.release();

//   return newMatrix;

// }

// export function multiplyMatrixAndVector(matrix, vector) {
//   return new Vector2({
//     x: (vector.x * matrix.data[0]) + (vector.y * matrix.data[3]) + matrix.data[6], 
//     y: (vector.x * matrix.data[1]) + (vector.y * matrix.data[4]) + matrix.data[7] 
//   })
// }

// // The functions hidden below are to demonstrate how the matrix multiplication works, but have been replaced with those above for performance
// // function multiplyMatrices(matrixA, matrixB) {
// //   const row0 = [matrixB.data[0], matrixB.data[1], matrixB.data[2]];
// //   const row1 = [matrixB.data[3], matrixB.data[4], matrixB.data[5]];
// //   const row2 = [matrixB.data[6], matrixB.data[7], matrixB.data[8]];

// //   const result0 = multiplyMatrixAndPoint(matrixA, row0);
// //   const result1 = multiplyMatrixAndPoint(matrixA, row1);
// //   const result2 = multiplyMatrixAndPoint(matrixA, row2);

// //   return new TFMatrix3([
// //     result0[0], result0[1], result0[2],
// //     result1[0], result1[1], result1[2],
// //     result2[0], result2[1], result2[2]
// //   ])
// // }

// // function multiplyMatrixAndPoint(matrix, point) {
// //   const c0r0 = matrix.data[0], c1r0 = matrix.data[1], c2r0 = matrix.data[2];
// //   const c0r1 = matrix.data[3], c1r1 = matrix.data[4], c2r1 = matrix.data[5];
// //   const c0r2 = matrix.data[6], c1r2 = matrix.data[7], c2r2 = matrix.data[8];

// //   const x = point[0];
// //   const y = point[1];
// //   const z = point[2];

// //   const resultX = (x * c0r0) + (y * c0r1) + (z * c0r2);
// //   const resultY = (x * c1r0) + (y * c1r1) + (z * c1r2);
// //   const resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2);

// //   return [resultX, resultY, resultZ];
// // }

// // function multiplyMatrixAndVector(matrix, vector) {
// //   const c0r0 = matrix.data[0], c1r0 = matrix.data[1], c2r0 = matrix.data[2];
// //   const c0r1 = matrix.data[3], c1r1 = matrix.data[4], c2r1 = matrix.data[5];
// //   const c0r2 = matrix.data[6], c1r2 = matrix.data[7], c2r2 = matrix.data[8];

// //   const x = vector.x;
// //   const y = vector.y;
// //   const z = 1;

// //   const resultX = (x * c0r0) + (y * c0r1) + (z * c0r2);
// //   const resultY = (x * c1r0) + (y * c1r1) + (z * c1r2);

// //   return new Vector2({ x: resultX, y: resultY });
// // }

// // export function getVectorFromPoint(point) {
// //   return new Vector2({ x: point[0], y: point[1] });
// // }



// export class TFMatrix2 {
//   constructor(data = [
//     1, 0,
//     0, 1
//   ]) {
//     this.data = data;
//   }
// }

// export class TFRotationMatrix2 extends TFMatrix2 {
//   constructor() {
//     super([
//       Math.cos(angle),  Math.sin(angle),
//       -Math.sin(angle), Math.cos(angle),
//     ]);
//   }
// }

// for (let i = 0; i < 5; i++) {
//   pool.push(new TFMatrix3());
// }











// import { Vector2 } from './Vector2.js';

// // 3x3 matrix
// export class TFMatrix3 {
//   constructor(data = [
//     1, 0, 0,
//     0, 1, 0,
//     0, 0, 1
//   ]) {
//     this.data = data;
//   }

//   multiplyVector(vector) {
//     return multiplyMatrix3AndVector2(this, vector);
//   }

//   scale(amount) {
//     return multiplyMatrices3(new TFScaleMatrix3(amount), this);
//   }

//   rotate(radian) {
//     return multiplyMatrices3(new TFRotationMatrix3(radian), this);
//   }

//   translate({ x, y }) {
//     return multiplyMatrices3(new TFTranslationMatrix3({ x, y }), this);
//   }
// }

// export class TFTranslationMatrix3 extends TFMatrix3 {
//   constructor({ x = 0, y = 0 }) {
//     super([
//       1, 0, 0,
//       0, 1, 0,
//       x, y, 1
//     ]);
//   }
// }

// export class TFRotationMatrix3 extends TFMatrix3 {
//   constructor(angle = 0) {
//     super([
//       Math.cos(angle),  Math.sin(angle),  0,
//       -Math.sin(angle), Math.cos(angle),  0,
//       0,                0,                1
//     ]);
//   }
// }

// export class TFScaleMatrix3 extends TFMatrix3 {
//   constructor(amount = 1) {
//     super([
//       amount, 0,      0,
//       0,      amount, 0,
//       0,      0,      1
//     ]);
//   }
// }


// // 2D matrix - a 3x2 matrix optimised for 2D calculations
// export class TFMatrix2D {
//   constructor(data = [
//     1, 0,
//     0, 1,
//     0, 0,
//   ]) {
//     this.data = data;
//   }

//   multiplyVector(vector) {
//     return multiplyMatrix2DAndVector2(this, vector);
//   }

//   scale(amount) {
//     return multiplyMatrices2D(new TFScaleMatrix2D(amount), this, this);
//   }

//   rotate(radian) {
//     return multiplyMatrices2D(new TFRotationMatrix2D(radian), this, this);
//   }

//   translate({ x, y }) {
//     return multiplyMatrices2D(new TFTranslationMatrix2D({ x, y }), this, this);
//   }
// }

// export class TFTranslationMatrix2D extends TFMatrix2D {
//   constructor({ x = 0, y = 0 }) {
//     super([
//       1, 0,
//       0, 1,
//       x, y,
//     ]);
//   }
// }

// export class TFRotationMatrix2D extends TFMatrix2D {
//   constructor(angle = 0) {
//     super([
//       Math.cos(angle),  Math.sin(angle),
//       -Math.sin(angle), Math.cos(angle),
//       0,                0,
//     ]);
//   }
// }

// export class TFScaleMatrix2D extends TFMatrix2D {
//   constructor(amount = 1) {
//     super([
//       amount, 0,
//       0,      amount,
//       0,      0,
//     ]);
//   }
// }


// // 2x2 matrix
// export class TFMatrix2 {
//   constructor(data = [
//     1, 0,
//     0, 1
//   ]) {
//     this.data = data;
//   }

//   multiplyVector(vector) {
//     return multiplyMatrix2AndVector2(this, vector);
//   }

//   scale(amount) {
//     return multiplyMatrices2(new TFScaleMatrix2(amount), this);
//   }

//   rotate(radian) {
//     return multiplyMatrices2(new TFRotationMatrix2(radian), this);
//   }
// }

// export class TFRotationMatrix2 extends TFMatrix2 {
//   constructor(angle = 0) {
//     super([
//       Math.cos(angle),  Math.sin(angle),
//       -Math.sin(angle), Math.cos(angle),
//     ]);
//   }
// }

// export class TFScaleMatrix2 extends TFMatrix2 {
//   constructor(amount = 1) {
//     super([
//       amount, 0,
//       0,      amount
//     ]);
//   }
// }

// // Matrices multiplication
// function multiplyMatrices3(matrixA, matrixB) {

//   return new TFMatrix3([
//     // column 0
//     (matrixA.data[0] * matrixB.data[0]) + (matrixA.data[3] * matrixB.data[1]) + (matrixA.data[6] * matrixB.data[2]),
//     (matrixA.data[1] * matrixB.data[0]) + (matrixA.data[4] * matrixB.data[1]) + (matrixA.data[7] * matrixB.data[2]),
//     (matrixA.data[2] * matrixB.data[0]) + (matrixA.data[5] * matrixB.data[1]) + (matrixA.data[8] * matrixB.data[2]),
//     // column 1
//     (matrixA.data[0] * matrixB.data[3]) + (matrixA.data[3] * matrixB.data[4]) + (matrixA.data[6] * matrixB.data[5]),
//     (matrixA.data[1] * matrixB.data[3]) + (matrixA.data[4] * matrixB.data[4]) + (matrixA.data[7] * matrixB.data[5]),
//     (matrixA.data[2] * matrixB.data[3]) + (matrixA.data[5] * matrixB.data[4]) + (matrixA.data[8] * matrixB.data[5]),
//     // column 2
//     (matrixA.data[0] * matrixB.data[6]) + (matrixA.data[3] * matrixB.data[7]) + (matrixA.data[6] * matrixB.data[8]),
//     (matrixA.data[1] * matrixB.data[6]) + (matrixA.data[4] * matrixB.data[7]) + (matrixA.data[7] * matrixB.data[8]),
//     (matrixA.data[2] * matrixB.data[6]) + (matrixA.data[5] * matrixB.data[7]) + (matrixA.data[8] * matrixB.data[8]),
//   ]);

// }

// function multiplyMatrices2D(matrixA, matrixB, output) {

//   // Cache relevant values
//   const a0 = matrixA.data[0],
//     a1 = matrixA.data[1],
//     a2 = matrixA.data[2],
//     a3 = matrixA.data[3],
//     a4 = matrixA.data[4],
//     a5 = matrixA.data[5],
//     b0 = matrixB.data[0],
//     b1 = matrixB.data[1],
//     b2 = matrixB.data[2],
//     b3 = matrixB.data[3],
//     b4 = matrixB.data[4],
//     b5 = matrixB.data[5];

//   // column 0
//   output.data[0] = (a0 * b0) + (a2 * b1);
//   output.data[1] = (a1 * b0) + (a3 * b1);
//   // column 1
//   output.data[2] = (a0 * b2) + (a2 * b3);
//   output.data[3] = (a1 * b2) + (a3 * b3);
//   // column 2
//   output.data[4] = (a0 * b4) + (a2 * b5) + a4;
//   output.data[5] = (a1 * b4) + (a3 * b5) + a5;

//   return output;

// }

// function multiplyMatrices2(matrixA, matrixB) {

//   return new TFMatrix2([
//     // column 0
//     (matrixA.data[0] * matrixB.data[0]) + (matrixA.data[2] * matrixB.data[1]),
//     (matrixA.data[1] * matrixB.data[0]) + (matrixA.data[3] * matrixB.data[1]),
//     // column 1
//     (matrixA.data[0] * matrixB.data[2]) + (matrixA.data[2] * matrixB.data[3]),
//     (matrixA.data[1] * matrixB.data[2]) + (matrixA.data[3] * matrixB.data[3]),
//   ]);

// }

// // Matrix vector multiplication
// function multiplyMatrix3AndVector2(matrix, vector) {

//   return new Vector2({
//     x: (vector.x * matrix.data[0]) + (vector.y * matrix.data[3]) + matrix.data[6], 
//     y: (vector.x * matrix.data[1]) + (vector.y * matrix.data[4]) + matrix.data[7] 
//   });

// }

// function multiplyMatrix2DAndVector2(matrix, vector) {

//   return new Vector2({
//     x: (vector.x * matrix.data[0]) + (vector.y * matrix.data[2]) + matrix.data[4], 
//     y: (vector.x * matrix.data[1]) + (vector.y * matrix.data[3]) + matrix.data[5] 
//   });

// }

// function multiplyMatrix2AndVector2(matrix, vector) {

//   return new Vector2({
//     x: (vector.x * matrix.data[0]) + (vector.y * matrix.data[2]),
//     y: (vector.x * matrix.data[1]) + (vector.y * matrix.data[3])
//   });

// }











// import { Vector2 } from './Vector2.js';

// // 3x3 matrix
// export class TFMatrix3 {
//   constructor(data = [
//     1, 0, 0,
//     0, 1, 0,
//     0, 0, 1
//   ]) {
//     this.data = data;
//   }

//   multiplyVector(vector) {
//     return multiplyMatrix3AndVector2(this, vector);
//   }

//   scale(amount) {
//     return multiplyMatrices3(new TFScaleMatrix3(amount), this);
//   }

//   rotate(radian) {
//     return multiplyMatrices3(new TFRotationMatrix3(radian), this);
//   }

//   translate({ x, y }) {
//     return multiplyMatrices3(new TFTranslationMatrix3({ x, y }), this);
//   }
// }

// export class TFTranslationMatrix3 extends TFMatrix3 {
//   constructor({ x = 0, y = 0 }) {
//     super([
//       1, 0, 0,
//       0, 1, 0,
//       x, y, 1
//     ]);
//   }
// }

// export class TFRotationMatrix3 extends TFMatrix3 {
//   constructor(angle = 0) {
//     super([
//       Math.cos(angle),  Math.sin(angle),  0,
//       -Math.sin(angle), Math.cos(angle),  0,
//       0,                0,                1
//     ]);
//   }
// }

// export class TFScaleMatrix3 extends TFMatrix3 {
//   constructor(amount = 1) {
//     super([
//       amount, 0,      0,
//       0,      amount, 0,
//       0,      0,      1
//     ]);
//   }
// }


// // 2D matrix - a 3x3 matrix optimised for 2D calculations
// export class TFMatrix2D {
//   constructor(data = [
//     1, 0, 0,
//     0, 1, 0,
//     0, 0, 1
//   ]) {
//     this.data = data;
//   }

//   multiplyVector(vector) {
//     return multiplyMatrix3AndVector2(this, vector);
//   }

//   scale(amount) {
//     return multiplyMatrices2D(new TFScaleMatrix2D(amount), this);
//   }

//   rotate(radian) {
//     return multiplyMatrices2D(new TFRotationMatrix2D(radian), this);
//   }

//   translate({ x, y }) {
//     return multiplyMatrices2D(new TFTranslationMatrix2D({ x, y }), this);
//   }
// }

// export class TFTranslationMatrix2D extends TFMatrix2D {
//   constructor({ x = 0, y = 0 }) {
//     super([
//       1, 0, 0,
//       0, 1, 0,
//       x, y, 1
//     ]);
//   }
// }

// export class TFRotationMatrix2D extends TFMatrix2D {
//   constructor(angle = 0) {
//     super([
//       Math.cos(angle),  Math.sin(angle),  0,
//       -Math.sin(angle), Math.cos(angle),  0,
//       0,                0,                1
//     ]);
//   }
// }

// export class TFScaleMatrix2D extends TFMatrix2D {
//   constructor(amount = 1) {
//     super([
//       amount, 0,      0,
//       0,      amount, 0,
//       0,      0,      1
//     ]);
//   }
// }


// // 2x2 matrix
// export class TFMatrix2 {
//   constructor(data = [
//     1, 0,
//     0, 1
//   ]) {
//     this.data = data;
//   }

//   multiplyVector(vector) {
//     return multiplyMatrix2AndVector2(this, vector);
//   }

//   scale(amount) {
//     return multiplyMatrices2(new TFScaleMatrix2(amount), this);
//   }

//   rotate(radian) {
//     return multiplyMatrices2(new TFRotationMatrix2(radian), this);
//   }
// }

// export class TFRotationMatrix2 extends TFMatrix2 {
//   constructor(angle = 0) {
//     super([
//       Math.cos(angle),  Math.sin(angle),
//       -Math.sin(angle), Math.cos(angle),
//     ]);
//   }
// }

// export class TFScaleMatrix2 extends TFMatrix2 {
//   constructor(amount = 1) {
//     super([
//       amount, 0,
//       0,      amount
//     ]);
//   }
// }

// // Matrices multiplication
// function multiplyMatrices3(matrixA, matrixB) {

//   return new TFMatrix3([
//     // column 0
//     (matrixA.data[0] * matrixB.data[0]) + (matrixA.data[3] * matrixB.data[1]) + (matrixA.data[6] * matrixB.data[2]),
//     (matrixA.data[1] * matrixB.data[0]) + (matrixA.data[4] * matrixB.data[1]) + (matrixA.data[7] * matrixB.data[2]),
//     (matrixA.data[2] * matrixB.data[0]) + (matrixA.data[5] * matrixB.data[1]) + (matrixA.data[8] * matrixB.data[2]),
//     // column 1
//     (matrixA.data[0] * matrixB.data[3]) + (matrixA.data[3] * matrixB.data[4]) + (matrixA.data[6] * matrixB.data[5]),
//     (matrixA.data[1] * matrixB.data[3]) + (matrixA.data[4] * matrixB.data[4]) + (matrixA.data[7] * matrixB.data[5]),
//     (matrixA.data[2] * matrixB.data[3]) + (matrixA.data[5] * matrixB.data[4]) + (matrixA.data[8] * matrixB.data[5]),
//     // column 2
//     (matrixA.data[0] * matrixB.data[6]) + (matrixA.data[3] * matrixB.data[7]) + (matrixA.data[6] * matrixB.data[8]),
//     (matrixA.data[1] * matrixB.data[6]) + (matrixA.data[4] * matrixB.data[7]) + (matrixA.data[7] * matrixB.data[8]),
//     (matrixA.data[2] * matrixB.data[6]) + (matrixA.data[5] * matrixB.data[7]) + (matrixA.data[8] * matrixB.data[8]),
//   ]);

// }

// function multiplyMatrices2D(matrixA, matrixB) {

//   return new TFMatrix2D([
//     // column 0
//     (matrixA.data[0] * matrixB.data[0]) + (matrixA.data[3] * matrixB.data[1]),
//     (matrixA.data[1] * matrixB.data[0]) + (matrixA.data[4] * matrixB.data[1]),
//     0,
//     // column 1
//     (matrixA.data[0] * matrixB.data[3]) + (matrixA.data[3] * matrixB.data[4]),
//     (matrixA.data[1] * matrixB.data[3]) + (matrixA.data[4] * matrixB.data[4]),
//     0,
//     // column 2
//     (matrixA.data[0] * matrixB.data[6]) + (matrixA.data[3] * matrixB.data[7]) + matrixA.data[6],
//     (matrixA.data[1] * matrixB.data[6]) + (matrixA.data[4] * matrixB.data[7]) + matrixA.data[7],
//     1,
//   ]);

// }

// function multiplyMatrices2(matrixA, matrixB) {

//   return new TFMatrix2([
//     // column 0
//     (matrixA.data[0] * matrixB.data[0]) + (matrixA.data[2] * matrixB.data[1]),
//     (matrixA.data[1] * matrixB.data[0]) + (matrixA.data[3] * matrixB.data[1]),
//     // column 1
//     (matrixA.data[0] * matrixB.data[2]) + (matrixA.data[2] * matrixB.data[3]),
//     (matrixA.data[1] * matrixB.data[2]) + (matrixA.data[3] * matrixB.data[3]),
//   ]);

// }

// // Matrix vector multiplication
// function multiplyMatrix3AndVector2(matrix, vector) {

//   return new Vector2({
//     x: (vector.x * matrix.data[0]) + (vector.y * matrix.data[3]) + matrix.data[6], 
//     y: (vector.x * matrix.data[1]) + (vector.y * matrix.data[4]) + matrix.data[7] 
//   });

// }

// function multiplyMatrix2AndVector2(matrix, vector) {

//   return new Vector2({
//     x: (vector.x * matrix.data[0]) + (vector.y * matrix.data[2]),
//     y: (vector.x * matrix.data[1]) + (vector.y * matrix.data[3])
//   });

// }

