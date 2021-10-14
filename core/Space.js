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

// Quadrent coords for quadtree
export class EntityAABB {
  constructor({
    min = { x: 0, y: 0 },
    max = { x: 0, y: 0 },
    entityData = null
  }) {
    this.min = min;
    this.max = max;
    this.entityData = entityData;
  }

  intersects(range) {
    return !(
      this.max.x < range.min.x ||
      this.max.y < range.min.y ||
      this.min.x > range.max.x ||
      this.min.y > range.max.y
    );
  }
}

export class Quadrent {
  constructor({
    position = { x: 0, y: 0 },
    width = 0,
    height = 0
  }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;
    this.min = {
      x: this.position.x - this.halfWidth,
      y: this.position.y - this.halfHeight
    }
    this.max = {
      x: this.position.x + this.halfWidth,
      y: this.position.y + this.halfHeight
    }
  }

  contains(aabb) {
    return (
      aabb.min.x >= this.min.x &&
      aabb.max.x < this.max.x &&
      aabb.min.y >= this.min.y &&
      aabb.max.y < this.max.y
    );
  }

  intersects(range) {
    return !(
      this.max.x < range.min.x ||
      this.max.y < range.min.y ||
      this.min.x > range.max.x ||
      this.min.y > range.max.y
    );
  }
}

// Quadtree for collision partners
export class QuadTree {
  constructor({
    boundary,
    capacity,
    entities = []
  }) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.entities = entities;
    this.isSubdivided = false;

    // Debug
    // Game.addDebugRectangle({
    //   position: this.boundary.position,
    //   width: this.boundary.width,
    //   height: this.boundary.height
    // });
  }

  // Add entity to tree - returns true if successful
  insert(entityAABB) {
    // If entity's AABB does not fit in boundary
    if (!this.boundary.contains(entityAABB)) return false;
    // If there is still space within this node, add the entity
    if (this.entities.length < this.capacity) {
      this.entities.push(entityAABB);
      return true;
    } else {
      // Subdivide this node if it's not already been done
      if (!this.isSubdivided) this.subdivide();
      // Try to fit entity in a subdivision
      if (
        this.northEast.insert(entityAABB) ||
        this.southEast.insert(entityAABB) ||
        this.southWest.insert(entityAABB) ||
        this.northWest.insert(entityAABB)
      ) {
        return true;
      }
      // If the entity is too big for any subdivision, overload this node's entity list
      else {
        this.entities.push(entityAABB);
        return true;
      }
    }
  }

  query(queryAABB, found = []) {
    // If the query doesn't overlap the boundary, return current found
    if (!this.boundary.intersects(queryAABB)) return found;

    // Check each entity against the query
    for (const entityAABB of this.entities) {
      if (queryAABB.entityData === entityAABB.entityData) continue; // skip self
      // If the AABBs overlap, add to found array
      if (queryAABB.intersects(entityAABB)) {
        found.push(entityAABB);
      }
    }

    // Recurse through subdivisions
    if (this.isSubdivided) {
      this.northEast.query(queryAABB, found);
      this.southEast.query(queryAABB, found);
      this.southWest.query(queryAABB, found);
      this.northWest.query(queryAABB, found);
    }

    // Return all matching entities
    return found;
  }

  subdivide() {

    const { x, y } = this.boundary.position;
    const { halfWidth, halfHeight } = this.boundary;
    const quarterWidth = halfWidth / 2;
    const quarterHeight = halfHeight / 2;
    
    this.northEast = new QuadTree({
      boundary: new Quadrent({
        position: {
          x: x + quarterWidth,
          y: y - quarterHeight
        },
        width: halfWidth,
        height: halfHeight
      }),
      capacity: this.capacity
    });

    this.southEast = new QuadTree({
      boundary: new Quadrent({
        position: {
          x: x + quarterWidth,
          y: y + quarterHeight
        },
        width: halfWidth,
        height: halfHeight
      }),
      capacity: this.capacity
    });

    this.southWest = new QuadTree({
      boundary: new Quadrent({
        position: {
          x: x - quarterWidth,
          y: y + quarterHeight
        },
        width: halfWidth,
        height: halfHeight
      }),
      capacity: this.capacity
    });

    this.northWest = new QuadTree({
      boundary: new Quadrent({
        position: {
          x: x - quarterWidth,
          y: y - quarterHeight
        },
        width: halfWidth,
        height: halfHeight
      }),
      capacity: this.capacity
    });

    this.isSubdivided = true;

  }
}