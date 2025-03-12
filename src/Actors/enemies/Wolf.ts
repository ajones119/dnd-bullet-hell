import { Actor, Animation, Engine, Side, SpriteSheet, vec, Vector } from "excalibur";
import { Resources } from "../../resources";
import { BaseEnemy } from "./baseEnemy";
import { SmallXp } from "../DropItems/smallXP";


export class Wolf extends BaseEnemy {
    //state
    health = 10;
    damage = 20;

    constructor(engine: Engine, pos: Vector) {
        super(engine, pos);
        this.engine = engine;

        this.events.on('kill', () => {
            const drop = new SmallXp(engine, this.pos);
            this.engine.add(drop)
        });

        const spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.WolfWalk,
            grid: {
                rows: 1,
                columns: 5,
                spriteWidth: 64,
                spriteHeight: 32
            }
        });

        this.walkAnimation = Animation.fromSpriteSheet(
            spriteSheet,
            [0, 1, 2, 3, 4],
            200,
        );

        const spriteSheetAttack = SpriteSheet.fromImageSource({
            image: Resources.WolfAttack,
            grid: {
                rows: 1,
                columns: 5,
                spriteWidth: 64,
                spriteHeight: 32
            }
        });

        this.attackAnimation = Animation.fromSpriteSheet(
            spriteSheetAttack,
            [0, 1, 2, 3, 4],
            200,
        );

        this.graphics.add('walk', this.walkAnimation);
        this.graphics.add('attack', this.attackAnimation);
    }
}