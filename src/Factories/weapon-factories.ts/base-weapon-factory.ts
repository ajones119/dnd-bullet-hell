import { Engine, Random, Scene, Timer, vec, Vector } from "excalibur";
import { BaseWeapon, BaseWeaponProps } from "../../Actors/weapons/baseWeapon";
import { Player } from "../../Actors/players/player";

export abstract class WeaponFactory<T extends BaseWeapon> {
    protected player: Player;
    protected scene: Scene;
    protected weaponType: new (prop: BaseWeaponProps) => T;
    protected weaponLevel: number = 1;

    constructor(
        player: Player,
        scene: Scene,
        weaponType: new (prop: BaseWeaponProps) => T
    ) {
        this.player = player;
        this.scene = scene;
        this.weaponType = weaponType;
    }

    public levelUp() {
        this.weaponLevel++;
    }

    abstract spawnWeapon: () => void

    abstract start: () => void

    abstract stop: () => void

    abstract reset: () => void
}