import { Collider, CollisionContact, Engine, Shape, Side, vec, Vector, Color, Circle, Graphic } from "excalibur";

import { Resources } from "../../resources";
import { BaseWeapon, BaseWeaponProps } from "./baseWeapon";
import { BaseEnemy } from "../enemies/baseEnemy";


export class MagicMissle extends BaseWeapon {
    damage = 20;
    speed = 1000;
    time = 1000;

    constructor(args: BaseWeaponProps) {
        super({
            ...args,
            color: Color.Blue,
            width: undefined,
            height: undefined,
            radius: undefined,
            anchor: vec(0.5, 0.5),
            collider: Shape.Circle(20),
        });

        this.graphics.use(new Circle({
            radius: 10,
            color: Color.Blue
        }));
    }

    override onInitialize(engine: Engine): void {
        const { pos } = this;

    // Get all BaseEnemy actors in the scene
    const enemies = engine.currentScene.actors.filter(actor => actor instanceof BaseEnemy) as BaseEnemy[];

    if (enemies.length > 0) {
        // Find the closest BaseEnemy
        let closestEnemy = enemies[0];
        let minDistance = pos.distance(closestEnemy.pos);

        for (const enemy of enemies) {
            const distance = pos.distance(enemy.pos);
            if (distance < minDistance) {
                minDistance = distance;
                closestEnemy = enemy;
            }
        }

        // Set velocity towards the closest enemy
        const direction = closestEnemy.pos.sub(pos).normalize();
        this.vel = direction.scale(this.speed);
    }

        this.events.on('exitviewport', () => {
            this.kill()
        })
    }

    onEnemyCollisionSideEffects = (self: Collider, other: Collider, side: Side, contact: CollisionContact) => {
        this.kill();
    };
}