// Game engine constants
export const GRID_SIZE = 20;

export const THEME = {
  background: '#050510',
  snakeHead: '#00f3ff', // Cyan
  snakeBody: '#0088ff', // Electric Blue
  food: '#ff00ff', // Magenta/Pink
  wall: '#333344',
  danger: '#ff3300',
  particles: ['#00f3ff', '#ff00ff', '#0088ff', '#ffffff']
};

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

export const INITIAL_SPEED = 150; // ms per tick
export const MIN_SPEED = 50; // fastest speed
export const RUSH_MULTIPLIER = 0.98; // speed multiplicator per eaten food
