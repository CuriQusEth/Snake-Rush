export interface Point {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface GameState {
  snake: Point[];
  direction: Point;
  nextDirection: Point;
  food: Point;
  score: number;
  combo: number;
  gameOver: boolean;
  isPaused: boolean;
  speed: number;
  particles: Particle[];
  gridWidth: number;
  gridHeight: number;
}
