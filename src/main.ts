import { Application } from 'pixi.js';
import { BattleScene } from './client/battleScene';

async function bootstrap(): Promise<void> {
  const app = new Application();
  await app.init({ background: '#101722', width: 900, height: 600, antialias: false, resolution: window.devicePixelRatio || 1 });
  document.getElementById('app')?.appendChild(app.canvas);
  const scene = new BattleScene(app);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') scene.handleAction({ type: 'Confirm' });
    if (e.key.toLowerCase() === 'm') scene.handleAction({ type: 'SetMode', mode: 'move' });
    if (e.key.toLowerCase() === 'a') scene.handleAction({ type: 'SetMode', mode: 'attack' });
    if (e.key.toLowerCase() === 'e') scene.handleAction({ type: 'EndTurn' });
  });
}

bootstrap();
