import { Collider, CollisionContact, Engine, Shape, Side, vec, Vector, Color, Rectangle, CollisionType } from "excalibur";

import { Resources } from "../../resources";
import { BASE_WEAPON_STATS, BaseWeapon, BaseWeaponProps } from "./baseWeapon";

const BASE_WIDTH = 5;
const BASE_HEIGHT = 100;

const SHIELD_WEAPON_MAP: BASE_WEAPON_STATS[] = [
    {damage: 5, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 5, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 5, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 5, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 5, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 5, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 5, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
];

export class Shield extends BaseWeapon {
    levelUpMap: BASE_WEAPON_STATS[] = SHIELD_WEAPON_MAP;
    acceleration = 500;
    throwSound = Resources.SoundThrow;
    timeToLive = 1000;

    constructor(args: BaseWeaponProps) {
        const height = BASE_HEIGHT + (BASE_HEIGHT * args.player.weaponSizeBonus);
        const width = BASE_WIDTH + (BASE_WIDTH * args.player.weaponSizeBonus);
        super({
            ...args,
            color: Color.Green,
            width: undefined,
            height: undefined,
            radius: undefined,
            anchor: vec(0.5, 0.5),
            collider: Shape.Box(width, height),
        });
        const acceleration = this.acceleration + (this.acceleration * args.player.weaponSpeedBonus);
        const angle = this.player.facingAngle;

        const direction = angle.normalize();

        this.vel = direction.scale(4);
        this.acc = direction.scale(acceleration)
        this.rotation = Math.atan2(direction.y, direction.x)
    }

    override onInitialize(engine: Engine): void {
        engine.clock.schedule(() => this.kill(), this.timeToLive);
        this.events.on('exitviewport', () => {
            this.kill()
        });

        this.actions.delay(100).callMethod(() => {
            this.throwSound.play(0.1)
        })
    }

    onPreUpdate(engine: Engine, elapsed: number): void {
        if (this.vel.magnitude > this.speed) {
            this.vel = this.vel.normalize().scale(this.speed)
        }

        // Update collision box
        this.collider.set( Shape.Box(this.width, this.height + this.height * (elapsed/1000)) );
        this.graphics.use(new Rectangle({
            height: this.height + this.height * (elapsed/1000),
            width: this.width,
            color: Color.Red,
        }));
    }

    onEnemyCollisionSideEffects = (self: Collider, other: Collider, side: Side, contact: CollisionContact) => {
        //this.kill();
    };

}