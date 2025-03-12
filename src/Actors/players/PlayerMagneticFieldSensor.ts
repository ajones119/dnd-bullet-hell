import { Actor, Animation, clamp, Collider, CollisionContact, CollisionType, Color, Engine, EventEmitter, GameEvent, Keys, Side, SpriteSheet, Timer, vec, Vector } from "excalibur";
import { Resources } from "../../resources";
import { Config } from "../../config";
import { Score } from "../../ui/Score";
import { BaseWeapon } from "../weapons/baseWeapon";
import { WeaponFactory } from "../../Factories/weapon-factories.ts/base-weapon-factory";
import { Dagger } from "../weapons/Dagger";
import { DaggerFactory } from "../../Factories/weapon-factories.ts/dagger-factory";
import { MagicMissleFactory } from "../../Factories/weapon-factories.ts/magic-missle-factory";
import { Player } from "./player";
import { BaseDropItem } from "../DropItems/baseDropItem";

export class PlayerMagneticFieldSensor extends Actor {

    constructor(private target: Player) {
        super({
            name: 'PlayerMagneticField',
            pos:  Vector.Zero,
            radius: 100,
            color: Color.Yellow,
            collisionType: CollisionType.Passive, // No physical interaction
            z: -1
        });
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        if (other.owner instanceof BaseDropItem) {
            other.owner.setTarget(this.target)
        }
    }
}
