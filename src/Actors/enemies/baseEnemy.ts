import { Actor, Animation, Collider, CollisionContact, CollisionType, Color, Engine, Font, GameEvent, Label, Side, SpriteSheet, vec, Vector } from "excalibur";
import { Player } from "../players/player";
import { BaseLevel } from "../../Levels/base";

export abstract class BaseEnemy extends Actor {
    //state
    isAttacking = false;
    health = 100;
    damage = 10;
    speed = 50;

    walkAnimation!: Animation;
    idleAnimation!: Animation;
    runAnimation!: Animation;

    attackAnimation!: Animation;
    engine: Engine;

    constructor(engine: Engine, pos: Vector) {
        super({
            // Giving your actor a name is optional, but helps in debugging using the dev tools or debug mode
            // https://github.com/excaliburjs/excalibur-extension/
            // Chrome: https://chromewebstore.google.com/detail/excalibur-dev-tools/dinddaeielhddflijbbcmpefamfffekc
            // Firefox: https://addons.mozilla.org/en-US/firefox/addon/excalibur-dev-tools/
            name: 'BaseEnemy',
            pos: pos,
            width: 55,
            height: 32,
            color: Color.Red,
            anchor: vec(0.5, 1),
            collisionType: CollisionType.Active, // Collision Type Active means this participates in collisions read more https://excaliburjs.com/docs/collisiontypes
        });
        this.engine = engine;
        this.body.mass = 0.2;
    }

    override onInitialize(engine: Engine): void {
            this.graphics.use('walk');
            const screenWidth = engine.screen.width;
            this.pos.x = screenWidth / 2;
        }

    takeDamage(healthLost: number) {
        this.health -= healthLost;
        const jitter = Math.random() * 50 - 25;
            const label = new Label({
                text: `${healthLost}`,
                x: this.pos.x + jitter,
                y: this.pos.y - 20,
                z: 1,
                font: new Font({
                    size: 10,
                    color: Color.Red
                })
            })
    
            this.scene?.add(label);
            label.actions.moveBy(0, -50, 20).die();
        if (this.health < 0) {
            this.kill();
        } else {
            this.actions.flash(Color.Red)
        }
    }

    onPreUpdate(engine: Engine, elapsed: number): void {
        const level = engine.currentScene as BaseLevel;
        if (!level.player) {
            throw new Error("NO PLAYER!");
        }
        // Reduce knockback effect over time
        const knockbackDecay = 0.9; // Adjust between 0.8 - 0.99 for smoothness
        this.vel = this.vel.scale(knockbackDecay);

        // Normal movement logic
        if (this.vel.magnitude < this.speed) {
            const direction = level.player.pos.sub(this.pos).normalize();
            this.vel = direction.scale(this.speed);
        }

        
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
       //if the collision is with a player, damage the player
        if (other.owner instanceof Player) {
                other.owner.takeDamage(this.damage);
                //this.attack(this.engine);
        }
    }
}