import { Circle, Color, Scene, Timer, vec } from "excalibur";
import { Player } from "../../Actors/players/player";
import { ICON_SIDE, WeaponFactory } from "./base-weapon-factory";
import { Dagger } from "../../Actors/weapons/Dagger";

export class DaggerFactory extends WeaponFactory<Dagger> {
    id = 'dagger';
    private timer: Timer;
    icon = new Circle({
        radius: ICON_SIDE,
        color: Color.Green
    })

    constructor(
        player: Player,
        scene: Scene,
    ) {
        super(player, scene, Dagger);
        this.timer = new Timer({
            interval: this.templateWeapon.cooldown,
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
        if (this.weaponLevel > 1) {
            const pos = this.player.pos.add(vec(1, 1).scale(20));
            const angle = this.player.facingAngle;
            const templateWeapon = new this.weaponType({player: this.player, pos, angle});
            this.scene.add(templateWeapon)
        }

        
    }

    start = () => {
        this.timer.start();
    }

    stop = () => {
        this.timer.cancel()
    }

    reset = () => {
        for (const actor of this.scene.actors) {
            if (actor instanceof Dagger)
                actor.kill()
            
        }
    }
}