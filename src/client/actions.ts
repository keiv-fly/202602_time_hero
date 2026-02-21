export type Action =
  | { type: 'Confirm' }
  | { type: 'Cancel' }
  | { type: 'Navigate'; direction: 'up' | 'down' | 'left' | 'right' }
  | { type: 'SelectTile'; x: number; y: number }
  | { type: 'EndTurn' }
  | { type: 'SetMode'; mode: 'move' | 'attack' };
