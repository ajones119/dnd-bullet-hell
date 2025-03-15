import { Collider, CollisionContact, Engine, Shape, Side, vec, Vector, Color } from "excalibur";

import { Resources } from "../../resources";
import { BASE_WEAPON_STATS, BaseWeapon, BaseWeaponProps } from "./baseWeapon";

const BASE_WIDTH = 50;
const BASE_HEIGHT = 10;

const DAGGER_WEAPON_MAP: BASE_WEAPON_STATS[] = [
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
];

export class Dagger extends BaseWeapon {
    levelUpMap: BASE_WEAPON_STATS[] = DAGGER_WEAPON_MAP;
    acceleration = 500;
    

    throwSound = Resources.SoundThrow;
        

    constructor(args: BaseWeaponProps) {
        const angle = args?.angle || Vector.Zero;
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
        })
        const acceleration = this.acceleration + (this.acceleration * args.player.weaponSpeedBonus);

        //need to flip the graphic
        const weaponImage = Resources.Dagger.toSprite()
        weaponImage.width = width;
        weaponImage.height = height;
        weaponImage.scale = vec(-1, 1);  // Flip horizontally
        
        this.graphics.use(weaponImage);

        const direction = angle.normalize();

        this.vel = direction.scale(-1);
        this.acc = direction.scale(acceleration)
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