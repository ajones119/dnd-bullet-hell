import { Timer, vec, Vector } from "excalibur";
import { BaseLevel } from "../../Levels/base";
import { BaseEnemy } from "../../Actors/enemies/baseEnemy";

export abstract class BaseEnemyFactory<T extends BaseEnemy> {
    public offscreenStandardTimer!: Timer;
    constructor(
        protected level: BaseLevel,
        private enemyClass: { new (...args: any[]): T } // Pass the class reference
    ) {
        this.offscreenStandardTimer = new Timer({
            interval: 1000,
            repeats: true,
            action: () => this.standardOffscreenSpawn()
        });
    }    

    private _spawn (positions: Vector[]) {
        const enemies = positions.map(pos => new this.enemyClass(this.level.engine, pos));
        for (let enemy of enemies) {
            this.level.add(enemy)
        }
    }

    spawn = (positions: Vector[]) => {
        // Create and add the enemy
        if (positions.length > 10) {
            this._spawn(positions); // Spawn at the valid tile position
        } else {
            this.staggeredSpawn(positions, 10, 10)
        }
    };

    staggeredSpawn(positions: Vector[], batchSize = 10, intervalMs = 100) {
        let spawned = 0;
        const amount = positions.length;
        const timer = new Timer({
            interval: intervalMs,
            repeats: true,
            action: () => {
                const batchPositions = [];
                for (let i = 0; i < batchSize && spawned < amount; i++, spawned++) {
                    batchPositions.push(positions[i]);
                }
                this._spawn(batchPositions);
    
                if (spawned >= amount) {
                    this.level.remove(timer);
                }
            }
        });
    
        this.level.add(timer);
        timer.start();
    }
    

    startStandardOffscreenSpawn(interval: number) {
        this.offscreenStandardTimer.interval = interval;
        this.offscreenStandardTimer = new Timer({
            interval: 1000,
            repeats: true,
            action: () => this.standardOffscreenSpawn()
        });
        this.level.add(this.offscreenStandardTimer);
        this.offscreenStandardTimer.start();
    }

    standardOffscreenSpawn(amount = 1) {
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
        const positions = []
        for(let i = 0; i < amount; i++) {

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
            positions.push(validTiles[Math.floor(Math.random() * validTiles.length)]);
        }
        this.spawn(positions)
        
    };

    spawnCircleAroundPoint(pointPos: Vector, radius = 300, count = 12) {
        console.log('PLAYER', pointPos)
        const positions = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = pointPos.x + Math.cos(angle) * radius;
            const y = pointPos.y + Math.sin(angle) * radius;
            positions.push(vec(x, y));
        }
        console.log('positions', positions)
        this.spawn(positions);
    }
    


    stop() {
        this.offscreenStandardTimer.cancel()
    }

    reset() {
        this.level.remove(this.offscreenStandardTimer);
        for (const actor of this.level.actors) {
            if (actor instanceof this.enemyClass) {
                actor.kill();
            }
        }
    }
}