import { describe, expect, it } from 'vitest';
import { createBattleState, heroAttack, moveHero } from '../src/core/battle';
import { euclideanCost, parseMap } from '../src/core/map';

describe('map parsing', () => {
  it('finds hero, rats and exit tiles', () => {
    const state = createBattleState();
    expect(state.map.heroStart).toBeTruthy();
    expect(state.rats.length).toBeGreaterThan(0);
    const exitCount = state.map.tiles.flat().filter((t) => t === 'exit').length;
    expect(exitCount).toBe(16);
  });

  it('pads jagged maps as walls', () => {
    const map = parseMap('##\n#H');
    expect(map.width).toBe(2);
    expect(map.tiles[1][1]).toBe('floor');
  });
});

describe('euclidean AP costing', () => {
  it('matches ceil(sqrt(x^2+y^2))', () => {
    expect(euclideanCost({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    expect(euclideanCost({ x: 2, y: 2 }, { x: 3, y: 2 })).toBe(1);
  });
});

describe('battle rules', () => {
  it('uses knife then fists when durability is depleted', () => {
    const state = createBattleState();
    state.hero.topLeft = { x: 10, y: 26 };
    state.rats[0].pos = { x: 11, y: 25 };
    state.rats[1].pos = { x: 12, y: 25 };

    state.hero.knife.durability = 1;
    state.hero.ap = 8;
    expect(heroAttack(state, state.rats[0].id)).toBe(true);
    expect(state.hero.knife.durability).toBe(0);

    state.hero.ap = 8;
    expect(heroAttack(state, state.rats[1].id)).toBe(true);
    expect(state.rats[1].hp).toBe(1);
  });

  it('consumes AP on movement by euclidean distance', () => {
    const state = createBattleState();
    state.hero.topLeft = { x: 10, y: 26 };
    const to = { x: 13, y: 22 };
    const cost = euclideanCost(state.hero.topLeft, to);
    expect(cost).toBe(5);
    expect(moveHero(state, to)).toBe(true);
    expect(state.hero.ap).toBe(3);
  });
});
