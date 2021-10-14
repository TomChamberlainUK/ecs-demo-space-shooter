import { Component } from './Component.js';
import { Vector2 } from '../../math/Vector2.js';

export class CameraComponent extends Component {
  constructor({
    viewport = {
      width: 0,
      height: 0
    },
    deadzone = {
      width: 0,
      height: 0
    },
    rotationDeadzone = 0,
    zoom = 1,
    followedEntity = null,
    followEntityRotation = false
  }) {
    super({ name: 'camera' });
    this.viewport = viewport;
    this.deadzone = {
      min: new Vector2({
        x: -deadzone.width / 2,
        y: -deadzone.height / 2
      }),
      max: new Vector2({
        x: deadzone.width / 2,
        y: deadzone.height / 2
      })
    };
    this.rotationDeadzone = rotationDeadzone;
    this.zoom = zoom;
    this.followedEntity = followedEntity;
    this.followEntityRotation = followEntityRotation;
  }
}