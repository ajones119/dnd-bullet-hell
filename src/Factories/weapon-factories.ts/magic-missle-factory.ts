import { Engine, Random, Scene, Timer, vec, Vector } from "excalibur";
import { Player } from "../../Actors/players/player";
import { WeaponFactory } from "./base-weapon-factory";
import { MagicMissle } from "../../Actors/weapons/MagicMissle";

export class MagicMissleFactory extends WeaponFactory<MagicMissle> {
    private timer: Timer;

    constructor(
        player: Player,
        scene: Scene,
    ) {
        super(player, scene, MagicMissle);
        const templateWeapon = new MagicMissle({player, pos: player.pos, angle: vec(0, 0)});
        this.timer = new Timer({
            interval: templateWeapon.time,
            repeats: true,
            action: () => this.spawnWeapon()
        });
        this.scene.add(this.timer);
    }

    spawnWeapon = () => {
        const pos = this.player.pos;
        const angle = this.player.facingAngle;
        const templateWeapon = new this.weaponType({player: this.player, pos, angle});
        this.scene.add(templateWeapon)
    }

    start = () => {
        this.timer.start();
    }

    stop = () => {
        this.timer.cancel()
    }

    reset = () => {
        for (const actor of this.scene.actors) {
            if (actor instanceof MagicMissle)
                actor.kill()
            
        }
    }
}