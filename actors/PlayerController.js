import { ECS } from '../core/ECS/ECS.js';

export class PlayerController extends ECS.Entity {
  constructor({
    behaviours,
  }) {
    super()
    .addComponent(ECS.components.controller, {
      behaviours
    });
  }
}