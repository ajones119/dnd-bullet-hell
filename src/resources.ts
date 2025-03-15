import { ImageSource, Loader, Sound } from "excalibur";

// Define resources
export const Resources = {
  Background: new ImageSource("./images/mountain-bg.jpg"),
  GroundImage: new ImageSource("./images/ground.png"),
  LumberjackIdle: new ImageSource("./images/woodcutter/Woodcutter_idle.png"),
  LumberjackRun: new ImageSource("./images/woodcutter/Woodcutter_run.png"),
  LumberjackWalk: new ImageSource("./images/woodcutter/Woodcutter_walk.png"),
  LumberjackJump: new ImageSource("./images/woodcutter/Woodcutter_jump.png"),
  LumberjackAttack1: new ImageSource("./images/woodcutter/Woodcutter_attack1.png"),

  WolfWalk: new ImageSource("./images/wolf/wolfWalk.png"),
  WolfAttack: new ImageSource("./images/wolf/wolfAttack.png"),

  SlimeWalk: new ImageSource('./images/enemies/GreenSlime/Run.png'),
  SlimeAttack: new ImageSource('./images/enemies/GreenSlime/Run+Attack.png'),

  Hearts: [
    new ImageSource("./images/hearts/heartEmpty.png"),
    new ImageSource("./images/hearts/heartHalf.png"),
    new ImageSource("./images/hearts/heartFull.png"),
  ],

  BlueGem: new ImageSource("./images/dropIcons/blueGem21x21.png"),

  Dagger: new ImageSource("./images/weapons/dagger.png"),

  SoundThrow: new Sound("./sounds/weapons/sfx_throw.wav"),

} as const;

// Build a loader
export const loader = new Loader();

// Add all images to the loader (now simpler)
for (const res of Object.values(Resources)) {
  if (res instanceof ImageSource || res instanceof Sound) {
    loader.addResource(res);
  } else if (Array.isArray(res)) {
    res.forEach((img) => loader.addResource(img));
  }
}
