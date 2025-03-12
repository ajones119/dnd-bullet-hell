import { Collider, CollisionContact, Engine, Shape, Side, vec, Vector, Color } from "excalibur";

import { Resources } from "../../resources";
import { BaseWeapon, BaseWeaponProps } from "./baseWeapon";

export class Dagger extends BaseWeapon {
    damage = 20;
    speed = 1000;
    time = 1000;
    acceleration = 500;

    throwSound = Resources.SoundThrow;
        

    constructor(args: BaseWeaponProps) {
        const angle = args?.angle || Vector.Zero;

        super({
            ...args,
            color: Color.Green,
            width: undefined,
            height: undefined,
            radius: undefined,
            anchor: vec(0.5, 0.5),
            collider: Shape.Box(100, 25),
        })

        //need to flip the graphic
        const weaponImage = Resources.Dagger.toSprite()
        weaponImage.width = 100;
        weaponImage.height = 25;
        weaponImage.scale = vec(-1, 1);  // Flip horizontally
        
        this.graphics.use(weaponImage);

        const direction = angle.normalize();

        this.vel = direction.scale(-1);
        this.acc = direction.scale(this.acceleration)
        this.rotation = Math.atan2(direction.y, direction.x)
    }

    override onInitialize(engine: Engine): void {

        this.events.on('exitviewport', () => {
            this.kill()
        });

        this.actions.delay(500).callMethod(() => {
            this.throwSound.play(0.1)
        })
    }

    onPreUpdate(engine: Engine, elapsed: number): void {
        if (this.vel.magnitude > this.speed) {
            this.vel = this.vel.normalize().scale(this.speed)
        }
        
    }

    onEnemyCollisionSideEffects = (self: Collider, other: Collider, side: Side, contact: CollisionContact) => {
        this.kill();
    };

}