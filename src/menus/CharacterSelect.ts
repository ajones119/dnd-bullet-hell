import { Actor, Color, Engine, Font, Label, PointerComponent, Rectangle, Scene, vec, Vector } from "excalibur";

// Define available characters

export type SelectCharacterType = {id: number, name: string, color: Color}

const characters: SelectCharacterType[] = [
    { id: 0, name: 'Warrior', color: Color.Red },
    { id: 1, name: 'Mage', color: Color.Blue },
];

// Character Select Scene
export class CharacterSelectScene extends Scene {
    private selectedCharacter: SelectCharacterType | null = null;
    private startButton!: Actor;
    onInitialize(engine: Engine) {
        const tileSize = 100;
        const spacing = 20;
        const screenWidth = engine.drawWidth;
        const screenHeight = engine.drawHeight;
      // Character tiles
    characters.forEach((character, index) => {
        const x = (screenWidth / 2) - ((characters.length * (tileSize + spacing)) / 2) + index * (tileSize + spacing);
        const y = screenHeight / 2 - 50;

        // Character tile
        const tile = new Actor({
            pos: new Vector(x, y),
            width: tileSize,
            height: tileSize,
            color: character.color,
            anchor: vec(0, 0),
            z: -1
        });

        const border = new Actor({
            pos: new Vector(x - 5, y - 5),
            width: tileSize + 10,
            height: tileSize + 10,
            color: Color.Transparent,
            anchor: vec(0, 0),
        });

        tile.on('pointerup', () => this.selectCharacter(engine, tile, character));
        tile.on('pointerenter', () => {
            document.body.style.cursor = 'pointer';
        });

        tile.on('pointerleave', () => {
            document.body.style.cursor = 'default';
        });
        tile.addComponent(new PointerComponent());

        // Character name label
        const label = new Label({
            text: character.name,
            pos: new Vector(5, 5),
            color: Color.White,
            font: new Font({ size: 20 }),
            z: 1
        });

        tile.addChild(label)
        
        //add border to tile when it is = this.selected

        this.add(tile);
        
    });

      // Start button
    this.startButton = new Actor({
        pos: new Vector(screenWidth / 2, screenHeight - 100),
        width: 150,
        height: 50,
        color: Color.Gray
    });
    this.startButton.addComponent(new PointerComponent());
    this.startButton.on('pointerup', () => {
        if (this.selectedCharacter) {
            engine.goToScene('start', {sceneActivationData: {typeId: this.selectedCharacter.id}});
        }
    });

    const startLabel = new Label({
        text: 'Start',
        pos: new Vector(screenWidth / 2 - 30, screenHeight - 85),
        color: Color.White,
        font: new Font({ size: 24 })
    });

        this.add(this.startButton);
        this.add(startLabel);
}

private selectCharacter(engine: Engine, tile: Actor, character: SelectCharacterType) {
    // Reset all character tiles to their original colors
    this.actors.forEach((actor) => {
        const char = characters.find((c) => c.color.equal(actor.color) || actor === tile);
        if (char && actor !== tile) {
            actor.graphics.use(new Rectangle({
                width: actor.width,
                height: actor.height,
                color: char.color
            }));
        }
    });

    // Highlight selected tile
    tile.graphics.use(new Rectangle({
        width: tile.width,
        height: tile.height,
        color: Color.Yellow
    }));

    this.selectedCharacter = character;

    // Unlock start button
    this.startButton.graphics.use(new Rectangle({
        width: this.startButton.width,
        height: this.startButton.height,
        color: Color.Green
    }));
}

    }