import type { TileType, Vec2 } from './types';

export interface BattleMap {
  width: number;
  height: number;
  tiles: TileType[][];
  heroStart: Vec2;
  ratStarts: Vec2[];
}

export const EXPANDED_MAP = `                    ######
                    #EEEE#
                    #EEEE#
                    #EEEE#
                    #EEEE#
                    # RR #
                    #RRRR#
                    #RRRR#
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
                    #    #
#####################    #
#                        #
#                 RR     #
#                        #
#                        #
#    #####################
# R  #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
#    #
# H  #
#    #
#    #
######`;

export function parseMap(layout: string): BattleMap {
  const lines = layout.split('\n');
  const width = Math.max(...lines.map((l) => l.length));
  const normalized = lines.map((line) => line.padEnd(width, '#'));

  const tiles: TileType[][] = [];
  const ratStarts: Vec2[] = [];
  let heroStart: Vec2 | null = null;

  normalized.forEach((line, y) => {
    const row: TileType[] = [];
    for (let x = 0; x < width; x += 1) {
      const ch = line[x];
      if (ch === '#') row.push('wall');
      else if (ch === 'E') row.push('exit');
      else row.push('floor');
      if (ch === 'R') ratStarts.push({ x, y });
      if (ch === 'H') heroStart = { x, y };
    }
    tiles.push(row);
  });

  if (!heroStart) {
    throw new Error('Hero start not found in map');
  }

  return {
    width,
    height: normalized.length,
    tiles,
    heroStart,
    ratStarts
  };
}

export function euclideanCost(from: Vec2, to: Vec2): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.ceil(Math.sqrt(dx * dx + dy * dy));
}
