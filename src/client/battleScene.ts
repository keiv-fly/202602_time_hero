import { Application, Container, Graphics, Text } from 'pixi.js';
import { createBattleState, endPlayerTurn, heroAttack, moveHero, setMode } from '../core/battle';
import type { BattleState } from '../core/battle';
import type { Action } from './actions';

const TILE = 14;

export class BattleScene {
  private readonly app: Application;
  private readonly root = new Container();
  private readonly backgroundLayer = new Container();
  private readonly tileLayer = new Container();
  private readonly entityLayer = new Container();
  private readonly uiLayer = new Container();
  private state: BattleState;
  private hud = new Text({ text: '', style: { fill: 0xffffff, fontSize: 16 } });

  constructor(app: Application) {
    this.app = app;
    this.state = createBattleState();
    this.root.addChild(this.backgroundLayer, this.tileLayer, this.entityLayer, this.uiLayer);
    this.app.stage.addChild(this.root);
    this.buildUI();
    this.render();
  }

  handleAction(action: Action): void {
    if (this.state.turn === 'won' || this.state.turn === 'lost') {
      if (action.type === 'Confirm') this.state = createBattleState();
      this.render();
      return;
    }

    if (action.type === 'SelectTile' && this.state.turn === 'player') {
      if (this.state.mode === 'move') {
        moveHero(this.state, { x: action.x, y: action.y });
      } else {
        const rat = this.state.rats.find((r) => r.hp > 0 && r.pos.x === action.x && r.pos.y === action.y);
        if (rat) heroAttack(this.state, rat.id);
      }
    }

    if (action.type === 'SetMode') setMode(this.state, action.mode);
    if (action.type === 'EndTurn') endPlayerTurn(this.state);
    this.render();
  }

  private buildUI(): void {
    this.hud.x = 8;
    this.hud.y = 8;
    this.uiLayer.addChild(this.hud);

    const buttons = [
      { label: 'Move', x: 8, mode: 'move' as const },
      { label: 'Attack', x: 84, mode: 'attack' as const },
      { label: 'End Turn', x: 170, mode: null }
    ];

    buttons.forEach((btn) => {
      const g = new Graphics().roundRect(btn.x, 560, btn.label === 'End Turn' ? 100 : 64, 32, 8).fill(0x334455);
      g.eventMode = 'static';
      g.cursor = 'pointer';
      g.on('pointertap', () => {
        if (btn.mode) this.handleAction({ type: 'SetMode', mode: btn.mode });
        else this.handleAction({ type: 'EndTurn' });
      });
      const t = new Text({ text: btn.label, style: { fill: 0xffffff, fontSize: 14 } });
      t.x = btn.x + 10;
      t.y = 568;
      this.uiLayer.addChild(g, t);
    });

    this.tileLayer.eventMode = 'static';
    this.tileLayer.on('pointertap', (e) => {
      const x = Math.floor(e.global.x / TILE);
      const y = Math.floor(e.global.y / TILE);
      this.handleAction({ type: 'SelectTile', x, y });
    });
  }

  private render(): void {
    this.backgroundLayer.removeChildren();
    this.tileLayer.removeChildren();
    this.entityLayer.removeChildren();

    const map = this.state.map;
    for (let y = 0; y < map.height; y += 1) {
      for (let x = 0; x < map.width; x += 1) {
        const tile = map.tiles[y][x];
        const color = tile === 'wall' ? 0x222222 : tile === 'exit' ? 0x1f7a1f : 0x444444;
        this.tileLayer.addChild(new Graphics().rect(x * TILE, y * TILE, TILE - 1, TILE - 1).fill(color));
      }
    }

    const hero = new Graphics().rect(this.state.hero.topLeft.x * TILE, this.state.hero.topLeft.y * TILE, TILE * 2 - 2, TILE * 2 - 2).fill(0x4d9dff);
    this.entityLayer.addChild(hero);

    for (const rat of this.state.rats.filter((r) => r.hp > 0)) {
      this.entityLayer.addChild(new Graphics().rect(rat.pos.x * TILE + 2, rat.pos.y * TILE + 2, TILE - 4, TILE - 4).fill(0xff5555));
    }

    this.hud.text = `Turn: ${this.state.turn} | Mode: ${this.state.mode} | HP ${this.state.hero.hp}/${this.state.hero.maxHp} | AP ${this.state.hero.ap} | Knife ${this.state.hero.knife.durability}`;
  }
}
