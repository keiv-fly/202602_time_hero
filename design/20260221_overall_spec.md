Below is the **fully rewritten and consolidated requirements specification** with your updated input rules applied consistently.

---

# Game Requirements Specification

**Stack:** PixiJS everywhere (Option A)
**Iteration 1 Scope:** Battle Scene only

---

# 1. Product Overview

## 1.1 Goals

1. The game runs in a browser on desktop and mobile.
2. The game is turn-based.
3. The game uses tile-based visuals.
4. The game uses **PixiJS as the single rendering and input stack**.
5. The game supports multiple scenes (Battle now, World later).
6. Iteration 1 delivers a fully playable Battle Scene.

---

# 2. Platform Requirements

## 2.1 Supported Browsers

The game must run in:

* Chrome (desktop + Android)
* Safari (iOS)
* Firefox (desktop)

## 2.2 Performance

1. Rendering must target 60 FPS.
2. Battle resolution must complete within a perceptually instant delay (target < 50 ms).
3. The game must avoid unnecessary per-frame allocations.

---

# 3. Architecture Requirements

## 3.1 Layered Architecture

The system must consist of:

### 1. Core Simulation Layer (TypeScript, engine-agnostic)

* Contains battle rules and state.
* Must not import PixiJS.
* Must be deterministic based on input actions.

### 2. Client Layer (PixiJS)

* Rendering
* Input handling
* Scene management
* UI

### 3. Scene Manager

The game must support:

* Scene registration
* Scene switching
* Lifecycle methods:

  * `enter(payload)`
  * `update(dt)`
  * `handleAction(action)`
  * `exit(): payload`

---

# 4. Rendering Requirements (PixiJS)

## 4.1 Renderer

1. The game must use a single `PIXI.Application`.
2. The renderer must support:

   * A fixed logical resolution.
   * Scaling to screen size.
   * Correct handling of devicePixelRatio.
3. Tiles must render pixel-perfect (nearest-neighbor scaling supported).

## 4.2 Layer Structure

The battle scene must use at least:

1. Background layer
2. Tile layer
3. Entity layer
4. UI layer

Optional:

* Effects layer (for hit flashes)

## 4.3 Assets

1. All assets must be loaded via a centralized asset loader.
2. Sprites may use a texture atlas.
3. Battle must render:

   * Player sprite
   * Enemy sprite(s)
   * Decorative tile arena background

---

# 5. Input Requirements

## 5.1 Supported Input Modes

The battle must be fully playable using:

* **Keyboard and mouse only**
* **Touch only**

The game must function correctly in both modes without requiring the other.

---

## 5.2 Input Abstraction

All input must be converted into high-level Actions:

* `Confirm`
* `Cancel`
* `Navigate(direction)`
* `SelectTile(x, y)`

Scenes must consume Actions rather than raw device events.

---

## 5.3 Navigation Rules

### Navigation:

* **Keyboard and mouse:**

  * Click buttons to choose actions
  * Click on target (enemy) to attack
  * Optional keyboard shortcuts for confirm/cancel

* **Touch:**

  * Tap buttons to choose actions

Direct tile clicking is allowed in keyboard/mouse mode.

---

## 5.4 UX Requirements

1. The battle must be fully playable using:

   * Keyboard and mouse only
   * Touch only
2. Touch targets must be large enough for mobile interaction.
3. UI must remain readable on small screens.

---

# 6. Iteration 1 – Battle Scene Requirements

## 6.1 Scope

Iteration 1 must implement:

* A single battle arena
* A complete turn-based loop
* Player vs enemy
* Win/lose states
* Restart capability

Not included:

* World scene
* Rust/WASM
* Inventory
* Skills
* Defense stat

---

# 6.2 Battle Rules

## 6.2.1 Entities

Each entity must have:

* `id`
* `name`
* `hp`
* `maxHp`
* `attack`

No defense stat.

---

## 6.2.2 Turn Order

1. Battle is strictly turn-based.
2. Turn order:

   * Player
   * Enemy
   * Repeat
3. Only one entity acts per turn.

---

## 6.2.3 Player Actions

The player must have only:

* `Attack`
* `Wait`

No Skill action.
No Item action.

### Attack

* Reduces enemy HP by attack value.
* May include simple random variation (optional).

### Wait

* Ends the player turn without effect.

---

## 6.2.4 Enemy AI

1. Enemy must always:

   * Use `Attack`.
2. Enemy targets the player.

---

## 6.2.5 End Conditions

Battle ends when:

* Enemy HP ≤ 0 → Victory
* Player HP ≤ 0 → Defeat

Battle result must contain:

* `outcome: "victory" | "defeat"`

No rewards required in Iteration 1.

---

# 6.3 Battle Visual Requirements

## 6.3.1 Arena

1. Must render a fixed-size arena (example: 10 × 6 tiles).
2. Tiles are decorative only.

## 6.3.2 Entity Placement

1. Player sprite placed at a fixed tile.
2. Enemy sprite placed at a fixed tile.

## 6.3.3 Combat Feedback

The battle must display:

* Player HP
* Enemy HP
* Current turn indicator (e.g., “Player Turn”)
* Damage feedback:

  * Numeric popup OR
  * Combat log line

Optional:

* Brief sprite flash on hit.

---

# 6.4 Battle UI

## 6.4.1 Action Menu

The UI must provide:

* Visible buttons for:

  * Attack
  * Wait

Navigation:

* **Keyboard and mouse:** Click buttons and click target enemy.
* **Touch:** Tap buttons.

---

## 6.4.2 Post-Battle Screen

After victory or defeat:

* Display outcome message.
* Provide a Restart option.

---

# 7. Determinism and Testing

1. Battle simulation must be testable without PixiJS.
2. It must be possible to:

   * Instantiate battle state
   * Apply actions
   * Assert resulting state
3. Battle logic must not depend on frame timing.

---

# 8. Error Handling

1. Asset loading failures must display a fallback error message.
2. Invalid actions must not crash the game.

---

# 9. Roadmap – Future Iterations

## 9.1 World Scene (Rust/WASM)

1. World simulation will be implemented in Rust compiled to WebAssembly.
2. World Scene must:

   * Use the same PixiJS renderer
   * Use the same input abstraction
   * Use the same Scene Manager
3. JS ↔ WASM boundary must use:

   * Typed arrays
   * Packed data structures
   * No large per-frame object allocations

## 9.2 Scene Transitions

1. World must be able to enter Battle with `BattleInit`.
2. Battle must return `BattleResult`.
3. Scene transitions must be handled by Scene Manager.

---

# 10. Non-Goals (Iteration 1)

* No world exploration
* No inventory
* No skills
* No defense stat
* No persistent storage
* No multiplayer
* No procedural generation
* No advanced animation systems

