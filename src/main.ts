import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { GameOverScene } from "./gameOver";
import { BaseLevel } from "./Levels/base";
import { Player } from "./Actors/players/player";
import { CharacterSelectScene, SelectCharacterType } from "./menus/CharacterSelect";


const game = new Engine({
  width: 800, // Logical width and height in game pixels
  height: 600,
  displayMode: DisplayMode.FillScreen, // Display mode tells excalibur how to fill the window
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  scenes: {
    start: BaseLevel,
    gameOver: GameOverScene,
    characterSelect: CharacterSelectScene
  },
  // physics: {
  //   solver: SolverStrategy.Realistic,
  //   substep: 5 // Sub step the physics simulation for more robust simulations
  // },
  // fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});

game.start('characterSelect', { // name of the start scene 'start'
  loader, // Optional loader (but needed for loading images/sounds)
  inTransition: new FadeInOut({ // Optional in transition
    duration: 1000,
    direction: 'in',
    color: Color.Black
  })
}).then(() => {
  // Do something after the game starts
});