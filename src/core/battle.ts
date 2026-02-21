import { EXPANDED_MAP, euclideanCost, parseMap } from './map';
import type { BattleMap } from './map';
import type { Hero, Mode, Rat, Turn, Vec2 } from './types';

export interface BattleState {
  map: BattleMap;
  hero: Hero;
  rats: Rat[];
  turn: Turn;
  mode: Mode;
  log: string[];
}

function heroCells(topLeft: Vec2): Vec2[] {
  return [
    { x: topLeft.x, y: topLeft.y },
    { x: topLeft.x + 1, y: topLeft.y },
    { x: topLeft.x, y: topLeft.y + 1 },
    { x: topLeft.x + 1, y: topLeft.y + 1 }
  ];
}

function tileAt(map: BattleMap, pos: Vec2) {
  if (pos.y < 0 || pos.y >= map.height || pos.x < 0 || pos.x >= map.width) return 'wall';
  return map.tiles[pos.y][pos.x];
}

function canStandHero(state: BattleState, topLeft: Vec2): boolean {
  const cells = heroCells(topLeft);
  return cells.every((cell) => tileAt(state.map, cell) !== 'wall');
}

function isAdjacentToHero(heroTopLeft: Vec2, ratPos: Vec2): boolean {
  return heroCells(heroTopLeft).some((h) => Math.max(Math.abs(h.x - ratPos.x), Math.abs(h.y - ratPos.y)) <= 1);
}

export function createBattleState(): BattleState {
  const map = parseMap(EXPANDED_MAP);
  const hero: Hero = {
    id: 'hero',
    name: 'Hero',
    hp: 10,
    maxHp: 10,
    attack: 1,
    topLeft: map.heroStart,
    size: 2,
    ap: 8,
    knife: {
      name: 'knife',
      attack: 2,
      durability: 10
    }
  };

  const rats: Rat[] = map.ratStarts.map((pos, i) => ({
    id: `rat-${i + 1}`,
    name: 'Rat',
    hp: 2,
    maxHp: 2,
    attack: 2,
    pos,
    ap: 8
  }));

  return { map, hero, rats, turn: 'player', mode: 'move', log: ['Battle started'] };
}

export function setMode(state: BattleState, mode: Mode): void {
  state.mode = mode;
}

export function moveHero(state: BattleState, targetTopLeft: Vec2): boolean {
  if (state.turn !== 'player') return false;
  const cost = euclideanCost(state.hero.topLeft, targetTopLeft);
  if (cost > state.hero.ap) return false;
  if (!canStandHero(state, targetTopLeft)) return false;

  state.hero.topLeft = targetTopLeft;
  state.hero.ap -= cost;
  state.log.push(`Hero moved to (${targetTopLeft.x}, ${targetTopLeft.y}) costing ${cost} AP`);
  checkWinLoss(state);
  return true;
}

export function heroAttack(state: BattleState, ratId: string): boolean {
  if (state.turn !== 'player') return false;
  if (state.hero.ap < 4) return false;

  const rat = state.rats.find((r) => r.id === ratId && r.hp > 0);
  if (!rat) return false;
  if (!isAdjacentToHero(state.hero.topLeft, rat.pos)) return false;

  const usingKnife = state.hero.knife.durability > 0;
  const damage = usingKnife ? state.hero.knife.attack : state.hero.attack;
  rat.hp = Math.max(0, rat.hp - damage);
  state.hero.ap -= 4;
  if (usingKnife) state.hero.knife.durability -= 1;

  state.log.push(`Hero attacked ${rat.id} for ${damage} (${usingKnife ? 'knife' : 'hands'})`);
  checkWinLoss(state);
  return true;
}

function moveRatToward(rat: Rat, state: BattleState): void {
  const heroPos = state.hero.topLeft;
  const candidates: Vec2[] = [];
  for (let y = rat.pos.y - 1; y <= rat.pos.y + 1; y += 1) {
    for (let x = rat.pos.x - 1; x <= rat.pos.x + 1; x += 1) {
      if (x === rat.pos.x && y === rat.pos.y) continue;
      if (tileAt(state.map, { x, y }) === 'wall') continue;
      candidates.push({ x, y });
    }
  }

  candidates.sort((a, b) => {
    const da = euclideanCost(a, heroPos);
    const db = euclideanCost(b, heroPos);
    return da - db;
  });

  const chosen = candidates[0];
  if (!chosen) return;
  const cost = euclideanCost(rat.pos, chosen);
  if (cost <= rat.ap) {
    rat.pos = chosen;
    rat.ap -= cost;
  }
}

export function endPlayerTurn(state: BattleState): void {
  if (state.turn !== 'player') return;
  state.turn = 'enemy';
  state.hero.ap = 8;

  for (const rat of state.rats.filter((r) => r.hp > 0)) {
    rat.ap = 8;
    moveRatToward(rat, state);
    if (rat.ap >= 4 && isAdjacentToHero(state.hero.topLeft, rat.pos)) {
      state.hero.hp = Math.max(0, state.hero.hp - rat.attack);
      rat.ap -= 4;
      state.log.push(`${rat.id} attacked hero for ${rat.attack}`);
    }
    checkWinLoss(state);
    if (state.hero.hp <= 0) return;
  }

  state.turn = 'player';
}

function checkWinLoss(state: BattleState): void {
  if (state.hero.hp <= 0) {
    state.turn = 'lost';
    state.log.push('Hero was defeated');
    return;
  }
  const onExit = heroCells(state.hero.topLeft).some((c) => tileAt(state.map, c) === 'exit');
  if (onExit) {
    state.turn = 'won';
    state.log.push('Hero reached the exit');
  }
}

export function resetBattle(state: BattleState): BattleState {
  void state;
  return createBattleState();
}
