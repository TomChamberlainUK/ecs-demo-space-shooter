# *As Yet Untitled* - An ECS Game Engine

## A 2D Game Engine for JavaScript

This project provides a simple, efficient framework for developing games for the web using JavaScript and WebGL. This framework is built using an ECS (Entity Component System) that provides a flexible modular design that speeds up the creation process.

## What is an ECS?

An ECS (Entity Component System) is a modern, functional approach to game engine design that attempts to solve some of the known problems in the traditional OOP (Object Orientated Programming) principles of inheritance.

## How Does the Engine Work?

### Entities

An entity is just a reference to a collection of data. It could be a rock, an enemy spaceship, or the player controller.

### Components

Components are the building blocks of an entity. They hold the necessary data for representing certain aspects of an entity, such as a sprite or the color of a particle.

### Systems

Systems are what brings the data to life. They cycle through all the entities in a scene, find entities that have the required components, and manipulate the data to achieve certain interactions such as a change of position or the dealing of damage.

## Docs

### Components List

Entities can be assigned components through the `addComponent` method:

```javascript
entity.addComponent(component, parameters);
```

#### Camera

```javascript
entity.addComponent(camera, {
  viewport: {
    height: canvas.height,
    width: canvas.width
  },
  deadzone: {
    height: 200,
    width: 200
  }
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`deadzone` | `Object` | | Deadzone for the camera
`deadzone.height` | `Number` | `0` | Height of deadzone in meters
`deadzone.width` | `Number` | `0` | Width of deadzone in meters
`followedEntity` | `Entity` | `null` | An Entity that the camera will track
~~`followEntityRotation`~~ | ~~`Boolean`~~ | ~~`false`~~ | ~~Enable/disable rotating according to followed entity~~
~~`rotationDeadzone`~~ | ~~`Number`~~ | ~~`0`~~ | ~~Amount of rotation ignored before the camera starts tracking~~
`viewport` | `Object` | | Viewport for the camera
`viewport.height` | `Number` | `0` | Height of viewport in pixels
`viewport.width` | `Number` | `0` | Width of viewport in pixels
`zoom` | `Number` | `1` | Camera magnification

#### Controlled

```javascript
entity.addComponent(controlled, {
  behaviours: ['mover', 'shooter']
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`behaviours` | `Array` | `[]` | Allocates what commands can be received

##### Behaviours

Name | Commands
---- | --------
`'mover'` | Accelerate left, right, up, or down
`'platformer'` | Move left and right as well as jump (WIP)
`'rotater'` | Rotate
`'shooter'` | Aim and shoot
`'steerer'` | Accelerate, break, steer and shift left and right

#### Controller

```javascript
entity.addComponent(controller, {
  behaviours: ['mover', 'shooter']
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`behaviours` | `Array` | `[]` | Allocates what commands can be sent
`defaultPawn` | `Entity` | `null` | The entity used in respawns
`camera` | `Entity` | `null` | The camera entity
`pawn` | `Entity` | `null` | The entity to send commands to

##### Behaviours

Name | Commands
---- | --------
`'mover'` | Accelerate left, right, up, or down
`'platformer'` | Move left and right as well as jump (WIP)
`'rotater'` | Rotate
`'shooter'` | Aim and shoot
`'steerer'` | Accelerate, break, steer and shift left and right

#### Damageable

```javascript
entity.addComponent(damageable, {
  health: 100,
  team: 'allied'
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`health` | `Number` | `100` | Resilience to damage
`team` | `String` | `neutral` | Will not receive damage from teams of the same name

#### Damaging

```javascript
entity.addComponent(damaging, {
  damage: 20,
  team: 'enemy'
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`health` | `Number` | `20` | Resilience to damage
`team` | `String` | `neutral` | Will not inflict damage to teams of the same name

#### Debug

```javascript
entity.addComponent(debug, {
  transform: true,
  kinetic: true
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`transform` | `Boolean` | `false` | Display transform details
`kinetic` | `Boolean` | `false` | Display kinetic details
`rigidBody` | `Boolean` | `false` | Display rigidBody details
`controller` | `Boolean` | `false` | Display controller details
`speed` | `Boolean` | `false` | Display speed details
`weapon` | `Boolean` | `false` | Display weapon details
`damageable` | `Boolean` | `false` | Display damageable details

#### Destroyable

```javascript
entity.addComponent(destroyable, {
  destroy: false
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`destroy` | `Boolean` | `false` | When set to true this entity will be removed on the next cycle

#### Destructable

```javascript
entity.addComponent(destructable, {
  debrisClasses: [RockDebris, SmokeEmitter],
  debrisCount: 6
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`debrisClasses` | `Array` | `[]` | Entity classes to randomly spawn when this entity is destroyed
`debrisCount` | `Number` | `4` | Number of entities to spawn
`debrisParameters` | `Object` | `{}` | These parameters will be passed to all spawned entities during instanciation

#### Direction

```javascript
entity.addComponent(direction, {
  start: { x: 0, y: 1 },
  end: { x: 0, y: -1 }
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`direction` | `Vector2` | `undefined` | A unit vector that describes a direction. If set start and end are ignored
`end` | `Vector2` | `x: 0, y: 1` | Ending point of a direction vector
`start` | `Vector2` | `x: 0, y: 1` | Starting point of a direction vector

#### Kinetic

```javascript
entity.addComponent(kinetic, {
  velocity: { x: 0, y: 0 },
  acceleration: { x: 0, y: 0 },
  angularVelocity: 0,
  angularAcceleration: 0
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`acceleration` | `Vector2` | `x: 0, y: 1` | The rate the entity is increasing in velocity
`angularAcceleration` | `Number` | `0` | The rate the entity is increasing in angular velocity
`angularVelocity` | `Number` | `0` | The rate the entity is rotating
`velocity` | `Vector2` | `x: 0, y: 0` | The rate the entity is moving

#### Lifespan

```javascript
entity.addComponent(lifespan, {
  duration: 5
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`duration` | `Number` | `0` | The number of seconds that the entity will exist for before being destroyed

#### Out Of Bounds

```javascript
entity.addComponent(outOfBounds, {
  width: canvas.width,
  height: canvas.height
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`height` | `Number` | `1024` | The height of allowed bounds for other entities
`width` | `Number` | `1024` | The width of allowed bounds for other entities

#### Particle

```javascript
entity.addComponent(outOfBounds, {
  type: 'fire',
  radius: 8
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`radius` | `Number` | `8` | The radius of the particle
`type` | `String` | `null` | The type of particle that the entity is. This changes how it behaves

#### Particle Emitter

```javascript
entity.addComponent(particleEmitter, {
  ParticleEntity: Particle,
  particleType: 'smoke',
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`ParticleEntity` | `Entity` | `null` | The particle entity class to emit
`particleType` | `String` | `null` | Emitted particles will be given this type
`particleDuration` | `Number` | `1` | Emitted particles will be given this lifespan
`particleSpeed` | `Number` | `50` | Particles will be emitted with this as a starting velocity magnitude
`particleSpeedMultiplier` | `Number` | `1` | Particle speed will be multiplied by this number
`particleDirection` | `Vector2` | `{ x: 0, y: 0 }` | A unit vector indicating the direction that the particle will be emitted
`particleDirectionNoise` | `Number` | `0` | When emitting a particle, the direction will be altered on both the x and y axis randomly from the negative version of this number to the positive
`particleRadius` | `Number` | `8` | Emitted particles will be given this radius
`emissionRate` | `Number` | `0.1` | The cooldown between particle emissions in seconds
`isEmitting` | `Boolean` | `false` | Determines whether or not this entity will attempt to emit a particle

#### Render

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`type` | `String` | `null` | Specifies the rendering method
`layer` | `Number` | `0` | Specifies object rendering order, from minimum to maximum

> *Please note that the render component cannot be used on its own and must either be used via specific geometry components or a sprite component*

#### Render - Geometry

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`shape` | `String` | `null` | The shape that will be rendered
`fillColor` | `String` | `null` | Specifies a color to fill the shape with. No fill will be applied if left null
`strokeColor` | `String` | `null` | Specifies a color to stroke the shape with. No stroke will be applied if left null

> *Please note that the render geometry component cannot be used on its own and must either be used via specific shape components*

#### Render - Geometry: Circle

```javascript
entity.addComponent(renderCircle, {
  radius: 16,
  fillColor: 'rgb(32,32,32)',
  strokeColor: 'white'
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`radius` | `Number` | `16` | The radius of the rendered circle

#### Render - Geometry: Capsule

```javascript
entity.addComponent(renderCapsule, {
  radius: 32,
  length: 64,
  fillColor: 'white'
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`radius` | `Number` | `16` | The radius of the rendered capsule
`length` | `Number` | `32` | The length of the rendered capsule

#### Render - Geometry: Line

```javascript
entity.addComponent(renderLine, {
  length: 128,
  strokeColor: 'red'
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`length` | `Number` | `32` | The length of the rendered line

#### Render - Geometry: Rectangle

```javascript
entity.addComponent(renderRectangle, {
  width: 32,
  height: 32,
  strokeColor: 'rgb(255,128,255)'
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`height` | `Number` | `16` | The height of the rendered rectangle
`width` | `Number` | `16` | The width of the rendered rectangle

#### Rigid Body - Circle

```javascript
entity.addComponent(rigidBodyCircle, {
  radius: 32
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`radius` | `Number` | `16` | The radius of the circular rigid-body

#### Rigid Body - Line

```javascript
entity.addComponent(rigidBodyLine, {
  length: 128
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`length` | `Number` | `32` | The length of the line-shaped rigid-body

#### Rigid Body - Rectangle

```javascript
entity.addComponent(rigidBodyRectangle, {
  width: 64,
  height: 64
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`height` | `Number` | `16` | The height of the rectangular rigid-body
`width` | `Number` | `16` | The width of the rectangular rigid-body

#### Rigid Body - Capsule

```javascript
entity.addComponent(rigidBodyCapsule, {
  length: 128,
  radius: 256
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`length` | `Number` | `32` | The length of the capsule-shaped rigid-body
`radius` | `Number` | `16` | The radius of the capsule-shaped rigid-body

#### Speed

```javascript
entity.addComponent(speed, {
  force: 10000,
  torque: 24000,
  boostMultiplier: 2
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`boostMultiplier` | `Number` | `1.25` | Acceleration force will be multiplied by this when boosting
`force` | `Number` | `1000` | The force in newtons applied during acceleration 
`torque` | `Number` | `16` | The force in newtons applied during angular acceleration

#### Transform

```javascript
entity.addComponent(transform);
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`position` | `Vector2` | `{ x: 0, y: 0 }` | The position of the entity relative to either its parent or the world
`rotation` | `Number` | `0` | The rotation of the entity in radians relative to either its parent or the world
`scale` | `Number` | `1` | The scale factor of the entity relative to either its parent or the world

#### Weapon

```javascript
entity.addComponent(weapon, {
  ProjectileEntity: null,
  projectileProps: {
    team: 'allied',
    fillColor: 'cyan'
  },
  projectileSpeed: 800,
  fireRate: 0.1
});
```

##### Parameters:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`ProjectileEntity` | `Entity` | `null` | The entity class instantiated when the entity shoots
`projectileProps` | `Object` | `{}` | This object will be passed to new projectile entity class instances as properties
`projectileSpeed` | `Number` | `400` | The initial velocity of fired projectiles
`fireRate` | `Number` | `0.5` | The rate at which projectiles are fired

### Systems List

#### Camera

#### Collisions

#### Controlled

##### Behaviours

#### Controller

#### Debug Renderer

#### Destructable

#### Gravity

#### Kinetic

#### Lifespan

#### Out Of Bounds

#### Particle

#### Particle Emitter

#### Renderer

#### Save Previous State

### Other

#### Units of Measurement:

* **Length** - 1 unit represents 1 meter;
* **Time** - 1 unit represents 1 second;
* **Mass** - 1 unit represents 1 kilogram;

> *All units are metric and based off of The International System of Units (SI). Using the correct units is important when calculating physics. Consistent use of units will keep your game running accurately, predictably, and coherently.*