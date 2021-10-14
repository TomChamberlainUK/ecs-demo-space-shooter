import { rendererSystem as renderer } from './systems/rendererSystem.js';
import { kineticSystem as kinetic } from './systems/kineticSystem.js';
import { gravitySystem as gravity } from './systems/gravitySystem.js';
import { outOfBoundsSystem as outOfBounds } from './systems/outOfBoundsSystem.js';
import { controlledEntitiesSystem as controlledEntities } from './systems/controlledEntitiesSystem.js';
import { controllerSystem as controller } from './systems/controllerSystem.js';
import { collisionsSystem as collisions } from './systems/collisionsSystem.js';
import { debugRendererSystem as debugRenderer } from './systems/debugRendererSystem.js';
import { lifespanSystem as lifespan } from './systems/lifespanSystem.js';
import { cameraSystem as camera } from './systems/cameraSystem.js';
import { destructableSystem as destructable } from './systems/destructableSystem.js';
import { savePreviousStateSystem as savePreviousState } from './systems/savePreviousStateSystem.js';
import { particleEmitterSystem as particleEmitter } from './systems/particleEmitterSystem.js';
import { particleSystem as particle } from './systems/particleSystem.js';

export const systems = {
  renderer,
  kinetic,
  gravity,
  outOfBounds,
  controlledEntities,
  controller,
  collisions,
  debugRenderer,
  lifespan,
  camera,
  destructable,
  savePreviousState,
  particleEmitter,
  particle
}