import { Circle, Color, Engine, Random, Scene, Timer, vec, Vector } from "excalibur";
import { Player } from "../../Actors/players/player";
import { ICON_SIDE, WeaponFactory } from "./base-weapon-factory";
import { MagicMissle } from "../../Actors/weapons/MagicMissle";

export class MagicMissleFactory extends WeaponFactory<MagicMissle> {
    id = 'magicMissle'
    private timer: Timer;
    icon = new Circle({
        radius: ICON_SIDE,
        color: Color.Blue
    })

    constructor(
        player: Player,
        scene: Scene,
    ) {
        super(player, scene, MagicMissle);
        this.timer = new Timer({
            interval: this.weaponCooldown,
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

    override levelUp(): void {
        this.weaponLevel++;
        this.timer.interval = this.timer.interval * 0.4;
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