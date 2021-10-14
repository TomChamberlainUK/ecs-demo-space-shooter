import { ECS } from '../core/ECS/ECS.js';

export class Camera extends ECS.Entity {
  constructor({
    viewport,
    deadzone,
    rotationDeadzone,
    followEntity,
    followEntityRotation,
  }) {
    super()
    .addComponent(ECS.components.transform)
    .addComponent(ECS.components.kinetic)
    .addComponent(ECS.components.camera, {
      viewport,
      deadzone,
      rotationDeadzone,
      followEntity,
      followEntityRotation
    });
  }
}