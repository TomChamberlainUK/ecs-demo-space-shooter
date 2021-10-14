export class Entity {
  constructor() {
    this.id = getNewId();
    this.components = {}
  }

  addComponent(ComponentClass, props = {}) {
    const component = new ComponentClass(props);
    this.components[component.name] = component;
    return this;
  }

  removeComponent(componentName) {
    delete this.components[componentName];
    return this;
  }

  hasComponent(componentName) {
    return this.components[componentName];
  }

  hasComponents(...componentNames) {
    return [...componentNames].every(componentName => this.components[componentName]);
  }

  getComponent(componentName) {
    return this.components[componentName];
  }
}


// Unique ID generator
let currentNewId = 0;
function getNewId() {
  const id = currentNewId;
  currentNewId++;
  return id;
}