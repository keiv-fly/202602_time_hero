export type TileType = 'wall' | 'floor' | 'exit';

export interface Vec2 {
  x: number;
  y: number;
}

export interface Weapon {
  name: string;
  attack: number;
  durability: number;
}

export interface Hero {
  id: 'hero';
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  topLeft: Vec2;
  size: 2;
  ap: number;
  knife: Weapon;
}

export interface Rat {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  pos: Vec2;
  ap: number;
}

export type Turn = 'player' | 'enemy' | 'won' | 'lost';
export type Mode = 'move' | 'attack';
