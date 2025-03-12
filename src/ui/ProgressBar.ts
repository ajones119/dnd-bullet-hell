import { ScreenElement, Color, Engine, GraphicsGroup, Rectangle, Vector } from "excalibur";

export class ProgressBar extends ScreenElement {
    private progress: number = 0;
    targetProgress: number = 0;
    private bgColor: Color;
    private fgColor: Color;
    private bgRect!: Rectangle;
    private fgRect!: Rectangle;
    private barWidth: number = 0;
    private barHeight: number = 0;

    constructor(x: number, y: number, width: number, height: number, bgColor: Color = Color.Gray, fgColor: Color = Color.Green) {
        super({ pos: new Vector(x, y), name: "progressBar" });
        this.bgColor = bgColor;
        this.fgColor = fgColor;
        this.barWidth = width;
        this.barHeight = height;
    }

    onInitialize(engine: Engine) {
        // Create background and foreground rectangles once
        this.bgRect = new Rectangle({
            width: this.barWidth,
            height: this.barHeight,
            color: this.bgColor,
        });
        
        this.fgRect = new Rectangle({
            width: 0, // Start with 0 width
            height: this.barHeight,
            color: this.fgColor,
        });

        // Use a GraphicsGroup to layer the rectangles
        this.graphics.use(new GraphicsGroup({
            members: [
                { graphic: this.bgRect, offset: Vector.Zero },
                { graphic: this.fgRect, offset: Vector.Zero },
            ]
        }));
    }

    setProgress(value: number) {
        this.targetProgress = Math.max(0, Math.min(1, value));
    }

    onPostUpdate(engine: Engine, delta: number) {
        // Smoothly interpolate progress
        const speed = 0.01;
        this.progress += (this.targetProgress - this.progress) * speed * delta;
        // Ensure the progress reaches exactly the target (avoiding endless approach)
        if (Math.abs(this.progress - this.targetProgress) < 0.01) {
            this.progress = this.targetProgress;
        }

        // Update foreground rectangle width directly
        this.fgRect.width = this.barWidth * this.progress;
    }
}