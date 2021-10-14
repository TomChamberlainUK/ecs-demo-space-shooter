import { TransformComponent as transform } from './components/TransformComponent.js';
import { KineticComponent as kinetic } from './components/KineticComponent.js';
import { ParticleComponent as particle } from './components/ParticleComponent.js';
import { ParticleEmitterComponent as particleEmitter } from './components/ParticleEmitterComponent.js';
import { DirectionComponent as direction } from './components/DirectionComponent.js';
import { OutOfBoundsComponent as outOfBounds } from './components/OutOfBoundsComponent.js';
import { ControlledComponent as controlled } from './components/ControlledComponent.js';
import { ControllerComponent as controller } from './components/ControllerComponent.js';
import { DamageableComponent as damageable } from './components/DamageableComponent.js';
import { DamagingComponent as damaging } from './components/DamagingComponent.js';
import { DebugComponent as debug } from './components/DebugComponent.js';
import { LifespanComponent as lifespan } from './components/LifespanComponent.js';
import { DestroyableComponent as destroyable } from './components/DestroyableComponent.js';
import { CameraComponent as camera } from './components/CameraComponent.js';
import { DestructableComponent as destructable } from './components/DestructableComponent.js';
import { 
  RigidBodyCircleComponent as rigidBodyCircle,
  RigidBodyLineComponent as rigidBodyLine,
  RigidBodyRectangleComponent as rigidBodyRectangle,
  RigidBodyCapsuleComponent as rigidBodyCapsule,
} from './components/RigidBodyComponent.js';
import {
  RenderCircleComponent as renderCircle,
  RenderCapsuleComponent as renderCapsule,
  RenderLineComponent as renderLine,
  RenderRectangleComponent as renderRectangle
} from './components/RenderComponent.js';
import { SpeedComponent as speed } from './components/SpeedComponent.js';
import { WeaponComponent as weapon } from './components/WeaponComponent.js';

export const components = {
  transform,
  kinetic,
  outOfBounds,
  controlled,
  controller,
  damageable,
  damaging,
  debug,
  destroyable,
  camera,
  lifespan,
  destructable,
  direction,
  particle,
  particleEmitter,

  rigidBodyCircle,
  rigidBodyLine,
  rigidBodyRectangle,
  rigidBodyCapsule,

  renderCircle,
  renderCapsule,
  renderLine,
  renderRectangle,

  speed,
  weapon
}