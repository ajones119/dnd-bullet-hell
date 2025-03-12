import { Actor, Animation, Collider, CollisionContact, Color, Engine, Side, Sprite, SpriteSheet, vec, Vector } from "excalibur";
import { Resources } from "../../resources";
import { Config } from "../../config";
import { Player } from "../players/player";
import { BaseLevel } from "../../Levels/base";


export abstract class BaseDropItem extends Actor {
    engine: Engine;
    graphic!: Sprite;
    protected target: Player | null = null;

    constructor(engine: Engine, pos: Vector) {
        super({
            // Giving your actor a name is optional, but helps in debugging using the dev tools or debug mode
            // https://github.com/excaliburjs/excalibur-extension/
            // Chrome: https://chromewebstore.google.com/detail/excalibur-dev-tools/dinddaeielhddflijbbcmpefamfffekc
            // Firefox: https://addons.mozilla.org/en-US/firefox/addon/excalibur-dev-tools/
            name: 'BaseDrop',
            pos: pos,
            width: 55,
            height: 32,
            color: Color.Red,
            anchor: vec(0.5, 1)
            // collisionType: CollisionType.Active, // Collision Type Active means this participates in collisions read more https://excaliburjs.com/docs/collisiontypes
        });
        this.engine = engine;
        this.body.mass = 0.2;
    }

    setTarget(target: Player) {
        this.target  = target;
        this.actions.clearActions();
    }

    abstract collideWithTargetEffect : () => void

    onPreUpdate() {
        if (this.target) {
            // Move towards player
            const direction = this.target.pos.sub(this.pos).normalize();

            this.acc = direction.scale(this.target.magneticSpeed);
        }
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        if (this.target && other.owner.id === this.target.id) {
            this.collideWithTargetEffect();
            this.kill();
        }
    }
}