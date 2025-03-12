import { Actor, Animation, clamp, Collider, CollisionContact, CollisionType, Color, Engine, EventEmitter, GameEvent, Keys, Side, SpriteSheet, Timer, vec, Vector } from "excalibur";
import { Resources } from "../../resources";
import { Config } from "../../config";
import { Score } from "../../ui/Score";
import { WeaponFactory } from "../../Factories/weapon-factories.ts/base-weapon-factory";
import { DaggerFactory } from "../../Factories/weapon-factories.ts/dagger-factory";
import { MagicMissleFactory } from "../../Factories/weapon-factories.ts/magic-missle-factory";
import { PlayerMagneticFieldSensor } from "./PlayerMagneticFieldSensor";
import { ProgressBar } from "../../ui/ProgressBar";
import { BaseEnemy } from "../enemies/baseEnemy";

export class PlayerDamagedEvent extends GameEvent<Player> {
  constructor(public target: Player) {
    super();
  }
}

export class ScoreEvent extends GameEvent<Player> {
    score: number = 0;
    constructor(score: number) {
        super();
        this.score = score;
    }
}

export class LevelUpEvent extends GameEvent<Player> {
  constructor(public level: number, public player: Player, increase: number) {
      super();
  }
}


type PlayerEvents = {
  playerDamaged: PlayerDamagedEvent;
  score: ScoreEvent;
  levelUp: LevelUpEvent;
}
const expForLevel = (lvl: number) => Math.floor(50 * Math.pow(lvl, 2)); // Quadratic growth

const getLevelFromExp = (currentExp: number): { level: number; nextLevelExp: number } => {

  let level = 1;
  while (expForLevel(level) <= currentExp) {
      level++;
  }
  level--; // Step back to the correct level

  const nextLevelExp = expForLevel(level + 1); // Total EXP required for next level

  return { level, nextLevelExp };
}

export class Player extends Actor {
  //state
  public events = new EventEmitter<ex.ActorEvents & PlayerEvents>();
  //base
  facingAngle: Vector = vec(1, 1);
  health = 100;
  maxHealth = 100;
  magneticSpeed = 100;
  knockback = 100;
  attack = 10;
  speed = 100;
  weapons: WeaponFactory<any>[] = [];
  xp = 0;

  //bonus multiplier
  xpBonus = 0;
  speedBonus = 0;
  knockBackBonus = 0;
  maxHealthBonus = 0;
  attackBonus = 0;
  weaponSpeedBonus = 0;
  areaOfEffectBonus = 0;
  weaponSizeBonus = 0;

  walkAnimation!: Animation;
  idleAnimation!: Animation;
  runAnimation!: Animation;

  // ui labels
  scoreLabel = new Score(0);
  xpLabel!: ProgressBar;
  healthLabel!: ProgressBar;

  constructor(engine: Engine, startingPosition: Vector) {
    super({
      name: 'Player',
      pos: startingPosition,
      width: 48,
      height: 62,
      color: Color.Red,
      collisionType: CollisionType.Active
    });
  }

  override onInitialize(engine: Engine): void {
    const spriteSheetIdle = SpriteSheet.fromImageSource({
      image: Resources.LumberjackIdle,
      grid: {
          rows: 1,
          columns: 4,
          spriteWidth: 48,
          spriteHeight: 48,
      }
    });
    this.idleAnimation = Animation.fromSpriteSheet(
        spriteSheetIdle,
        [0, 1, 2, 3],
        Config.PlayerAnimationSpeed
    );
    this.graphics.add('idle', this.idleAnimation);

    const spriteSheetWalk = SpriteSheet.fromImageSource({
      image: Resources.LumberjackWalk,
      grid: {
          rows: 1,
          columns: 6,
          spriteWidth: 48,
          spriteHeight: 48,
      }
    });
    this.walkAnimation = Animation.fromSpriteSheet(
        spriteSheetWalk,
        [0, 1, 2, 3, 4, 5],
        Config.PlayerAnimationSpeed
    );
    this.graphics.add('walk', this.walkAnimation);

    const spriteSheetRun = SpriteSheet.fromImageSource({
      image: Resources.LumberjackRun,
      grid: {
          rows: 1,
          columns: 6,
          spriteWidth: 48,
          spriteHeight: 48,
      }
    });
    this.runAnimation = Animation.fromSpriteSheet(
      spriteSheetRun,
        [0, 1, 2, 3, 4, 5],
        Config.PlayerAnimationSpeed
    );
    this.graphics.add('run', this.runAnimation)


    this.graphics.use('idle')

    this.addChild(this.scoreLabel);

    this.events.on('score', (event) => {
      this.scoreLabel.addScore(event.score);
    });

    this.startWeaponsFactories();

    const magneticField = new PlayerMagneticFieldSensor(this);
    this.addChild(magneticField);

    this.xpLabel = new ProgressBar(0, 0, engine.drawWidth, engine.drawHeight * 0.03, Color.Black, Color.Blue)
    engine.currentScene.add(this.xpLabel);

    this.healthLabel = new ProgressBar(0, engine.drawHeight * 0.03, engine.drawWidth, engine.drawHeight * 0.03, Color.Red, Color.Green)
    this.healthLabel.setProgress(1)
    engine.currentScene.add(this.healthLabel);
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    let movement = Vector.Zero.clone();

    if (engine.input.keyboard.isHeld(Keys.A)) {
      movement.x -= 1;
    }
    if (engine.input.keyboard.isHeld(Keys.D)) {
      movement.x += 1;
    }
    if (engine.input.keyboard.isHeld(Keys.W)) {
      movement.y -= 1;
    }
    if (engine.input.keyboard.isHeld(Keys.S)) {
      movement.y += 1;
    }
    this.vel = movement.normalize().scale(this.getSpeed())
    if (!this.vel.equals(Vector.Zero)) {
      this.facingAngle = (movement.normalize())
    }
    this.handleAnimation();
  }

  //this function looks at the entire state  and determines what animation should be playing
  handleAnimation() {
  if (Math.abs(this.vel.x) < 20) {
      this.graphics.use('idle');
      return;
    }else if (Math.abs(this.vel.x) < 250) {
      this.graphics.use('walk');
      return;
    } else if (Math.abs(this.vel.x) > 250) {
      this.graphics.use('run');
      return;
    }
  }

  startWeaponsFactories() {
    this.weapons.forEach(factory => {
      factory.start();
    })
  }

  // calculation functions alongside bonuses
  public getMaxHealth() {
    return this.maxHealth + this.maxHealth*this.maxHealthBonus;
  }

  public getKnockback() {
    return this.knockback + this.knockback*this.knockBackBonus;
  }

  public getSpeed() {
    return this.speed + this.speed*this.speedBonus;
  }

  public takeDamage(damage: number) {
    this.health -= damage;
    this.healthLabel.setProgress(this.health/this.getMaxHealth())
    if (this.health <= 0) {
      this.actions.fade(0, 1000).die();
    } else {
      //blink and tint red
      this.actions.flash(Color.Red, 400);
    }
    
  }

  public heal(heal: number) {
    this.health -= heal;
    const maxHealth = this.getMaxHealth()
    this.healthLabel.setProgress(this.health/maxHealth)
    this.actions.flash(Color.Green, 400);
    if (this.health >= maxHealth) {
      this.health = maxHealth
    }
    
  }

  public addXp(xp: number) {
    //did player level up?
    const newXp = this.xp + (xp + xp * this.xpBonus);
    const {level} = getLevelFromExp(this.xp);
    const {level: newLevel, nextLevelExp} = getLevelFromExp(newXp);
    if (newLevel > level) {
      this.events.emit('levelUp', new LevelUpEvent(newLevel, this, newLevel - level))
    }

    this.xp = newXp;
    this.xpLabel.setProgress(newXp/nextLevelExp);
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    console.log(contact)
    if (other.owner instanceof BaseEnemy) {
      console.log(contact)
      const enemy = other.owner;
      const knockbackDir = enemy.pos.sub(this.pos).normalize();

      // Apply impulse for kickback effect
      enemy.vel = knockbackDir.scale(this.getKnockback());
    }
    // Called when a pair of objects are in contact

  }
}
