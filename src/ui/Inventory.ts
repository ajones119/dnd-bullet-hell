import { ScreenElement, Actor, Sprite, Color, vec, Label, FontUnit, TextAlign, Scene, Engine } from 'excalibur';
import { Player } from '../Actors/players/player';

const BOX_SIDE = 48;

class InventoryUI extends ScreenElement {
    constructor(player: Player, public scene: Scene) {
        super({ z: 100 }); // Ensure it's drawn on top
        this.updateInventory(player);
        player.events.on('inventoryChange', (event) => this.updateInventory(event.player))
        this.updateInventory(player);
    }
    
    updateInventory(player: Player) {
        this.clearComponents()  
        console.log('UPDATE INVENTORY', player)
        const weaponBoxSize = 50;
        const paddingX = 10;
        const paddingY = 100;
        const totalWidth = player.maxWeapons * (weaponBoxSize + paddingX) - paddingX;
        const startX = this.scene.engine.drawWidth - totalWidth - paddingX;

        player.weapons.forEach((weapon, index) => {
            const x = startX + index * (BOX_SIDE + paddingX);
            const y = paddingY;

            const box = new ScreenElement({
            pos: vec(x, y),
            width: BOX_SIDE,
            height: BOX_SIDE,
            color: Color.Black
            });
            this.scene.add(box);
            console.log(weapon)
        if (weapon.icon) {
            const iconSprite = weapon.icon.clone();
            iconSprite.scale.setTo(BOX_SIDE / iconSprite.width, BOX_SIDE / iconSprite.height);
            console.log(iconSprite.width, BOX_SIDE, BOX_SIDE / iconSprite.width, BOX_SIDE / iconSprite.height)
            const icon = new ScreenElement({ pos: vec(0, 0) });
            icon.graphics.use(iconSprite);
            box.addChild(icon)
        }
        });

    // Add empty slots
        for (let i = player.weapons.length; i < player.maxWeapons; i++) {
            const x = startX + i * (BOX_SIDE + paddingX);
            const y = paddingY;

            const emptyBox = new ScreenElement({
            pos: vec(x, y),
            width: BOX_SIDE,
            height: BOX_SIDE,
            color: Color.Azure
            });
            this.scene.add(emptyBox);
        }
    }
    }
    
    export default InventoryUI;
