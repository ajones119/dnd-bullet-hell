import { ActionSequence, Actor, ActorArgs, Collider, CollisionContact, Color, Engine, Font, GameEvent, Label, ParallelActions, Rectangle, RotationType, Shape, Side, Timer, vec, Vector } from "excalibur";

import { Player } from "../players/player";
import { Resources } from "../../resources";
import { Wolf } from "../enemies/Wolf";
import { BaseEnemy } from "../enemies/baseEnemy";

export type BaseWeaponProps = ActorArgs & {angle?: Vector, player: Player}

export abstract class BaseWeapon extends Actor {
    player!: Player
    damage = 20;
    speed = 2000;
    time = 1000;
    knockback = 500;

    constructor(args: BaseWeaponProps) {
        const {angle, player, ...actorArgs} = args
        super({
            ...actorArgs
        })
        this.player = player;

        this.events.on('exitviewport', () => {
            this.kill()
        })
    }

    override onInitialize(engine: Engine): void {

    }

    abstract onEnemyCollisionSideEffects: (self: Collider, other: Collider, side: Side, contact: CollisionContact) => void

    override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        console.log(this.player.getSpeed())
        if (other.owner instanceof BaseEnemy) {
            const enemy = other.owner;

        // Deal damage
            enemy.takeDamage(this.damage);
            // Compute knockback direction
            const knockbackDir = enemy.pos.sub(this.pos).normalize();

            // Apply impulse for kickback effect
            enemy.vel = knockbackDir.scale(this.knockback);
            this.onEnemyCollisionSideEffects(self, other, side, contact);
        }
    }
}

//nex thing is to add wood score and wolves that patrol the forest