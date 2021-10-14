// Base class for all components for use in ECS systems
export class Component {
  constructor({ name = null }) {
    if (name === null) throw new Error('Components require a name');
    this.name = name;
  }
}