import { Game } from '../../Game.js';
import { Time } from '../../Time.js';
import { getTFMatrix2D } from '../../math/Matrix.js'; 
import { Vector2 } from '../../math/Vector2.js';

export function rendererSystem(_entities, _camera) {

  // Sort entities by layer:
  //  0 is baseline
  //  < 0 will be rendered before
  //  > 0 will be rendered after
  const entities = _entities.filter(entity => entity.hasComponent('render'))
                            .sort((a, b) => a.getComponent('render').layer - b.getComponent('render').layer);

  // Clear the canvas
  Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

  // Get relevant camera components
  const camera = {
    camera: _camera.getComponent('camera'),
    transform: _camera.getComponent('transform')
  }

  // Use linear interpolation to find camera position
  const fixedTimeStepAlpha = Time.getAccumulatedTime() / Time.getFixedTimeStep();
  const cameraLerpPosition = camera.transform.position.multiplyBy(fixedTimeStepAlpha).add(camera.transform.previousPosition.multiplyBy(1 - fixedTimeStepAlpha));
  const cameraLerpRotation = camera.transform.rotation * fixedTimeStepAlpha + camera.transform.previousRotation * (1 - fixedTimeStepAlpha);

  // Save transformation context to restore back to default
  Game.ctx.save();

  // Change origin to be centered - canvas default is top left
  Game.ctx.translate(camera.camera.viewport.width / 2, camera.camera.viewport.height / 2);

  // Apply camera transformations
  Game.ctx.scale(camera.camera.zoom, camera.camera.zoom);
  Game.ctx.rotate(-cameraLerpRotation);
  Game.ctx.translate(-cameraLerpPosition.x, -cameraLerpPosition.y);

  // Get camera edges for off-screen render culling
  const tfMatrix = getTFMatrix2D().rotate(camera.transform.rotation).translate(camera.transform.position);
  const viewportVertices = [
    new Vector2({
      x: -camera.camera.viewport.width / 2 / camera.camera.zoom,
      y: -camera.camera.viewport.height / 2 / camera.camera.zoom,
    }),
    new Vector2({
      x: camera.camera.viewport.width / 2 / camera.camera.zoom,
      y: -camera.camera.viewport.height / 2 / camera.camera.zoom,
    }),
    new Vector2({
      x: camera.camera.viewport.width / 2 / camera.camera.zoom,
      y: camera.camera.viewport.height / 2 / camera.camera.zoom,
    }),
    new Vector2({
      x: -camera.camera.viewport.width / 2 / camera.camera.zoom,
      y: camera.camera.viewport.height / 2 / camera.camera.zoom,
    })
  ].map(vertex => {
    return tfMatrix.multiplyVector(vertex);
  });
  tfMatrix.release();

  class AABB {
    constructor({
      min = { x: 0, y: 0 },
      max = { x: 0, y: 0 }
    }) {
      this.min = min;
      this.max = max;
    }
  }

  let minX = null, minY = null, maxX = null, maxY = null;
  for (const vertex of viewportVertices) {
    if (minX === null || vertex.x < minX) minX = vertex.x;
    if (maxX === null || vertex.x > maxX) maxX = vertex.x;
    if (minY === null || vertex.y < minY) minY = vertex.y;
    if (maxY === null || vertex.y > maxY) maxY = vertex.y;
  }
  const viewport = new AABB({
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY }
  });

  const cameraEdge = {
    left: viewport.min.x,
    right: viewport.max.x,
    top: viewport.min.y,
    bottom: viewport.max.y,
  }

  // Debug faux camera viewport
  // Game.ctx.beginPath();
  // Game.ctx.rect(
  //   cameraEdge.left,
  //   cameraEdge.top,
  //   cameraEdge.right - cameraEdge.left,
  //   cameraEdge.bottom - cameraEdge.top
  // );
  // Game.ctx.closePath();
  // Game.ctx.strokeStyle = 'green';
  // Game.ctx.stroke();

  // Loop through valid renderable entities
  entities.forEach(_entity => {
    if (!_entity.hasComponents('render', 'transform')) return;

    // Get relevant entity components
    const entity = {
      transform: _entity.getComponent('transform'),
      render: _entity.getComponent('render'),
      rigidBody: _entity.getComponent('rigid-body')
    }

    // Use linear interpolation to find entity render position
    const position = entity.transform.position.multiplyBy(fixedTimeStepAlpha).add(entity.transform.previousPosition.multiplyBy(1 - fixedTimeStepAlpha));
    const rotation = (entity.transform.rotation * fixedTimeStepAlpha) + (entity.transform.previousRotation * (1 - fixedTimeStepAlpha));
    const scale = (entity.transform.scale * fixedTimeStepAlpha) + (entity.transform.previousScale * (1 - fixedTimeStepAlpha));

    // Don't render if out of camera view
    const renderRadius = entity.render.renderRadius * entity.transform.scale
    if (
      position.x + renderRadius < cameraEdge.left ||
      position.x - renderRadius > cameraEdge.right ||
      position.y + renderRadius < cameraEdge.top ||
      position.y - renderRadius > cameraEdge.bottom
    ) return;

    // Render geometric shapes
    if (entity.render.type === 'geometry') {

      // Start drawing on canvas context
      Game.ctx.save();
      Game.ctx.translate(position.x, position.y);
      Game.ctx.rotate(rotation);
      Game.ctx.scale(scale, scale);
      Game.ctx.beginPath();

      // Check geometry shape
      switch (entity.render.shape) {

        // Render circles
        case 'circle': {
          // Draw a circle on the canvas context
          Game.ctx.arc(
            0,
            0,
            entity.render.radius,
            0,
            Math.PI * 2
          );
          break;
        }

        // Render capsules
        case 'capsule': {
          // Draw a capsule
          Game.ctx.arc(
            entity.render.start.x,
            entity.render.start.y,
            entity.render.radius,
            entity.render.angle + Math.PI / 2,
            entity.render.angle + 3 * Math.PI / 2
          );
          Game.ctx.arc(
            entity.render.end.x,
            entity.render.end.y,
            entity.render.radius,
            entity.render.angle - Math.PI / 2,
            entity.render.angle + Math.PI / 2
          );
          // Draw a line to show direction
          if (entity.render.renderDirection) {
            let front = entity.render.end.add(entity.render.direction.multiplyBy(entity.render.radius));
            Game.ctx.moveTo(
              entity.render.end.x,
              entity.render.end.y
            );
            Game.ctx.lineTo(
              front.x,
              front.y
            );
          }
          break;
        }

        // Render lines
        case 'line': {
          // Draw a line on the canvas context
          Game.ctx.moveTo(
            entity.render.start.x,
            entity.render.start.y
          );
          Game.ctx.lineTo(
            entity.render.end.x,
            entity.render.end.y
          );
          break;
        }

        // Render rectangles
        case 'rectangle': {
          // Draw a rectangle on the canvas context
          Game.ctx.rect(
            -entity.render.width / 2,
            -entity.render.height / 2,
            entity.render.width,
            entity.render.height
          );
          break;
        }
      }

      // Finish drawing on canvas context
      Game.ctx.closePath();

      // Render colors
      const fillColor = entity.render.fillColor;
      const strokeColor = entity.render.strokeColor;
      if (fillColor) {
        Game.ctx.fillStyle = fillColor;
        Game.ctx.fill();
      }
      if (strokeColor) {
        Game.ctx.strokeStyle = strokeColor;
        Game.ctx.stroke();
      }
      
    }

    // Restore from entity transformations
    Game.ctx.restore();

  });

  // Restore from camera transformation
  Game.ctx.restore();

}