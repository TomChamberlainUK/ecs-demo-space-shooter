import { Entity } from './Entity.js';
import { components } from './componentsIndex.js';
import { systems } from './systemsIndex.js';

function createEntity() {
  const entity = new Entity();
  return entity;
}

// API
export const ECS = {
  Entity,
  createEntity,
  components,
  systems
};