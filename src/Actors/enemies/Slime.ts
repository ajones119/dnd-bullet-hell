import { Animation, Collider, Engine, SpriteSheet, Vector } from "excalibur";
import { Resources } from "../../resources";
import { BaseEnemy } from "./baseEnemy";
import { SmallXp } from "../DropItems/smallXP";

export class Slime extends BaseEnemy {
    //state
    health = 30;
    damage = 5;

    constructor(engine: Engine, pos: Vector) {
        super(engine, pos);
        this.engine = engine;

        this.events.on('kill', () => {
            const drop = new SmallXp(engine, this.pos);
            this.engine.add(drop)
        });

        const spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.SlimeWalk,
            grid: {
                rows: 1,
                columns: 7,
                spriteWidth: 128,
                spriteHeight: 128
            }
        });

        this.walkAnimation = Animation.fromSpriteSheet(
            spriteSheet,
            [0, 1, 2, 3, 4],
            150,
        );

        const spriteSheetAttack = SpriteSheet.fromImageSource({
            image: Resources.SlimeAttack,
            grid: {
                rows: 1,
                columns: 10,
                spriteWidth: 128,
                spriteHeight: 128
            }
        });

        this.attackAnimation = Animation.fromSpriteSheet(
            spriteSheetAttack,
            [0, 1, 2, 3, 4],
            250,
        );

        this.graphics.add('walk', this.walkAnimation);
        this.graphics.add('attack', this.attackAnimation);
    }
}