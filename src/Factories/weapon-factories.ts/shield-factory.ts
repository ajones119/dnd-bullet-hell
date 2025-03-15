import { Circle, Color, Scene, Timer, vec } from "excalibur";
import { Player } from "../../Actors/players/player";
import { ICON_SIDE, WeaponFactory } from "./base-weapon-factory";
import { Shield } from "../../Actors/weapons/Shield";

export class ShieldFactory extends WeaponFactory<Shield> {
    id = 'shield';
    private timer: Timer;
    icon = new Circle({
        radius: ICON_SIDE,
        color: Color.Purple
    });

    constructor(
        player: Player,
        scene: Scene,
    ) {
        super(player, scene, Shield);
        const templateWeapon = new Shield({player, pos: player.pos, angle: vec(0, 0)});
        this.timer = new Timer({
            interval: templateWeapon.cooldown,
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
            if (actor instanceof Shield)
                actor.kill()
            
        }
    }
}