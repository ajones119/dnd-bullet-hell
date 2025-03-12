import { Random, Timer, vec, Vector } from "excalibur";
import { BaseLevel } from "../../Levels/base";
import { BaseEnemy } from "../../Actors/enemies/baseEnemy";

export abstract class BaseEnemyFactory<T extends BaseEnemy> {
    protected timer: Timer;
    constructor(
        protected level: BaseLevel,
        intervalMs: number
    ) {
        this.timer = new Timer({
            interval: intervalMs,
            repeats: true,
            action: () => this.standardOffscreenSpawn()
        });
        this.level.add(this.timer);
    }

    abstract spawn: (pos: Vector) => void;

    standardOffscreenSpawn() {
        const engine = this.level.engine;
        const camera = engine.currentScene.camera; // Get the camera
        const viewportWidth = engine.drawWidth;
        const viewportHeight = engine.drawHeight;
        const tilemap = this.level.tileMap; // Get tilemap
    
        const validTiles: Vector[] = [];
    
        // Collect all valid (walkable) tiles inside the walls
        for (let y = 1; y < tilemap.rows - 1; y++) { // Ignore walls
            for (let x = 1; x < tilemap.columns - 1; x++) {
                const tile = tilemap.getTile(x, y);
                if (tile && !tile.solid) { // Only pick walkable tiles
                    validTiles.push(vec(x * tilemap.tileWidth, y * tilemap.tileHeight));
                }
            }
        }
    
        if (validTiles.length === 0) return; // No valid tiles
    
        /**@ts-ignore */
        let x = 0, y = 0;
        const edge = Math.floor(Math.random() * 4);
    
        // Randomly pick a spawn location off-screen (top, bottom, left, right)
        switch (edge) {
            case 0: // Top (above screen)
                x = camera.pos.x + (Math.random() * viewportWidth) - viewportWidth / 2;
                y = camera.pos.y - viewportHeight / 2 - 50;
                break;
            case 1: // Bottom (below screen)
                x = camera.pos.x + (Math.random() * viewportWidth) - viewportWidth / 2;
                y = camera.pos.y + viewportHeight / 2 + 50;
                break;
            case 2: // Left (off left side)
                x = camera.pos.x - viewportWidth / 2 - 50;
                y = camera.pos.y + (Math.random() * viewportHeight) - viewportHeight / 2;
                break;
            case 3: // Right (off right side)
                x = camera.pos.x + viewportWidth / 2 + 50;
                y = camera.pos.y + (Math.random() * viewportHeight) - viewportHeight / 2;
                break;
        }
    
        // Now that the spawn is off-screen, check if there's a valid walkable tile near the off-screen position
        // Get the closest valid tile from the off-screen spawn position
        const spawnPos = validTiles[Math.floor(Math.random() * validTiles.length)];
        this.spawn(spawnPos); // Spawn at the valid tile position
    };

    start() {
        this.timer.start();
    }

    stop() {
        this.timer.cancel()
    }

    reset() {
        for (const actor of this.level.actors) {
            if (actor instanceof BaseEnemy)
                actor.kill()
            
        }
    }
}