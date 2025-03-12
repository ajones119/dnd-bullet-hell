import { Random, Timer, vec, Vector } from "excalibur";
import { Wolf } from "../../Actors/enemies/Wolf";
import { BaseLevel } from "../../Levels/base";
import { BaseEnemy } from "../../Actors/enemies/baseEnemy";
import { BaseEnemyFactory } from "./base-enemy-factory";

export class WolfFactory extends BaseEnemyFactory<Wolf> {
    constructor(
        level: BaseLevel,
        intervalMs: number,

    ) {
        super(level, intervalMs)
    }

    spawn = (pos: Vector) => {
        // Create and add the enemy
        const wolf = new Wolf(this.level.engine, pos);
        this.level.add(wolf);
    };
    

    start() {
        this.timer.start();
    }

    stop() {
        this.timer.cancel()
    }

    reset() {
        for (const actor of this.level.actors) {
            if (actor instanceof Wolf)
                actor.kill()
            
        }
    }
}