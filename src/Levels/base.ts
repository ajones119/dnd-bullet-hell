import { Actor, Collider, Color, CollisionType, DefaultLoader, Engine, EventEmitter, ExcaliburGraphicsContext, GameEvent, Keys, Random, Rectangle, Scene, SceneActivationContext, Shape, Tile, TileMap, vec, EdgeCollider, PolygonCollider, Vector, StandardClock } from "excalibur";
import { Player } from "../Actors/players/player";
import { Resources } from "../resources";
import { WolfFactory } from "../Factories/enemy-factories.ts/wolf factory";
import { PauseMenu } from "../menus/PauseMenu/PauseMenu";
import { LevelUpMenu } from "../menus/LevelUpMenu/LevelupMenu";
import { Warrior } from "../Actors/players/Warrior";
import { Mage } from "../Actors/players/Mage";
import { SlimeFactory } from "../Factories/enemy-factories.ts/slime-factory";

function makePlayerFromId (id: number, engine: Engine, startingPosition: Vector): Player {
    switch (id) {
        case 0: 
            return new Warrior(engine, startingPosition);
        case 1:
            return new Mage(engine, startingPosition);
        default:
            return new Player(engine, startingPosition);
    }
}

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
        
    }

    private initializePlayer(engine: Engine, typeId = 0) {
        this.player = makePlayerFromId(typeId, engine, vec(this.tileMap.width/2, this.tileMap.height/2));
        this.add(this.player)
    }

    initializeLevel(engine: Engine) {
        this.add(this.tileMap)
    }

    private initializeMenus(engine: Engine) {
        const levelUpMenu = new LevelUpMenu(engine)
        this.player.events.on('levelUp', event => {
            console.log('levelUP')
            levelUpMenu.show(event.player)
        });

        const pauseMenu = new PauseMenu(engine);
        this.engine.input.keyboard.on('press', (event) => {
            if(event.key === Keys.Esc)
                pauseMenu.show()
        });
    }

    initializeWaves(engine: Engine) {
        const wolffactory = new WolfFactory(this);
        const slimefactory = new SlimeFactory(this);
        wolffactory.startStandardOffscreenSpawn(2000);
        slimefactory.startStandardOffscreenSpawn(3000);


        //1 minute
        engine.clock.schedule(() => {
            slimefactory.spawnCircleAroundPoint(this.player.pos, 500, 20);
            wolffactory.offscreenStandardTimer.interval = 1000;
            slimefactory.offscreenStandardTimer.interval = 1000;
        }, 60*1000)

    }

    override onActivate(context: SceneActivationContext<{ typeId: number }>): void {
        const engine = this.engine;

        this.clear()
        this.initializeLevel(engine);
        this.initializePlayer(engine, context?.data?.typeId);
        this.initializeMenus(engine)
        this.initializeWaves(engine)

        this.player.events.on('kill', () => {
            this.triggerGameOver();
        });
        this.camera.strategy.lockToActor(this.player)
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