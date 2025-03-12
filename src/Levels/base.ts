import { Actor, Collider, Color, CollisionType, DefaultLoader, Engine, EventEmitter, ExcaliburGraphicsContext, GameEvent, Keys, Random, Rectangle, Scene, SceneActivationContext, Shape, Tile, TileMap, vec, EdgeCollider, PolygonCollider } from "excalibur";
import { Player } from "../Actors/players/player";
import { Resources } from "../resources";
import { WolfFactory } from "../Factories/enemy-factories.ts/wolf factory";
import { PauseMenu } from "../menus/PauseMenu/PauseMenu";
import { LevelUpMenu } from "../menus/LevelUpMenu/LevelupMenu";
import { Warrior } from "../Actors/players/Warrior";
import { Mage } from "../Actors/players/Mage";

const TILE_WIDTH = 240;
const TILE_HEIGHT = 240;

const baseMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]


export class BaseLevel extends Scene {
    player!: Player;    
    background!: Actor;

    mapWidth = 10;
    mapHeight = 10;

    get tileMap(): TileMap {
        const tilemap = new TileMap({
            rows: baseMap[0].length,
            columns: baseMap.length,
            tileHeight: TILE_HEIGHT,
            tileWidth: TILE_WIDTH,
            
        });
        tilemap.z = -2;

        for (let y = 0; y < baseMap.length; y++) {
            for (let x = 0; x < baseMap[y].length; x++) {
                const tile = tilemap.getTile(x, y); // Get the tile at (x, y)
                if (tile) {
                    if (baseMap[y][x] === 1) {
                        tile.solid = true; // Make wall tiles solid
                        tile.addGraphic(new Rectangle({
                            width: TILE_WIDTH,
                            height: TILE_HEIGHT,
                            color: Color.Black, // Black background for walls
                        }));
                        
                    } else {
                        tile.solid = false; // Make empty tiles walkable
                        tile.addGraphic(new Rectangle({
                            width: TILE_WIDTH,
                            height: TILE_HEIGHT,
                            color: Color.Gray, // Green background for walls
                        }));
                    }
                }
            }
        }
        return tilemap;
    }

    override onInitialize(engine: Engine): void {
        //this.createScene(engine);

    }

    override onActivate(context: SceneActivationContext<unknown>): void {

        // Clear everything
        //this.clear();

        // Recreate scene from scratch
        this.createScene(this.engine);
    }

    createScene (engine: Engine) {
        this.clear()
        this.add(this.tileMap)

        this.player = new Warrior(engine, vec(this.tileMap.width/2, this.tileMap.height/2)); // Assuming Warrior is a concrete subclass of Player
        this.add(this.player); // Actors need to be added to a scene to be drawn

        this.player.events.on('kill', () => {
            this.triggerGameOver();
        });

        const levelUpMenu = new LevelUpMenu(engine)

        this.player.events.on('levelUp', event => {
            levelUpMenu.show(event.player)
        });

        const factory = new WolfFactory(this, 1500)
        factory.start()

        this.camera.strategy.lockToActor(this.player)

        const pauseMenu = new PauseMenu(engine);
        this.engine.input.keyboard.on('press', (event) => {
            if(event.key === Keys.Esc)
                pauseMenu.show()
        });
    }


    triggerGameOver() {
        this.engine.goToScene('gameOver')
    }

    override onPreLoad(loader: DefaultLoader): void {
        // Add any scene specific resources to load
    }

    override onDeactivate(context: SceneActivationContext): void {
        // Called when Excalibur transitions away from this scene
        // Only 1 scene is active at a time
        console.log('DEACTIVATE')
        this.clear();
    }

    override onPreUpdate(engine: Engine, elapsedMs: number): void {
        // Called before anything updates in the scene
    }

    override onPostUpdate(engine: Engine, elapsedMs: number): void {
        // Called after everything updates in the scene
    }

    override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called before Excalibur draws to the screen
    }

    override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called after Excalibur draws to the screen
    }
}