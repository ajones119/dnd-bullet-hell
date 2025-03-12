import { Actor, Animation, Collider, CollisionContact, Color, Engine, Rectangle, Shape, Side, SpriteSheet, vec, Vector } from "excalibur";
import { Resources } from "../../resources";
import { BaseDropItem } from "./baseDropItem";

export class SmallXp extends BaseDropItem {
    constructor(engine: Engine, pos: Vector) {
        super(engine, pos);
        this.graphic = Resources.BlueGem.toSprite();
    }

    onInitialize(engine: Engine): void {
        this.graphics.use(this.graphic);
        this.collider.set(Shape.Box(21, 21))
        this.actions.repeatForever((ctx) => {
            ctx.moveBy({offset: vec(0, -5), duration: 500});
            ctx.moveBy({offset: vec(0, 5), duration: 500});
        })
    }

    collideWithTargetEffect = () => {
        this.target?.addXp(5)
    }
}