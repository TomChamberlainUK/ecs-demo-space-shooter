import { Game } from './core/Game.js';
import { Scene } from './core/Scene.js';

import { PlayerController } from './actors/PlayerController.js';

import { Camera } from './actors/Camera.js';
import { OutOfBounds } from './actors/OutOfBounds.js';

import { CirclePawn } from './actors/CirclePawn.js';
import { CapsulePawn } from './actors/CapsulePawn.js';
import { WallPawn } from './actors/WallPawn.js';
import { BoxPawn } from './actors/BoxPawn.js';
import { PlatformerPawn } from './actors/PlatformerPawn.js';

import { EnemyPawn } from './actors/EnemyPawn.js';

import { Coin } from './actors/Coin.js';

import { Wall } from './actors/Wall.js';
import { Rock } from './actors/Rock.js';
import { Crate } from './actors/Crate.js';
import { Sausage } from './actors/Sausage.js';
import { Spinner } from './actors/Spinner.js';

import { UnitSquare } from './actors/UnitSquare.js';

import { getRandomIntInclusive } from './core/utility/random.js';

export const scene = new Scene;

// Create a controller that converts player input to commands
const playerController = new PlayerController({
  behaviours: ['mover', 'shooter']
  // behaviours: ['steerer', 'shooter']
});

// Create a character that responds to commands
const playerPawn = new CirclePawn({ scale: 1 });
// const playerPawn = new CapsulePawn({ scale: 1, renderDirection: true })
// const playerPawn = new WallPawn({ scale: 1 }); // This glitches on collision for some reason, but only when player controlled
// const playerPawn = new BoxPawn({ scale: 1 });
// const playerPawn = new PlatformerPawn({ scale: 1 });

// Create a camera that determines where to render
const camera = new Camera({
  viewport: {
    width: Game.canvas.width,
    height: Game.canvas.height
  },
  deadzone: {
    width: 200,
    height: 200
  },
  // deadzone: {
  //   width: 20,
  //   height: 20
  // },
  // rotationDeadzone: 0.1,
  // followEntityRotation: true
});

// Link the character and camera to the controller
playerController.components['controller'].pawn = playerPawn;
playerController.components['controller'].camera = camera;

// Link camera to play character
camera.components['camera'].followedEntity = playerController.components['controller'].pawn;

// Update the camera viewport to match canvas size
window.addEventListener('resize', () => {
  camera.getComponent('camera').viewport.width = Game.canvas.scrollWidth;
  camera.getComponent('camera').viewport.height = Game.canvas.scrollHeight;
});

const roomWidth = Game.canvas.width * 5;
const roomHeight = Game.canvas.height * 5;
const roomBoundaries = {
  left: -roomWidth / 2,
  right: roomWidth / 2,
  top: -roomHeight / 2,
  bottom: roomHeight / 2,
}

const room = [
  new Wall({
    length: roomWidth,
    position: {
      x: 0,
      y: -roomHeight / 2
    },
    rotation: Math.PI / 2
  }),
  new Wall({
    length: roomWidth,
    position: {
      x: 0,
      y: roomHeight / 2
    },
    rotation: Math.PI / 2
  }),
  new Wall({
    length: roomHeight,
    position: {
      x: -roomWidth / 2,
      y: 0
    }
  }),
  new Wall({
    length: roomHeight,
    position: {
      x: roomWidth / 2,
      y: 0
    }
  })
];

// Set a boundary area
const outOfBounds = new OutOfBounds({
  width: roomWidth,
  height: roomHeight
});

// Generate destructable rocks with physics that react to collisions
const rocks = [];
for (let i = 0; i < 150; i++) {
  rocks.push(new Rock({
    position: {
      x: getRandomIntInclusive(roomBoundaries.left, roomBoundaries.right),
      y: getRandomIntInclusive(roomBoundaries.top, roomBoundaries.bottom)
    },
    radius: 16,
    scale: getRandomIntInclusive(1, 3)
  }));
}

const crates = [];
for (let i = 0; i < 75; i++) {
  crates.push(new Crate({
    position: {
      x: getRandomIntInclusive(roomBoundaries.left, roomBoundaries.right),
      y: getRandomIntInclusive(roomBoundaries.top, roomBoundaries.bottom)
    },
    rotation: getRandomIntInclusive(0, Math.PI * 2),
    scale: getRandomIntInclusive(1, 3)
  }))
}

const spinners = [];
for (let i = 0; i < 12; i++) {
  spinners.push(new Spinner({
    position: {
      x: getRandomIntInclusive(roomBoundaries.left, roomBoundaries.right),
      y: getRandomIntInclusive(roomBoundaries.top, roomBoundaries.bottom)
    },
    rotation: getRandomIntInclusive(0, Math.PI * 2),
    scale: getRandomIntInclusive(1, 3)
  }))
}

const sausages = [];
for (let i = 0; i < 25; i++) {
  sausages.push(new Sausage({
    position: {
      x: getRandomIntInclusive(roomBoundaries.left, roomBoundaries.right),
      y: getRandomIntInclusive(roomBoundaries.top, roomBoundaries.bottom)
    },
    rotation: getRandomIntInclusive(0, Math.PI * 2),
  }))
}

// Generate pickupable coins
const coins = [];
for (let i = 0; i < 10; i++) {
  coins.push(new Coin({
    position: {
      x: getRandomIntInclusive(roomBoundaries.left, roomBoundaries.right),
      y: getRandomIntInclusive(roomBoundaries.top, roomBoundaries.bottom)
    }
  }));
}

const walls = [];
for (let i = 0; i < 20; i++) {
  walls.push(new Wall({
    position: {
      x: getRandomIntInclusive(roomBoundaries.left, roomBoundaries.right),
      y: getRandomIntInclusive(roomBoundaries.top, roomBoundaries.bottom)
    },
    rotation: getRandomIntInclusive(0, Math.PI * 2),
    length: getRandomIntInclusive(128, 1024)
  }));
}

const enemies = [];
for (let i = 0; i < 30; i++) {
  const enemyController = new PlayerController({
    behaviours: ['moverAI', 'shooterAI']
  });
  
  const enemyPawn = new EnemyPawn({
    position: {
      x: getRandomIntInclusive(roomBoundaries.left, roomBoundaries.right),
      y: getRandomIntInclusive(roomBoundaries.top, roomBoundaries.bottom)
    }
  });
  
  enemyController.components['controller'].pawn = enemyPawn;
  enemyController.components['controller'].target = playerController.components['controller'].pawn;

  enemies.push(enemyController, enemyPawn);
}

// const wall = new Wall({
//   position: {
//     x: 0,
//     y: -128
//   },
//   rotation: Math.PI / 2,
//   length: 128
// })

// const box = new Box({
//   position: { x: -128, y: 0 },
// });

// const rock = new Rock({
//   position: { x: 128, y: 0 },
// });

// const spinner = new Spinner({
//   position: { x: 0, y: 128 }
// })


// Add everything into the scene
scene.addEntity(outOfBounds);
scene.addEntities(room);
scene.addEntity(camera);
scene.addEntity(playerController);
scene.addEntity(playerPawn);
// scene.addEntity(unitSquare);

// scene.addEntity(enemyController);
// scene.addEntity(enemyPawn);

// scene.addEntities(enemies);

// scene.addEntity(spinner);
// scene.addEntity(rock);
// scene.addEntity(box);
// scene.addEntity(wall);

scene.addEntities(spinners);
scene.addEntities(rocks);
scene.addEntities(crates);
scene.addEntities(walls);

scene.addEntities(coins);
scene.addEntities(sausages);

scene.setCurrentCamera(camera);
scene.setBoundary({
  width: roomWidth,
  height: roomHeight
});