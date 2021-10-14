import { ECS } from './ECS/ECS.js';

export class Scene {
  constructor() {
    this.entities = [];
    this.currentCamera = null;
    this.boundary = {
      width: 0,
      height: 0
    }
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  addEntities(entities) {
    this.entities.push(...entities);
  }

  filterEntities() {
    this.entities = this.entities.filter(entity => {
      return (!(entity.hasComponent('destroyable') && entity.getComponent('destroyable').destroy));
    });
  }

  setCurrentCamera(camera) {
    this.currentCamera = camera;
  }

  // Boundary
  setBoundary({ width, height }) {
    this.boundary.width = width;
    this.boundary.height = height;
  }

  update() {
    this.filterEntities();
    ECS.systems.savePreviousState(this.entities);
    ECS.systems.lifespan(this.entities);
    ECS.systems.controller(this.entities);
    ECS.systems.controlledEntities(this.entities);
    ECS.systems.particleEmitter(this.entities);
    ECS.systems.particle(this.entities);
    ECS.systems.gravity(this.entities);
    ECS.systems.kinetic(this.entities);
    ECS.systems.collisions(this.entities);
    ECS.systems.outOfBounds(this.entities);
    ECS.systems.destructable(this.entities);
    ECS.systems.camera(this.entities);
  }

  render() {
    ECS.systems.renderer(this.entities, this.currentCamera);
    ECS.systems.debugRenderer(this.entities);
  }
}