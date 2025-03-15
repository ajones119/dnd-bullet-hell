import { Actor, Color, Engine, Font, Label, ScreenElement, TextAlign } from "excalibur";

export class LevelUpUI extends ScreenElement {

    constructor() {
        super({ x: 0, y: 0, width: 800, height: 600 });
    }

    onInitialize(engine: Engine) {
        const text = new Label({
            text: "Choose an upgrade!",
            x: 400,
            y: 100,
            font: new Font({ size: 24, textAlign: TextAlign.Center })
        });

        const button1 = new Actor({ x: 300, y: 300, width: 150, height: 50, color: Color.Red });
        const button2 = new Actor({ x: 500, y: 300, width: 150, height: 50, color: Color.Blue });

        button1.on("pointerup", () => this.selectUpgrade("damage", engine));
        button2.on("pointerup", () => this.selectUpgrade("speed", engine));

        this.addChild(text);
        this.addChild(button1);
        this.addChild(button2);
    }

    selectUpgrade(choice: string, engine: Engine) {
        engine.currentScene.remove(this); // Hide UI
        engine.start(); // Resume game
    }
}
