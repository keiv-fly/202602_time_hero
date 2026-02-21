import { describe, expect, it, vi } from 'vitest';

const pixiMocks = vi.hoisted(() => {
  class MockContainer {
    public children: unknown[] = [];
    public eventMode = '';
    public cursor = '';
    public position = {
      x: 0,
      y: 0,
      set: (x: number, y: number) => {
        this.position.x = x;
        this.position.y = y;
      }
    };

    addChild(...children: unknown[]): unknown {
      this.children.push(...children);
      return children[0];
    }

    removeChildren(): void {
      this.children = [];
    }

    on(): this {
      return this;
    }
  }

  class MockGraphics extends MockContainer {
    rect(): this {
      return this;
    }

    roundRect(): this {
      return this;
    }

    fill(): this {
      return this;
    }
  }

  class MockText {
    public x = 0;
    public y = 0;
    public text: string;

    constructor(options: { text: string }) {
      this.text = options.text;
    }
  }

  return { MockContainer, MockGraphics, MockText };
});

vi.mock('pixi.js', () => ({
  Container: pixiMocks.MockContainer,
  Graphics: pixiMocks.MockGraphics,
  Text: pixiMocks.MockText
}));

import { BattleScene } from '../src/client/battleScene';

type MockApp = {
  stage: InstanceType<typeof pixiMocks.MockContainer>;
  screen: {
    width: number;
    height: number;
  };
};

function expectHeroCentered(scene: BattleScene, app: MockApp): void {
  const internalScene = scene as unknown as {
    state: { hero: { topLeft: { x: number; y: number }; size: number } };
    worldLayer: { position: { x: number; y: number } };
  };

  const heroCenterX = (internalScene.state.hero.topLeft.x + internalScene.state.hero.size / 2) * 14;
  const heroCenterY = (internalScene.state.hero.topLeft.y + internalScene.state.hero.size / 2) * 14;
  const heroScreenX = internalScene.worldLayer.position.x + heroCenterX;
  const heroScreenY = internalScene.worldLayer.position.y + heroCenterY;

  expect(heroScreenX).toBe(app.screen.width / 2);
  expect(heroScreenY).toBe(app.screen.height / 2);
}

describe('battle scene camera', () => {
  it('keeps the hero centered after startup viewport resizes', () => {
    const app: MockApp = {
      stage: new pixiMocks.MockContainer(),
      screen: { width: 800, height: 600 }
    };

    const scene = new BattleScene(app as never);
    expectHeroCentered(scene, app);

    const viewportSizes = [
      { width: 1024, height: 768 },
      { width: 1280, height: 720 },
      { width: 1366, height: 768 },
      { width: 1920, height: 1080 }
    ];

    for (const size of viewportSizes) {
      app.screen.width = size.width;
      app.screen.height = size.height;
      scene.handleViewportResize();
      expectHeroCentered(scene, app);
    }
  });
});
