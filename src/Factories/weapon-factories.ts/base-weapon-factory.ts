import { Color, Graphic, Rectangle, Scene, Vector } from "excalibur";
import { BaseWeapon, BaseWeaponProps } from "../../Actors/weapons/baseWeapon";
import { Player } from "../../Actors/players/player";

export const ICON_SIDE = 48;

//TODO
/*
    give weapon the cooldown timing and write for cloning the weapoin instead of making new
    can do this by creating a template weapon on construct, and setting a new weapon on level up?
    should the weapon hold its own level isntead of the factory? 
*/

export abstract class WeaponFactory<T extends BaseWeapon> {
    id: string = 'baseWeapon';
    protected player: Player;
    protected scene: Scene;
    protected weaponType: new (prop: BaseWeaponProps) => T;
    protected templateWeapon!: T;

    protected weaponLevel: number = 1;
    protected _weaponCooldown: number = 1000;
    get weaponCooldown() {
        return this._weaponCooldown - this.player.cooldownReduction * this._weaponCooldown
    }

    public icon: Graphic = new Rectangle({
        height: ICON_SIDE/2,
        width: ICON_SIDE,
        color: Color.Red
    })

    constructor(
        player: Player,
        scene: Scene,
        weaponType: new (prop: BaseWeaponProps) => T
    ) {
        this.player = player;
        this.scene = scene;
        this.weaponType = weaponType;
        this.templateWeapon = new this.weaponType({player: this.player, level: 1})
    }

    public levelUp() {
        this.weaponLevel++;
    }

    abstract spawnWeapon: () => void

    abstract start: () => void

    abstract stop: () => void

    abstract reset: () => void
}