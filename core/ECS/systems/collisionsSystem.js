import { Game } from '../../Game.js';
import { QuadTree, Quadrent, EntityAABB } from '../../Space.js';

import { Vector2 } from '../../math/Vector2.js';
import { getTFScaleMatrix2D, getTFRotationMatrix2 } from '../../math/Matrix.js';

// For AABB pre collision check
class AABB {
  constructor({
    min = { x: 0, y: 0 },
    max = { x: 0, y: 0 }
  }) {
    this.min = min;
    this.max = max;
  }
}

// // Quadrent coords for quadtree
// class EntityAABB {
//   constructor({
//     min = { x: 0, y: 0 },
//     max = { x: 0, y: 0 },
//     entityData = null
//   }) {
//     this.min = min;
//     this.max = max;
//     this.entityData = entityData;
//   }

//   intersects(range) {
//     return !(
//       this.max.x < range.min.x ||
//       this.max.y < range.min.y ||
//       this.min.x > range.max.x ||
//       this.min.y > range.max.y
//     );
//   }
// }

// class Quadrent {
//   constructor({
//     position = { x: 0, y: 0 },
//     width = 0,
//     height = 0
//   }) {
//     this.position = position;
//     this.width = width;
//     this.height = height;
//     this.halfWidth = width / 2;
//     this.halfHeight = height / 2;
//     this.min = {
//       x: this.position.x - this.halfWidth,
//       y: this.position.y - this.halfHeight
//     }
//     this.max = {
//       x: this.position.x + this.halfWidth,
//       y: this.position.y + this.halfHeight
//     }
//   }

//   contains(aabb) {
//     return (
//       aabb.min.x >= this.min.x &&
//       aabb.max.x < this.max.x &&
//       aabb.min.y >= this.min.y &&
//       aabb.max.y < this.max.y
//     );
//   }

//   intersects(range) {
//     return !(
//       this.max.x < range.min.x ||
//       this.max.y < range.min.y ||
//       this.min.x > range.max.x ||
//       this.min.y > range.max.y
//     );
//   }
// }

// // Quadtree for collision partners
// class QuadTree {
//   constructor({
//     boundary,
//     capacity,
//     entities = []
//   }) {
//     this.boundary = boundary;
//     this.capacity = capacity;
//     this.entities = entities;
//     this.isSubdivided = false;

//     // Debug
//     // Game.addDebugRectangle({
//     //   position: this.boundary.position,
//     //   width: this.boundary.width,
//     //   height: this.boundary.height
//     // });
//   }

//   // Add entity to tree - returns true if successful
//   insert(entityAABB) {
//     // If entity's AABB does not fit in boundary
//     if (!this.boundary.contains(entityAABB)) return false;
//     // If there is still space within this node, add the entity
//     if (this.entities.length < this.capacity) {
//       this.entities.push(entityAABB);
//       return true;
//     } else {
//       // Subdivide this node if it's not already been done
//       if (!this.isSubdivided) this.subdivide();
//       // Try to fit entity in a subdivision
//       if (
//         this.northEast.insert(entityAABB) ||
//         this.southEast.insert(entityAABB) ||
//         this.southWest.insert(entityAABB) ||
//         this.northWest.insert(entityAABB)
//       ) {
//         return true;
//       }
//       // If the entity is too big for any subdivision, overload this node's entity list
//       else {
//         this.entities.push(entityAABB);
//         return true;
//       }
//     }
//   }

//   query(queryAABB, found = []) {
//     // If the query doesn't overlap the boundary, return current found
//     if (!this.boundary.intersects(queryAABB)) return found;

//     // Check each entity against the query
//     for (const entityAABB of this.entities) {
//       if (queryAABB.entityData === entityAABB.entityData) continue; // skip self
//       // If the AABBs overlap, add to found array
//       if (queryAABB.intersects(entityAABB)) {
//         found.push(entityAABB);
//       }
//     }

//     // Recurse through subdivisions
//     if (this.isSubdivided) {
//       this.northEast.query(queryAABB, found);
//       this.southEast.query(queryAABB, found);
//       this.southWest.query(queryAABB, found);
//       this.northWest.query(queryAABB, found);
//     }

//     // Return all matching entities
//     return found;
//   }

//   subdivide() {

//     const { x, y } = this.boundary.position;
//     const { halfWidth, halfHeight } = this.boundary;
//     const quarterWidth = halfWidth / 2;
//     const quarterHeight = halfHeight / 2;
    
//     this.northEast = new QuadTree({
//       boundary: new Quadrent({
//         position: {
//           x: x + quarterWidth,
//           y: y - quarterHeight
//         },
//         width: halfWidth,
//         height: halfHeight
//       }),
//       capacity: this.capacity
//     });

//     this.southEast = new QuadTree({
//       boundary: new Quadrent({
//         position: {
//           x: x + quarterWidth,
//           y: y + quarterHeight
//         },
//         width: halfWidth,
//         height: halfHeight
//       }),
//       capacity: this.capacity
//     });

//     this.southWest = new QuadTree({
//       boundary: new Quadrent({
//         position: {
//           x: x - quarterWidth,
//           y: y + quarterHeight
//         },
//         width: halfWidth,
//         height: halfHeight
//       }),
//       capacity: this.capacity
//     });

//     this.northWest = new QuadTree({
//       boundary: new Quadrent({
//         position: {
//           x: x - quarterWidth,
//           y: y - quarterHeight
//         },
//         width: halfWidth,
//         height: halfHeight
//       }),
//       capacity: this.capacity
//     });

//     this.isSubdivided = true;

//   }
// }

export function collisionsSystem(entities) {

  const scene = Game.getCurrentScene();

  // Prepare colliders and a quad tree to find potential collision partners
  const colliders = [];
  const quadTree = new QuadTree({
    boundary: new Quadrent({
      width: scene.boundary.width + 1, // + 1 for walls to work
      height: scene.boundary.height + 1 // + 1 for walls to work
    }),
    capacity: 4
  })


  // Loop through all valid entities
  entities.forEach(_entity => {
    if (!_entity.hasComponents('transform', 'kinetic', 'rigid-body')) return;

    // Get relevant components
    const entity = {
      transform: _entity.getComponent('transform'),
      rigidBody: _entity.getComponent('rigid-body')
    }

    // Get ID to prevent collision duplicates
    entity.id = _entity.id;

    // Check that collisions are enabled
    if (!entity.rigidBody.collisionsEnabled) return;

    // Prepare transformation matrix
    const tfMatrix = getTFScaleMatrix2D(entity.transform.scale).rotate(entity.transform.rotation).translate(entity.transform.position);
    // const aabb = new AABB({})

    // Map colliders relative to worldspace
    entity.colliders = entity.rigidBody.colliders.map(_collider => {

      // Rotation matrix for direction
      const rotationMatrix = getTFRotationMatrix2(entity.transform.rotation + _collider.transform.rotation);

      // Calculate worldspace position
      const collider = {
        shape: _collider.shape,
        vertices: _collider.vertices.map(vertex => tfMatrix.multiplyVector(vertex)),
        position: tfMatrix.multiplyVector(_collider.transform.position),
        direction: rotationMatrix.multiplyVector(_collider.direction),
      }

      // Release matrix to pool
      rotationMatrix.release();

      // Circles generate faux vertices relative to other colliders on the fly - scale their radius in advance
      if (collider.shape === 'circle') {
        collider.radius = _collider.radius * entity.transform.scale * _collider.transform.scale;
      }

      // Calculate AABB for colliders
      if (collider.shape === 'circle') {
        // Circles have no vertices and so AABBs must be calculated from position and radius
        collider.aabb = new AABB({
          min: {
            x: collider.position.x - collider.radius,
            y: collider.position.y - collider.radius,
          },
          max: {
            x: collider.position.x + collider.radius,
            y: collider.position.y + collider.radius,
          }
        });
      } else {
        // Loop through all a shapes vertices and store their minimum and maximum x and y values
        let minX = null, minY = null, maxX = null, maxY = null;
        for (const vertex of collider.vertices) {
          if (minX === null || vertex.x < minX) minX = vertex.x;
          if (maxX === null || vertex.x > maxX) maxX = vertex.x;
          if (minY === null || vertex.y < minY) minY = vertex.y;
          if (maxY === null || vertex.y > maxY) maxY = vertex.y;
        }
        collider.aabb = new AABB({
          min: { x: minX, y: minY },
          max: { x: maxX, y: maxY }
        });
      }

      return collider;
    });

    // Release matrix back into pool for static memory allocation
    tfMatrix.release();

    // Use collider AABB to calculate AABB for entity
    let minX = null, minY = null, maxX = null, maxY = null;
    for (const collider of entity.colliders) {
      if (minX === null || collider.aabb.min.x < minX) minX = collider.aabb.min.x;
      if (maxX === null || collider.aabb.max.x > maxX) maxX = collider.aabb.max.x;
      if (minY === null || collider.aabb.min.y < minY) minY = collider.aabb.min.y;
      if (maxY === null || collider.aabb.max.y > maxY) maxY = collider.aabb.max.y;
    }
    entity.aabb = new AABB({
      min: { x: minX, y: minY },
      max: { x: maxX, y: maxY }
    });

    // Debug AABB
    // Game.addDebugRectangle({
    //   position: entity.transform.position,
    //   width: entity.aabb.max.x - entity.aabb.min.x,
    //   height: entity.aabb.max.y - entity.aabb.min.y,
    //   strokeColor: 'orange'
    // });

    // Get any relevant components according to collision types
    // Physics
    if (entity.rigidBody.collisionTypes.includes('physics')) {
      if (!entity.kinetic && _entity.hasComponent('kinetic')) {
        entity.kinetic = _entity.getComponent('kinetic');
      }
    }

    // Damage dealing
    if (entity.rigidBody.collisionTypes.includes('damaging')) {
      if (!entity.damaging && _entity.hasComponent('damaging')) {
        entity.damaging = _entity.getComponent('damaging');
      }
      if (!entity.destroyable && _entity.hasComponent('destroyable')) {
        entity.destroyable = _entity.getComponent('destroyable');
      }
    }

    // Damage receiving
    if (entity.rigidBody.collisionTypes.includes('damageable')) {
      if (!entity.damageable && _entity.hasComponent('damageable')) {
        entity.damageable = _entity.getComponent('damageable');
      }
      if (!entity.destroyable && _entity.hasComponent('destroyable')) {
        entity.destroyable = _entity.getComponent('destroyable');
      }
    }

    // Collectable
    if (entity.rigidBody.collisionTypes.includes('pickuppable')) {
      if (!entity.destroyable && _entity.hasComponent('destroyable')) {
        entity.destroyable = _entity.getComponent('destroyable');
      }
    }

    // Add entity to colliders and quadtree for collision detection
    colliders.push(entity);
    quadTree.insert(new EntityAABB({
      min: entity.aabb.min,
      max: entity.aabb.max,
      entityData: entity
    }));

  });

  // Map to prevent duplicate collisions
  const processedPairsMap = {};

  // Loop through colliders
  for (const entityA of colliders) {
    processedPairsMap[entityA.id] = {};

    // Use quadtree to get potential colliding entities
    const potentialColliders = quadTree.query(new EntityAABB({
      min: entityA.aabb.min,
      max: entityA.aabb.max,
      entityData: entityA
    }));

    // Loop over potential colliders
    for (const { entityData: entityB } of potentialColliders) {

      // Prevent duplicates
      if (processedPairsMap[entityB.id] && processedPairsMap[entityB.id][entityA.id]) continue;
      processedPairsMap[entityA.id][entityB.id] = true;

      // Prepare collision manifold for collision resolution
      let bestCollisionManifold;

      // Compare all colliders against each other
      for (const colliderA of entityA.colliders) {
        for (const colliderB of entityB.colliders) {

          // Test collider AABBs against each other and skip SAT if they don't collide
          if (
            colliderA.aabb.max.x < colliderB.aabb.min.x ||
            colliderA.aabb.max.y < colliderB.aabb.min.y ||
            colliderA.aabb.min.x > colliderB.aabb.max.x ||
            colliderA.aabb.min.y > colliderB.aabb.max.y
          ) continue;

          // continue;

          // Perform SAT on colliders
          const collisionManifold = seperatingAxisTheorem(colliderA, colliderB);
          
          // Best collision manifold is collider with deepest penetration
          if (!bestCollisionManifold || collisionManifold.penetration > bestCollisionManifold.penetration) {
            bestCollisionManifold = collisionManifold;
          }

        }
      }
      

      // If a collision has taken place
      if (bestCollisionManifold) {

        // Block projectiles
        if (entityA.rigidBody.collisionTypes.includes('block-projectiles') && entityB.rigidBody.collisionTypes.includes('damaging')) {
          entityB.destroyable.destroy = true;
        } else if (entityA.rigidBody.collisionTypes.includes('damaging') && entityB.rigidBody.collisionTypes.includes('block-projectiles')) {
          entityA.destroyable.destroy = true;
        }

        // Damage
        if (entityA.rigidBody.collisionTypes.includes('damaging') && entityB.rigidBody.collisionTypes.includes('damageable')) {

          // Ensure entities aren't on same team
          if (entityA.damaging.team === 'neutral' || entityB.damageable.team === 'neutral' || entityA.damaging.team !== entityB.damageable.team) {
            
            // Deal damage
            entityB.damageable.health -= entityA.damaging.damage;
            // Destroy if health is depleted
            if (entityB.damageable.health <= 0) {
              entityB.destroyable.destroy = true;
            }
            // Destroy projectile
            entityA.destroyable.destroy = true;

          }

        }
        // Damage (entities reversed) - there's probably a better way to do this
        else if (entityB.rigidBody.collisionTypes.includes('damaging') && entityA.rigidBody.collisionTypes.includes('damageable')) {
          if (entityB.damaging.team === 'neutral' || entityA.damageable.team === 'neutral' || entityB.damaging.team !== entityA.damageable.team) {
            entityA.damageable.health -= entityB.damaging.damage;
            if (entityA.damageable.health <= 0) {
              entityA.destroyable.destroy = true;
            }
            entityB.destroyable.destroy = true;
          }
        }

        // Collection/pickups - currently just rudimentary scores system
        if (entityA.rigidBody.collisionTypes.includes('pickupper') && entityB.rigidBody.collisionTypes.includes('pickuppable')) {
          console.log('Score!!!');
          entityB.destroyable.destroy = true;
        } else if (entityB.rigidBody.collisionTypes.includes('pickupper') && entityA.rigidBody.collisionTypes.includes('pickuppable')) {
          console.log('Score!!!');
          entityA.destroyable.destroy = true;
        }

        // Physics
        if (entityA.rigidBody.collisionTypes.includes('physics') && entityB.rigidBody.collisionTypes.includes('physics')) {

          resolvePenetration(entityA, entityB, bestCollisionManifold);
          resolveCollision(entityA, entityB, bestCollisionManifold);

        }
      }
    }
  }

}

function seperatingAxisTheorem(colliderA, colliderB) {

  let minOverlap = null;
  let smallestAxis = null;
  let vertexObject = null;
  
  // Get projection axes
  const axes = getProjectionAxes(colliderA, colliderB);
  const firstBodyAxisCount = getBodyAxisCount(colliderA);

  // Loop through axes
  for (let i = 0; i < axes.length; i++) {
    let axis = axes[i];

    // Generate vertices for circles if applicable
    if (colliderA.shape === 'circle') colliderA.vertices = getCircleVerticesAlongAxis(colliderA, axis);
    if (colliderB.shape === 'circle') colliderB.vertices = getCircleVerticesAlongAxis(colliderB, axis);

    // Render vertices for debug
    // const debugVertices = colliderA.vertices.concat(colliderB.vertices);
    // for (const vertex of debugVertices) {
    //   Game.addDebugCircle({
    //     position: vertex,
    //     fillColor: 'orange'
    //   });
    // }

    // Project vertices against axis
    const projectionA = projectVerticesOnToAxis(colliderA.vertices, axis);
    const projectionB = projectVerticesOnToAxis(colliderB.vertices, axis);
    
    // Calculate any overlap between vertices projections
    let overlap = Math.min(projectionA.max, projectionB.max) - Math.max(projectionA.min, projectionB.min);

    // If there is no overlap on any single axis then we can assume the shapes don't overlap
    if (overlap < 0) return false;

    // Handle containment
    if ((projectionA.max > projectionB.max && projectionA.min < projectionB.min) ||
        (projectionA.max < projectionB.max && projectionA.min > projectionB.min)) {
          const minDifference = Math.abs(projectionA.min - projectionB.min);
          const maxDifference = Math.abs(projectionA.max - projectionB.max);
          if (minDifference < maxDifference) {
            overlap += minDifference;
          } else {
            overlap += maxDifference;
            axis = axis.multiplyBy(-1);
          }
    }

    // Track minimum overlap
    if (overlap < minOverlap || minOverlap === null) {
      minOverlap = overlap;
      smallestAxis = axis;
      if (i < firstBodyAxisCount) {
        // Projecting on axes generated from entity A
        vertexObject = colliderB.vertices;
        if (projectionA.max > projectionB.max) {
          smallestAxis = axis.multiplyBy(-1);
        }
      } else {
        // Projecting on axes generated from entity B
        vertexObject = colliderA.vertices;
        if (projectionB.max > projectionA.max) {
          smallestAxis = axis.multiplyBy(-1);
        }
      }
    }
  }

  // Get MTV (minimum translation vector)
  const collisionVertex = projectVerticesOnToAxis(vertexObject, smallestAxis).collisionVertex;

  // If the penetration normal (smallest axis) points to A, flip it
  // This prevents shapes from bouncing inside each other during penetration resolution
  // This however seems to overextend penetration depth when viewed via debug
  // I'm not sure why this is or if it's even a problem as entities still act as you'd expect
  if (Vector2.dot(colliderA.position.subtract(colliderB.position), smallestAxis) < 0) {
    smallestAxis = smallestAxis.multiplyBy(-1);
  }

  // Render MTV for debug
  // Game.addDebugCircle({
  //   position: collisionVertex
  // });
  // Game.addDebugLine({
  //   position: collisionVertex,
  //   end: smallestAxis.multiplyBy(minOverlap)
  // });

  // Fix bug where entities occupying the exact same position won't resolve penetration
  if (minOverlap === 0) {
    minOverlap = 0.01
    smallestAxis.x = 0.01
  }

  // If all values overlap we know the shapes overlap
  return {
    penetration: minOverlap,
    axis: smallestAxis,
    vertex: collisionVertex
  }

}


function getBodyAxisCount(collider) {
  switch (collider.shape) {
    case 'line':
    case 'circle': return 1;
    case 'rectangle': return 2;
  }
}

// Get axes to project on - this will depend on shape
function getProjectionAxes(colliderA, colliderB) {

  const axes = [];

  switch (colliderA.shape) {
    case 'circle': {
      switch (colliderB.shape) {

        // Circle on circle
        case 'circle': {
          axes.push(colliderB.position.subtract(colliderA.position).getUnit());
          break;
        }

        // Circle on rectangle
        case 'rectangle': {
          axes.push(
            getClosestVertexToPoint(colliderB.vertices, colliderA.position).subtract(colliderA.position).getUnit(),
            colliderB.direction,
            colliderB.direction.getNormal()
          );
          break;
        }

        // Circle on line
        case 'line': {
          axes.push(
            getClosestVertexToPoint(colliderB.vertices, colliderA.position).subtract(colliderA.position).getUnit(),
            colliderB.direction.getNormal()
          );
          break;
        }

      }
      break;
    }
    case 'rectangle': {
      switch (colliderB.shape) {
        
        // Rectangle on circle
        case 'circle': {
          axes.push(
            colliderA.direction,
            colliderA.direction.getNormal(),
            getClosestVertexToPoint(colliderA.vertices, colliderB.position).subtract(colliderB.position).getUnit()
          );
          break;
        }

        // Rectangle on rectangle
        case 'rectangle': {
          axes.push(
            colliderA.direction,
            colliderA.direction.getNormal(),
            colliderB.direction,
            colliderB.direction.getNormal()
          );
          break;
        }

        // Rectangle on line
        case 'line': {
          axes.push(
            colliderA.direction,
            colliderA.direction.getNormal(),
            colliderB.direction.getNormal()
          );
          break;
        }

      }
      break;
    }

    case 'line': {

      switch (colliderB.shape) {

        // Line on Circles
        case 'circle': {
          axes.push(
            colliderA.direction.getNormal(),
            getClosestVertexToPoint(colliderA.vertices, colliderB.position).subtract(colliderB.position).getUnit(),
          );
          break;
        }

        // Line on rectangle
        case 'rectangle': {
          axes.push(
            colliderA.direction.getNormal(),
            colliderB.direction,
            colliderB.direction.getNormal()
          );
          break;
        }

        // Line on line
        case 'line': {
          axes.push(
            colliderA.direction.getNormal(),
            colliderB.direction.getNormal()
          );
          break;
        }
      }
    }
  }
  return axes;
}

function projectVerticesOnToAxis(vertices = [], axis) {

  let min = Vector2.dot(axis, vertices[0]);
  let max = min;
  let collisionVertex = vertices[0];

  for (const vertex of vertices) {

    const projectionValue = Vector2.dot(axis, vertex);
    if (projectionValue < min) {
      min = projectionValue;
      collisionVertex = vertex;
    } else if (projectionValue > max) {
      max = projectionValue;
    }
  }

  return {
    min,
    max,
    collisionVertex
  }

}

function getClosestVertexToPoint(vertices = [], point) {

  let closestVertex = null;
  let minDistanceSquared = null;

  for (const vertex of vertices) {

    const distanceSquared = point.subtract(vertex).getLengthSquared();
    if (distanceSquared < minDistanceSquared || minDistanceSquared === null) {
      closestVertex = vertex;
      minDistanceSquared = distanceSquared;
    }
  }
  return closestVertex;
}

function getCircleVerticesAlongAxis(circle, _axis) {

  const axis = _axis.getUnit();

  const vertices = [];
  vertices.push(
    circle.position.add(axis.multiplyBy(-circle.radius)),
    circle.position.add(axis.multiplyBy(circle.radius))
  )

  return vertices;
}

// Penetration resolution
function resolvePenetration(entityA, entityB, collisionManifold) {

  const { axis, penetration } = collisionManifold;

  // Prevent divide by zero
  if (entityA.rigidBody.inverseMass === 0 && entityB.rigidBody.inverseMass === 0) return;

  // Move entities so that they are not penetrating
  const penetrationResolution = axis.multiplyBy(penetration / ((entityA.rigidBody.inverseMass / entityA.transform.scale) + (entityB.rigidBody.inverseMass / entityB.transform.scale)));
  entityA.transform.position = entityA.transform.position.add(penetrationResolution.multiplyBy(entityA.rigidBody.inverseMass / entityA.transform.scale));
  entityB.transform.position = entityB.transform.position.add(penetrationResolution.multiplyBy(-entityB.rigidBody.inverseMass / entityB.transform.scale));
  return;

}


// // Collision resolution
// // Physics
// function resolveCollision(entityA, entityB, collisionManifold) {

//   // Prevent divide by zero
//   if (entityA.rigidBody.inverseMass === 0 && entityB.rigidBody.inverseMass === 0) return;

//   const { axis: collisionNormal, vertex: collisionPoint } = collisionManifold;

//   // Get closing velocities
//   const collisionArmA = collisionPoint.subtract(entityA.transform.position);
//   const rotationVelocityA = new Vector2({
//     x: entityA.kinetic.angularVelocity * collisionArmA.y,
//     y: entityA.kinetic.angularVelocity * collisionArmA.x
//   });
//   const closingVelocityA = entityA.kinetic.velocity.add(rotationVelocityA);

//   const collisionArmB = collisionPoint.subtract(entityB.transform.position);
//   const rotationVelocityB = new Vector2({
//     x: entityB.kinetic.angularVelocity * collisionArmB.y,
//     y: entityB.kinetic.angularVelocity * collisionArmB.x
//   });
//   const closingVelocityB = entityB.kinetic.velocity.add(rotationVelocityB);

//   // Get impulse augmentation
//   const collisionArmNormalCrossProductA = Vector2.cross(collisionArmA, collisionNormal);
//   const impulseAugmentationA = collisionArmNormalCrossProductA * (entityA.rigidBody.inverseInertia / entityA.transform.scale) * collisionArmNormalCrossProductA;

//   const collisionArmNormalCrossProductB = Vector2.cross(collisionArmB, collisionNormal);
//   const impulseAugmentationB = collisionArmNormalCrossProductB * (entityB.rigidBody.inverseInertia / entityB.transform.scale) * collisionArmNormalCrossProductB;

//   // Determine seperating velocity
//   const relativeVelocity = closingVelocityA.subtract(closingVelocityB);
//   const seperatingVelocity = Vector2.dot(relativeVelocity, collisionNormal);

//   // Don't resolve if velocities are seperating
//   if (seperatingVelocity > 0) return;

//   // Apply coefficient of restitution
//   const newSeperatingVelocity = -seperatingVelocity * Math.min(entityA.rigidBody.restitution, entityB.rigidBody.restitution);
//   const seperatingVelocityDifference = newSeperatingVelocity - seperatingVelocity;

//   // Calculate velocity impulse
//   const impulseMagnitude = seperatingVelocityDifference / ((entityA.rigidBody.inverseMass / entityA.transform.scale) + (entityB.rigidBody.inverseMass / entityB.transform.scale) + impulseAugmentationA + impulseAugmentationB);
//   const impulseVector = collisionNormal.multiplyBy(impulseMagnitude);

//   // Adjust velocities accordingly
//   entityA.kinetic.velocity = entityA.kinetic.velocity.add(impulseVector.multiplyBy(entityA.rigidBody.inverseMass / entityA.transform.scale));
//   entityB.kinetic.velocity = entityB.kinetic.velocity.subtract(impulseVector.multiplyBy(entityB.rigidBody.inverseMass / entityB.transform.scale));

//   entityA.kinetic.angularVelocity += entityA.rigidBody.inverseInertia / entityA.transform.scale * Vector2.cross(collisionArmA, impulseVector);
//   entityB.kinetic.angularVelocity -= entityB.rigidBody.inverseInertia / entityB.transform.scale * Vector2.cross(collisionArmB, impulseVector);

// }




// // Collision resolution
// // Physics
// function resolveCollision(entityA, entityB, collisionManifold) {

//   // Prevent divide by zero
//   if (entityA.rigidBody.inverseMass === 0 && entityB.rigidBody.inverseMass === 0) return;

//   const { axis: collisionNormal, vertex: collisionPoint } = collisionManifold;

//   // Get closing velocities
//   const collisionArmA = collisionPoint.subtract(entityA.transform.position);
//   const rotationVelocityA = new Vector2({
//     x: entityA.kinetic.angularVelocity * collisionArmA.y,
//     y: entityA.kinetic.angularVelocity * collisionArmA.x
//   });
//   const closingVelocityA = entityA.kinetic.velocity.add(rotationVelocityA);

//   const collisionArmB = collisionPoint.subtract(entityB.transform.position);
//   const rotationVelocityB = new Vector2({
//     x: entityB.kinetic.angularVelocity * collisionArmB.y,
//     y: entityB.kinetic.angularVelocity * collisionArmB.x
//   });
//   const closingVelocityB = entityB.kinetic.velocity.add(rotationVelocityB);

//   // Get impulse augmentation
//   const collisionArmNormalCrossProductA = Vector2.cross(collisionArmA, collisionNormal);
//   const impulseAugmentationA = collisionArmNormalCrossProductA * (entityA.rigidBody.inverseInertia / entityA.transform.scale) * collisionArmNormalCrossProductA;

//   const collisionArmNormalCrossProductB = Vector2.cross(collisionArmB, collisionNormal);
//   const impulseAugmentationB = collisionArmNormalCrossProductB * (entityB.rigidBody.inverseInertia / entityB.transform.scale) * collisionArmNormalCrossProductB;

//   // Determine seperating velocity
//   const relativeVelocity = closingVelocityA.subtract(closingVelocityB);
//   const seperatingVelocity = Vector2.dot(relativeVelocity, collisionNormal);

//   // Don't resolve if velocities are seperating
//   if (seperatingVelocity > 0) return;

//   // Apply coefficient of restitution
//   const newSeperatingVelocity = -seperatingVelocity * Math.min(entityA.rigidBody.restitution, entityB.rigidBody.restitution);
//   const seperatingVelocityDifference = newSeperatingVelocity - seperatingVelocity;

//   // Calculate velocity impulse
//   const impulseMagnitude = seperatingVelocityDifference / ((entityA.rigidBody.inverseMass / entityA.transform.scale) + (entityB.rigidBody.inverseMass / entityB.transform.scale) + impulseAugmentationA + impulseAugmentationB);
//   const impulseVector = collisionNormal.multiplyBy(impulseMagnitude);

//   // Adjust velocities accordingly
//   entityA.kinetic.velocity = entityA.kinetic.velocity.add(impulseVector.multiplyBy(entityA.rigidBody.inverseMass / entityA.transform.scale));
//   entityB.kinetic.velocity = entityB.kinetic.velocity.subtract(impulseVector.multiplyBy(entityB.rigidBody.inverseMass / entityB.transform.scale));

//   // // Friction!
//   const newRelativeVelocity = entityB.kinetic.velocity.subtract(entityA.kinetic.velocity);
//   const tangent = new Vector2({
//     x: newRelativeVelocity.x - Vector2.dot(newRelativeVelocity, collisionNormal) * collisionNormal.x,
//     y: newRelativeVelocity.y - Vector2.dot(newRelativeVelocity, collisionNormal) * collisionNormal.y
//   }).getUnit();
//   const frictionMagnitude = -Vector2.dot(newRelativeVelocity, tangent) / (entityA.rigidBody.inverseMass + entityB.rigidBody.inverseMass);
//   const staticFriction = Math.sqrt((entityA.rigidBody.staticFriction * entityA.rigidBody.staticFriction) + (entityB.rigidBody.staticFriction * entityB.rigidBody.staticFriction))

//   let frictionImpulse;

//   if (Math.abs(frictionMagnitude) < impulseMagnitude * staticFriction) {
//     frictionImpulse = tangent.multiplyBy(frictionMagnitude);
//   } else {
//     const dynamicFriction = Math.sqrt((entityA.rigidBody.dynamicFriction * entityA.rigidBody.dynamicFriction) + (entityB.rigidBody.dynamicFriction * entityB.rigidBody.dynamicFriction))
//     frictionImpulse = tangent.multiplyBy(-impulseMagnitude * dynamicFriction);
//   }

//   entityA.kinetic.velocity = entityA.kinetic.velocity.subtract(frictionImpulse.multiplyBy(entityA.rigidBody.inverseMass / entityA.transform.scale));
//   entityB.kinetic.velocity = entityB.kinetic.velocity.add(frictionImpulse.multiplyBy(entityB.rigidBody.inverseMass / entityB.transform.scale));
//   // // end friction




//   entityA.kinetic.angularVelocity += entityA.rigidBody.inverseInertia / entityA.transform.scale * Vector2.cross(collisionArmA, impulseVector);
//   entityB.kinetic.angularVelocity -= entityB.rigidBody.inverseInertia / entityB.transform.scale * Vector2.cross(collisionArmB, impulseVector);


// }









// // Collision resolution
// // Physics
// function resolveCollision(entityA, entityB, collisionManifold) {

//   // Prevent divide by zero
//   if (entityA.rigidBody.inverseMass === 0 && entityB.rigidBody.inverseMass === 0) return;

//   const { axis: collisionNormal, vertex: collisionPoint } = collisionManifold;

//   // Get closing velocities
//   const collisionArmA = collisionPoint.subtract(entityA.transform.position);
//   const rotationVelocityA = new Vector2({
//     x: -entityA.kinetic.angularVelocity * collisionArmA.y,
//     y: entityA.kinetic.angularVelocity * collisionArmA.x
//   });
//   const closingVelocityA = entityA.kinetic.velocity.add(rotationVelocityA);

//   const collisionArmB = collisionPoint.subtract(entityB.transform.position);
//   const rotationVelocityB = new Vector2({
//     x: -entityB.kinetic.angularVelocity * collisionArmB.y,
//     y: entityB.kinetic.angularVelocity * collisionArmB.x
//   });
//   const closingVelocityB = entityB.kinetic.velocity.add(rotationVelocityB);

//   // Get impulse augmentation
//   const collisionArmNormalCrossProductA = Vector2.cross(collisionArmA, collisionNormal);
//   const impulseAugmentationA = collisionArmNormalCrossProductA * (entityA.rigidBody.inverseInertia / entityA.transform.scale) * collisionArmNormalCrossProductA;

//   const collisionArmNormalCrossProductB = Vector2.cross(collisionArmB, collisionNormal);
//   const impulseAugmentationB = collisionArmNormalCrossProductB * (entityB.rigidBody.inverseInertia / entityB.transform.scale) * collisionArmNormalCrossProductB;

//   // Determine seperating velocity
//   const relativeVelocity = closingVelocityA.subtract(closingVelocityB);
//   const seperatingVelocity = Vector2.dot(relativeVelocity, collisionNormal);

//   // Don't resolve if velocities are seperating
//   if (seperatingVelocity > 0) return;

//   // Apply coefficient of restitution
//   const newSeperatingVelocity = -seperatingVelocity * Math.min(entityA.rigidBody.restitution, entityB.rigidBody.restitution);
//   const seperatingVelocityDifference = newSeperatingVelocity - seperatingVelocity;

//   // Calculate velocity impulse
//   const impulseMagnitude = seperatingVelocityDifference / ((entityA.rigidBody.inverseMass / entityA.transform.scale) + (entityB.rigidBody.inverseMass / entityB.transform.scale) + impulseAugmentationA + impulseAugmentationB);
//   const impulseVector = collisionNormal.multiplyBy(impulseMagnitude);

//   // Adjust velocities accordingly
//   entityA.kinetic.velocity = entityA.kinetic.velocity.add(impulseVector.multiplyBy(entityA.rigidBody.inverseMass / entityA.transform.scale));
//   entityB.kinetic.velocity = entityB.kinetic.velocity.subtract(impulseVector.multiplyBy(entityB.rigidBody.inverseMass / entityB.transform.scale));

//   // Friction!
//   const newRelativeVelocity = entityA.kinetic.velocity.subtract(entityB.kinetic.velocity);
//   const tangent = newRelativeVelocity.subtract(
//     collisionNormal.multiplyBy(Vector2.dot(newRelativeVelocity, collisionNormal))
//   ).getUnit();
//   const frictionMagnitude = -Vector2.dot(newRelativeVelocity, tangent) / ((entityA.rigidBody.inverseMass / entityA.transform.scale) + (entityB.rigidBody.inverseMass / entityB.transform.scale));
//   const staticFriction = Math.sqrt((entityA.rigidBody.staticFriction * entityA.rigidBody.staticFriction) + (entityB.rigidBody.staticFriction * entityB.rigidBody.staticFriction))

//   let frictionImpulse;

//   if (Math.abs(frictionMagnitude) < impulseMagnitude * staticFriction) {
//     frictionImpulse = tangent.multiplyBy(frictionMagnitude);
//   } else {
//     const dynamicFriction = Math.sqrt((entityA.rigidBody.dynamicFriction * entityA.rigidBody.dynamicFriction) + (entityB.rigidBody.dynamicFriction * entityB.rigidBody.dynamicFriction))
//     frictionImpulse = tangent.multiplyBy(-impulseMagnitude * dynamicFriction);
//   }

//   entityA.kinetic.velocity = entityA.kinetic.velocity.add(frictionImpulse.multiplyBy(entityA.rigidBody.inverseMass / entityA.transform.scale));
//   entityB.kinetic.velocity = entityB.kinetic.velocity.subtract(frictionImpulse.multiplyBy(entityB.rigidBody.inverseMass / entityB.transform.scale));
//   // end friction

//   entityA.kinetic.angularVelocity += entityA.rigidBody.inverseInertia / entityA.transform.scale * Vector2.cross(collisionArmA, impulseVector);
//   entityB.kinetic.angularVelocity -= entityB.rigidBody.inverseInertia / entityB.transform.scale * Vector2.cross(collisionArmB, impulseVector);

// }








// Collision resolution
// Physics
function resolveCollision(entityA, entityB, collisionManifold) {

  // Prevent divide by zero
  if (entityA.rigidBody.inverseMass === 0 && entityB.rigidBody.inverseMass === 0) return;

  const { axis: collisionNormal, vertex: collisionPoint } = collisionManifold;

  // CALCULATE INVERSE MASS and INERTIA HERE - apply scale and stuff
  const inverseMassA = entityA.rigidBody.inverseMass / entityA.transform.scale;
  const inverseMassB = entityB.rigidBody.inverseMass / entityB.transform.scale;
  const inverseInertiaA = entityA.rigidBody.inverseInertia / entityA.transform.scale;
  const inverseInertiaB = entityB.rigidBody.inverseInertia / entityB.transform.scale;

  // Get entity position relative to the collision point
  const relativePositionA = collisionPoint.subtract(entityA.transform.position);
  const relativePositionB = collisionPoint.subtract(entityB.transform.position);

  // Get the magnitude of entity velocity
  const linearVelocityA = entityA.kinetic.velocity;
  const linearVelocityB = entityB.kinetic.velocity;

  // Get the magnitude of angular velocity - 
  const angularVelocityA = new Vector2({
    x: -entityA.kinetic.angularVelocity * relativePositionA.y,
    y: entityA.kinetic.angularVelocity * relativePositionA.x
  });
  const angularVelocityB = new Vector2({
    x: -entityB.kinetic.angularVelocity * relativePositionB.y,
    y: entityB.kinetic.angularVelocity * relativePositionB.x
  });

  // Calcuate total velocity
  const totalVelocityA = linearVelocityA.add(angularVelocityA);
  const totalVelocityB = linearVelocityB.add(angularVelocityB);

  // Impulse augmentation according to angular velocity - i don't really understand this but it works...
  const collisionArmNormalCrossProductA = Vector2.cross(relativePositionA, collisionNormal);
  const collisionArmNormalCrossProductB = Vector2.cross(relativePositionB, collisionNormal);
  const impulseAugmentationA = collisionArmNormalCrossProductA * inverseInertiaA * collisionArmNormalCrossProductA;
  const impulseAugmentationB = collisionArmNormalCrossProductB * inverseInertiaB * collisionArmNormalCrossProductB;

  // Calculate seperating velocity magnitude
  const relativeVelocity = totalVelocityA.subtract(totalVelocityB);
  const velocityAlongNormal = Vector2.dot(relativeVelocity, collisionNormal);

  // If the entities aren't seperating then we need not resolve the collision
  if (velocityAlongNormal > 0) return;

  // Calculate the magnitude of the linear impulse
  const coefficientOfRestitution = Math.min(entityA.rigidBody.restitution, entityB.rigidBody.restitution);
  let j = -(1 + coefficientOfRestitution) * velocityAlongNormal;
  j /= inverseMassA + inverseMassB + impulseAugmentationA + impulseAugmentationB;

  // Create an impulse along the collision normal of that magnitude
  const linearImpulse = collisionNormal.multiplyBy(j);

  // Apply impulse to each entity
  entityA.kinetic.velocity = entityA.kinetic.velocity.add(linearImpulse.multiplyBy(inverseMassA));
  entityB.kinetic.velocity = entityB.kinetic.velocity.subtract(linearImpulse.multiplyBy(inverseMassB));

  // Apply angular velocity from linear impulse inertia
  entityA.kinetic.angularVelocity += inverseInertiaA * Vector2.cross(relativePositionA, linearImpulse);
  entityB.kinetic.angularVelocity -= inverseInertiaB * Vector2.cross(relativePositionB, linearImpulse);

  // To calculate friction, first re-calculate the new relative velocity of the two entities
  // Get the newmagnitude of entity velocity
  const newLinearVelocityA = entityA.kinetic.velocity;
  const newLinearVelocityB = entityB.kinetic.velocity;

  // Get the newmagnitude of angular velocity
  const newAngularVelocityA = new Vector2({
    x: -entityA.kinetic.angularVelocity * relativePositionA.y,
    y: entityA.kinetic.angularVelocity * relativePositionA.x
  });
  const newAngularVelocityB = new Vector2({
    x: -entityB.kinetic.angularVelocity * relativePositionB.y,
    y: entityB.kinetic.angularVelocity * relativePositionB.x
  });

  // Calcuate total velocity
  const newTotalVelocityA = newLinearVelocityA.add(newAngularVelocityA);
  const newTotalVelocityB = newLinearVelocityB.add(newAngularVelocityB);
  
  // Get new relative velocity
  const newRelativeVelocity = newTotalVelocityA.subtract(newTotalVelocityB);
  
  // Solve for tangent vector unit
  const tangent = new Vector2(
    newRelativeVelocity.subtract(collisionNormal.multiplyBy(Vector2.dot(newRelativeVelocity, collisionNormal)))
  ).getUnit();

  // Calculate the magnitude of the friction vector
  let jt = -Vector2.dot(newRelativeVelocity, tangent);
  jt /= inverseMassA + inverseMassB + impulseAugmentationA + impulseAugmentationB;

  // Use pythagorus theorem to calculate static friction. this is inaccurate but friction pairs for all materials seems overkill
  // const coefficientOfStaticFriction = Math.sqrt((entityA.rigidBody.staticFriction * entityA.rigidBody.staticFriction) + (entityB.rigidBody.staticFriction * entityB.rigidBody.staticFriction));
  // Too expensive - get average
  const coefficientOfStaticFriction = (entityA.rigidBody.staticFriction + entityB.rigidBody.staticFriction) / 2;

  // Clamp magnitude of friction and determine whether static or dynamic is required
  let frictionImpulse;
  if (Math.abs(jt) < j * coefficientOfStaticFriction) {
    frictionImpulse = tangent.multiplyBy(jt);
  } else {
  // Use pythagorus theorem to calculate dynamic friction. this is inaccurate but friction pairs for all materials seems overkill
    // const coefficientOfDynamicFriction = Math.sqrt((entityA.rigidBody.dynamicFriction * entityA.rigidBody.dynamicFriction) + (entityB.rigidBody.dynamicFriction * entityB.rigidBody.dynamicFriction));
    // Too expensive, get average
    const coefficientOfDynamicFriction = (entityA.rigidBody.dynamicFriction + entityB.rigidBody.dynamicFriction) / 2;
    frictionImpulse = tangent.multiplyBy(-j).multiplyBy(coefficientOfDynamicFriction);
  }

  // Apply friction impulse
  entityA.kinetic.velocity = entityA.kinetic.velocity.add(frictionImpulse.multiplyBy(inverseMassA));
  entityB.kinetic.velocity = entityB.kinetic.velocity.subtract(frictionImpulse.multiplyBy(inverseMassB));

  // Apply angular velocity from friction
  entityA.kinetic.angularVelocity += inverseInertiaA * Vector2.cross(relativePositionA, frictionImpulse);
  entityB.kinetic.angularVelocity -= inverseInertiaB * Vector2.cross(relativePositionB, frictionImpulse);
  
}