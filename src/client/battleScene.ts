import { Application, Container, Graphics, Text } from 'pixi.js';
import { createBattleState, endPlayerTurn, heroAttack, moveHero, setMode } from '../core/battle';
import type { BattleState } from '../core/battle';
import type { Action } from './actions';

const TILE = 14;

export class BattleScene {
  private readonly app: Application;
  private readonly root = new Container();
  private readonly worldLayer = new Container();
  private readonly backgroundLayer = new Container();
  private readonly tileLayer = new Container();
  private readonly entityLayer = new Container();
  private readonly uiLayer = new Container();
  private state: BattleState;
  private hud = new Text({ text: '', style: { fill: 0xffffff, fontSize: 16 } });
  private readonly actionButtons: Array<{ box: Graphics; label: Text }> = [];

  constructor(app: Application) {
    this.app = app;
    this.state = createBattleState();
    this.worldLayer.addChild(this.backgroundLayer, this.tileLayer, this.entityLayer);
    this.root.addChild(this.worldLayer, this.uiLayer);
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

  handleViewportResize(): void {
    this.updateCamera();
    this.layoutUI();
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
      const width = btn.label === 'End Turn' ? 100 : 64;
      const g = new Graphics().roundRect(0, 0, width, 32, 8).fill(0x334455);
      g.x = btn.x;
      g.eventMode = 'static';
      g.cursor = 'pointer';
      g.on('pointertap', () => {
        if (btn.mode) this.handleAction({ type: 'SetMode', mode: btn.mode });
        else this.handleAction({ type: 'EndTurn' });
      });
      const t = new Text({ text: btn.label, style: { fill: 0xffffff, fontSize: 14 } });
      t.x = btn.x + 10;
      this.uiLayer.addChild(g, t);
      this.actionButtons.push({ box: g, label: t });
    });

    this.tileLayer.eventMode = 'static';
    this.tileLayer.on('pointertap', (e) => {
      const local = e.getLocalPosition(this.worldLayer);
      const x = Math.floor(local.x / TILE);
      const y = Math.floor(local.y / TILE);
      if (x < 0 || y < 0 || x >= this.state.map.width || y >= this.state.map.height) return;
      this.handleAction({ type: 'SelectTile', x, y });
    });

    this.layoutUI();
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

    this.updateCamera();
    this.hud.text = `Turn: ${this.state.turn} | Mode: ${this.state.mode} | HP ${this.state.hero.hp}/${this.state.hero.maxHp} | AP ${this.state.hero.ap} | Knife ${this.state.hero.knife.durability}`;
  }

  private updateCamera(): void {
    const heroCenterX = (this.state.hero.topLeft.x + this.state.hero.size / 2) * TILE;
    const heroCenterY = (this.state.hero.topLeft.y + this.state.hero.size / 2) * TILE;

    const cameraX = this.app.screen.width / 2 - heroCenterX;
    const cameraY = this.app.screen.height / 2 - heroCenterY;
    this.worldLayer.position.set(Math.round(cameraX), Math.round(cameraY));
  }

  private layoutUI(): void {
    const buttonY = Math.max(44, this.app.screen.height - 40);
    this.actionButtons.forEach(({ box, label }) => {
      box.y = buttonY;
      label.y = buttonY + 8;
    });
  }
}
